import { NextResponse } from "next/server";

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) return NextResponse.json({ error: "OPENAI_API_KEYが未設定です。モック会話を使えます。" }, { status: 503 });
  const { instructions, speechSpeed } = await request.json();
  const speed = Math.max(0.25, Math.min(1.5, Number(speechSpeed) || 1));
  const model = process.env.OPENAI_REALTIME_MODEL || "gpt-realtime";
  const headers: Record<string, string> = { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" };
  if (process.env.OPENAI_ORGANIZATION) headers["OpenAI-Organization"] = process.env.OPENAI_ORGANIZATION;
  const response = await fetch("https://api.openai.com/v1/realtime/client_secrets", {
    method: "POST",
    headers,
    body: JSON.stringify({ session: { type: "realtime", model, instructions, audio: { input: { transcription: { model: "gpt-4o-mini-transcribe" } }, output: { voice: "marin", speed } } } }),
  });
  const data = await response.json();
  if (!response.ok) return NextResponse.json({ error: data.error?.message || "OpenAIへの接続に失敗しました" }, { status: response.status });
  return NextResponse.json({ clientSecret: data.value, model });
}
