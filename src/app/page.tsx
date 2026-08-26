"use client";

import { useState } from "react";
import { chatGptInstructions, SCENARIOS, USERS } from "@/lib/scenarios";
import { storage } from "@/lib/storage";
import { Difficulty, UserId } from "@/lib/types";

export default function Home() {
  const [userId, setUserId] = useState<UserId>("tamoyan");
  const baseUser = USERS.find((item) => item.id === userId)!;
  const [difficulty, setDifficulty] = useState<Difficulty>(baseUser.difficulty);
  const user = { ...baseUser, difficulty };
  const scenario = SCENARIOS[user.scenarioId];
  const [sceneId, setSceneId] = useState(SCENARIOS[baseUser.scenarioId].scenes[0].id);
  const scene = scenario.scenes.find((item) => item.id === sceneId) ?? scenario.scenes[0];
  const [phase, setPhase] = useState<"home" | "preview">("home");
  const [translationOpen, setTranslationOpen] = useState(false);
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [revealedNotes, setRevealedNotes] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);

  const chooseUser = (nextId: UserId) => {
    const nextUser = USERS.find((item) => item.id === nextId)!;
    setUserId(nextId);
    setDifficulty(storage.loadDifficulty(nextId, nextUser.difficulty));
    setSceneId(SCENARIOS[nextUser.scenarioId].scenes[0].id);
  };
  const updateDifficulty = (key: keyof Difficulty, value: number) => {
    const next = { ...difficulty, [key]: value };
    setDifficulty(next);
    storage.saveDifficulty(userId, next);
  };
  const enterPreview = () => {
    setTranslationOpen(false);
    setRevealed({});
    setRevealedNotes({});
    setCopied(false);
    setPhase("preview");
  };
  const copyInstructions = async () => {
    await navigator.clipboard.writeText(chatGptInstructions(user, scenario, scene));
    setCopied(true);
  };

  return <main>
    <header><div className="brand">TRIP TALK <span>β</span></div><div className="step">{phase === "home" ? "準備" : "予習・指示書"}</div></header>
    {phase === "home" && <section className="stack">
      <div><p className="eyebrow">WHO IS PRACTICING?</p><h1>今日は誰が<br />練習しますか？</h1></div>
      <div className="users">{USERS.map((item) => <button key={item.id} className={`user ${userId === item.id ? "active" : ""}`} onClick={() => chooseUser(item.id)}><span>{item.emoji}</span><b>{item.name}</b><small>{SCENARIOS[item.scenarioId].title}</small></button>)}</div>
      <article className="card scene-card"><p className="eyebrow">CHOOSE A SCENE</p><h2>{scenario.title}で、どの場面？</h2><div className="scene-picker">{scenario.scenes.map((item) => <button key={item.id} className={scene.id === item.id ? "active" : ""} onClick={() => setSceneId(item.id)}><span>{item.icon}</span>{item.title}</button>)}</div><div className="scene-summary"><b>{scene.title}</b><p>{scene.goal}</p></div><div className="route">{scene.stages.map((stage, i) => <span key={stage}>{i + 1}. {stage}</span>)}</div></article>
      <article className="card"><p className="eyebrow">CHATGPT LIVE SETTINGS</p>{([ ["speed", "会話スピード"], ["reductions", "リンキング・省略"], ["listening", "聞き取り難度"] ] as const).map(([key, label]) => <label className="slider" key={key}><span>{label}<b>{difficulty[key]}</b></span><input type="range" min="1" max="10" value={difficulty[key]} onChange={(e) => updateDifficulty(key, Number(e.target.value))} /></label>)}</article>
      <button className="primary" onClick={enterPreview}>予習へ進む <span>→</span></button>
    </section>}
    {phase === "preview" && <section className="stack textbook">
      <button className="back" onClick={() => setPhase("home")}>← 場面選択へ戻る</button>
      <div><p className="eyebrow">STUDY BEFORE ROLEPLAY</p><h1>{scene.icon} {scene.title}</h1><p>まず会話全体を読み、そのあと相手のセリフに自分で答えてみましょう。</p></div>

      <article className="card reading"><p className="eyebrow">MODEL DIALOGUE</p><h2>会話例を読む</h2><p className="reading-note">緑が相手、オレンジが自分の発言です。これは一例なので、同じ通りに話す必要はありません。</p><div className="english-passage">{scene.story.map((line, i) => <span className={line.role} key={`${line.english}-${i}`}>{line.english}{" "}</span>)}</div><button className="text-toggle" onClick={() => setTranslationOpen(!translationOpen)}>{translationOpen ? "日本語を閉じる" : "日本語で意味を確認"}</button>{translationOpen && <div className="japanese-passage">{scene.story.map((line, i) => <span className={line.role} key={`${line.japanese}-${i}`}>{line.japanese}{" "}</span>)}</div>}</article>

      <section className="response-practice"><p className="eyebrow">YOUR TURN</p><h2>相手のセリフに答える</h2><p>質問はタップで日本語を確認できます。声に出してから、会話例の回答を見てみましょう。</p><div className="practice-list">{scene.story.map((line, i) => { const prompt = scene.story[i - 1]; const promptKey = `prompt-${i}`; return line.role === "learner" ? <div className="practice-item" key={`${line.english}-${i}`}><div className="practice-row"><button className="staff-prompt" onClick={() => setRevealedNotes((old) => ({ ...old, [promptKey]: !old[promptKey] }))}><span>{prompt?.english}</span>{revealedNotes[promptKey] && <small>{prompt?.japanese}</small>}</button><button className="answer-button" onClick={() => setRevealed((old) => ({ ...old, [i]: !old[i] }))}>{revealed[i] ? "隠す" : "回答"}</button></div>{revealed[i] && <div className="sample-answer"><b>{line.english}</b><span>{line.japanese}</span></div>}</div> : null; })}</div></section>
      <section className="study-section"><p className="eyebrow">KEY EXPRESSIONS</p><h2>場面の重要表現</h2><div className="study-list">{scene.preview.map((item, i) => { const key = `expression-${i}`; return <div className="study-item" key={item.english}><button onClick={() => setRevealedNotes((old) => ({ ...old, [key]: !old[key] }))}>{item.english}<span>{revealedNotes[key] ? "−" : "＋"}</span></button>{revealedNotes[key] && <p>{item.japanese}</p>}</div>; })}</div></section>
      <section className="study-section"><p className="eyebrow">WORDS &amp; PHRASES</p><h2>単語・熟語</h2><div className="study-list">{scene.vocabulary.map((item, i) => { const key = `word-${i}`; return <div className="study-item" key={item.term}><button onClick={() => setRevealedNotes((old) => ({ ...old, [key]: !old[key] }))}>{item.term}<span>{revealedNotes[key] ? "−" : "＋"}</span></button>{revealedNotes[key] && <div className="word-meaning"><p>{item.japanese}</p><small>{item.example}</small></div>}</div>; })}</div></section>

      <article className="card prompt-card"><p className="eyebrow">CHATGPT LIVE INSTRUCTIONS</p><h2>ロールプレイ指示書</h2><p>選んだ場面と難易度を反映済みです。</p><ol className="live-steps"><li><b>指示書をコピー</b></li><li><b>ChatGPTの新しいチャットへ貼り付けて送信</b></li><li><b>同じチャットでVoiceを開始</b></li></ol><div className="prompt-preview">{chatGptInstructions(user, scenario, scene)}</div><button className="primary" onClick={copyInstructions}>{copied ? "コピーしました" : "指示書をコピー"}<span>{copied ? "✓" : "□"}</span></button><a className="secondary chatgpt-link" href="https://chatgpt.com/" target="_blank" rel="noreferrer">ChatGPTを開く</a><small>音声会話は各自のChatGPT利用枠を使います。このアプリのAPIは使用しません。</small></article>
    </section>}
    <footer>予習と指示書づくりを、このアプリで。</footer>
  </main>;
}
