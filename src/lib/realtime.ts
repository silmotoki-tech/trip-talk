import { TranscriptLine } from "./types";

export interface LiveConnection {
  close: () => void;
}

function hasDisallowedLanguage(text: string) {
  const disallowedScript = /[\p{Script=Hangul}\p{Script=Cyrillic}\p{Script=Arabic}\p{Script=Thai}\p{Script=Devanagari}]/u;
  const commonSimplifiedChinese = /[这们吗说请问为语时过样现发应对没个听让从还会]/;
  return disallowedScript.test(text) || commonSimplifiedChinese.test(text);
}

export async function connectRealtime(
  instructions: string,
  speechSpeed: number,
  onLine: (line: TranscriptLine) => void,
  onStatus: (status: string) => void,
): Promise<LiveConnection> {
  onStatus("マイクの使用許可を確認しています…");
  if (!navigator.mediaDevices?.getUserMedia) {
    throw new Error("このブラウザではマイクを利用できません。SafariまたはChromeで開いてください。");
  }
  let stream: MediaStream;
  try {
    stream = await Promise.race([
      navigator.mediaDevices.getUserMedia({ audio: true }),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error("MICROPHONE_TIMEOUT")), 15000)),
    ]);
  } catch (error) {
    if (error instanceof Error && error.message === "MICROPHONE_TIMEOUT") {
      throw new Error("マイクの許可を確認できませんでした。ブラウザのサイト設定でマイクを許可して、もう一度お試しください。");
    }
    if (error instanceof DOMException && (error.name === "NotAllowedError" || error.name === "PermissionDeniedError")) {
      throw new Error("マイクが許可されていません。ブラウザのサイト設定でマイクを許可してください。");
    }
    throw new Error("マイクを開始できませんでした。SafariまたはChromeでマイク設定を確認してください。");
  }

  onStatus("OpenAIへ接続しています…");
  const tokenResponse = await fetch("/api/realtime/token", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ instructions, speechSpeed }) });
  if (!tokenResponse.ok) {
    stream.getTracks().forEach((track) => track.stop());
    throw new Error((await tokenResponse.json()).error || "短期トークンを取得できませんでした");
  }
  const { clientSecret } = await tokenResponse.json();
  const pc = new RTCPeerConnection();
  const audio = document.createElement("audio");
  audio.autoplay = true;
  pc.ontrack = (event) => { audio.srcObject = event.streams[0]; };
  stream.getTracks().forEach((track) => pc.addTrack(track, stream));
  const dc = pc.createDataChannel("oai-events");
  dc.onopen = () => {
    dc.send(JSON.stringify({ type: "session.update", session: { type: "realtime", instructions } }));
    onStatus("接続しました。英語で話しかけてください");
  };
  dc.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === "conversation.item.input_audio_transcription.completed" && data.transcript) onLine({ role: "user", text: data.transcript, at: Date.now() });
    if (data.type === "response.output_audio_transcript.done" && data.transcript) {
      if (hasDisallowedLanguage(data.transcript)) {
        onStatus("許可されていない言語を検知したため、英語で言い直します");
        dc.send(JSON.stringify({ type: "response.create", response: { instructions: "The previous response used a disallowed language. Restate it now in simple English only. Do not mention this correction or any language policy." } }));
        return;
      }
      onLine({ role: "assistant", text: data.transcript, at: Date.now() });
    }
  };
  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
  const sdpResponse = await fetch("https://api.openai.com/v1/realtime/calls", { method: "POST", body: offer.sdp, headers: { Authorization: `Bearer ${clientSecret}`, "Content-Type": "application/sdp" } });
  if (!sdpResponse.ok) {
    const detail = await sdpResponse.text();
    pc.close();
    stream.getTracks().forEach((track) => track.stop());
    let reason = "";
    try {
      const parsed = JSON.parse(detail);
      reason = parsed.error?.message || "";
    } catch {}
    throw new Error(reason ? `Realtime接続エラー: ${reason}` : `Realtime接続を開始できませんでした（${sdpResponse.status}）`);
  }
  await pc.setRemoteDescription({ type: "answer", sdp: await sdpResponse.text() });
  return { close: () => { dc.close(); pc.close(); stream.getTracks().forEach((track) => track.stop()); } };
}
