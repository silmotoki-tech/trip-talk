"use client";

import { useState } from "react";
import { chatGptInstructions, projectInstructions, SCENARIOS, USERS } from "@/lib/scenarios";
import { storage } from "@/lib/storage";
import { Difficulty, PracticeMode, UserId } from "@/lib/types";

export default function Home() {
  const [userId, setUserId] = useState<UserId>("tamoyan");
  const baseUser = USERS.find((item) => item.id === userId)!;
  const [difficulty, setDifficulty] = useState<Difficulty>(baseUser.difficulty);
  const [practiceMode, setPracticeMode] = useState<PracticeMode>("scripted");
  const user = { ...baseUser, difficulty };
  const scenario = SCENARIOS[user.scenarioId];
  const [sceneId, setSceneId] = useState(SCENARIOS[baseUser.scenarioId].scenes[0].id);
  const scene = scenario.scenes.find((item) => item.id === sceneId) ?? scenario.scenes[0];
  const [phase, setPhase] = useState<"home" | "preview">("home");
  const [translationOpen, setTranslationOpen] = useState(false);
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [revealedNotes, setRevealedNotes] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);
  const [projectCopied, setProjectCopied] = useState(false);

  const chooseUser = (nextId: UserId) => {
    const nextUser = USERS.find((item) => item.id === nextId)!;
    setUserId(nextId);
    setDifficulty(storage.loadDifficulty(nextId, nextUser.difficulty));
    setPracticeMode(storage.loadPracticeMode(nextId));
    setSceneId(SCENARIOS[nextUser.scenarioId].scenes[0].id);
    setProjectCopied(false);
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
  const choosePracticeMode = (mode: PracticeMode) => {
    setPracticeMode(mode);
    storage.savePracticeMode(userId, mode);
  };
  const copyInstructions = async () => {
    await navigator.clipboard.writeText(chatGptInstructions(user, scenario, scene, practiceMode));
    setCopied(true);
  };
  const copyProjectInstructions = async () => {
    await navigator.clipboard.writeText(projectInstructions(user));
    setProjectCopied(true);
  };

  return <main>
    <header><div className="brand">TRIP TALK <span>β</span></div><div className="step">{phase === "home" ? "準備" : "予習・指示書"}</div></header>
    {phase === "home" && <section className="stack">
      <div><p className="eyebrow">WHO IS PRACTICING?</p><h1>今日は誰が<br />練習しますか？</h1></div>
      <div className="users">{USERS.map((item) => <button key={item.id} className={`user ${userId === item.id ? "active" : ""}`} onClick={() => chooseUser(item.id)}><span>{item.emoji}</span><b>{item.name}</b><small>{SCENARIOS[item.scenarioId].title}</small></button>)}</div>
      <article className="card scene-card"><p className="eyebrow">CHOOSE A SCENE</p><h2>{scenario.title}で、どの場面？</h2><div className="scene-picker">{scenario.scenes.map((item) => <button key={item.id} className={scene.id === item.id ? "active" : ""} onClick={() => setSceneId(item.id)}><span>{item.icon}</span>{item.title}</button>)}</div><div className="scene-summary"><b>{scene.title}</b><p>{scene.goal}</p></div><div className="route">{scene.stages.map((stage, i) => <span key={stage}>{i + 1}. {stage}</span>)}</div></article>
      <article className="card"><p className="eyebrow">CHATGPT LIVE SETTINGS</p><div className="mode-setting"><span>練習モード</span><div className="mode-picker"><button className={practiceMode === "scripted" ? "active" : ""} aria-pressed={practiceMode === "scripted"} onClick={() => choosePracticeMode("scripted")}><b>例文どおり</b><small>同じ流れを反復</small></button><button className={practiceMode === "variation" ? "active" : ""} aria-pressed={practiceMode === "variation"} onClick={() => choosePracticeMode("variation")}><b>変化あり</b><small>聞き方を少し変更</small></button></div></div>{([ ["speed", "会話スピード"], ["reductions", "リンキング・省略"], ["listening", "聞き取り難度"] ] as const).map(([key, label]) => <label className="slider" key={key}><span>{label}<b>{difficulty[key]}</b></span><input type="range" min="1" max="10" value={difficulty[key]} onChange={(e) => updateDifficulty(key, Number(e.target.value))} /></label>)}</article>
      <details className="card project-setup"><summary>初回のみ：専用プロジェクトの指示書</summary><p>{user.conversationName}用ChatGPTプロジェクトの設定に、一度だけ貼り付けます。</p><button className="secondary" onClick={copyProjectInstructions}>{projectCopied ? "コピーしました ✓" : "プロジェクト指示書をコピー"}</button></details>
      <button className="primary" onClick={enterPreview}>予習へ進む <span>→</span></button>
    </section>}
    {phase === "preview" && <section className="stack textbook">
      <button className="back" onClick={() => setPhase("home")}>← 場面選択へ戻る</button>
      <div><p className="eyebrow">STUDY BEFORE ROLEPLAY</p><h1>{scene.icon} {scene.title}</h1><p>まず会話全体を読み、そのあと相手のセリフに自分で答えてみましょう。</p></div>

      <article className="card reading"><p className="eyebrow">MODEL DIALOGUE</p><h2>会話例を読む</h2><p className="reading-note">緑が相手、オレンジが自分の発言です。これは一例なので、同じ通りに話す必要はありません。</p><div className="english-passage">{scene.story.map((line, i) => <span className={line.role} key={`${line.english}-${i}`}>{line.english}{" "}</span>)}</div><button className="text-toggle" onClick={() => setTranslationOpen(!translationOpen)}>{translationOpen ? "日本語を閉じる" : "日本語で意味を確認"}</button>{translationOpen && <div className="japanese-passage">{scene.story.map((line, i) => <span className={line.role} key={`${line.japanese}-${i}`}>{line.japanese}{" "}</span>)}</div>}</article>

      <section className="response-practice"><p className="eyebrow">YOUR TURN</p><h2>相手のセリフに答える</h2><p>質問はタップで日本語を確認できます。声に出してから、会話例の回答を見てみましょう。</p><div className="practice-list">{scene.story.map((line, i) => { const prompt = scene.story[i - 1]; const promptKey = `prompt-${i}`; return line.role === "learner" ? <div className="practice-item" key={`${line.english}-${i}`}><div className="practice-row"><button className="staff-prompt" onClick={() => setRevealedNotes((old) => ({ ...old, [promptKey]: !old[promptKey] }))}><span>{prompt?.english}</span>{revealedNotes[promptKey] && <small>{prompt?.japanese}</small>}</button><button className="answer-button" onClick={() => setRevealed((old) => ({ ...old, [i]: !old[i] }))}>{revealed[i] ? "隠す" : "回答"}</button></div>{revealed[i] && <div className="sample-answer"><b>{line.english}</b><span>{line.japanese}</span></div>}</div> : null; })}</div></section>
      <section className="study-section"><p className="eyebrow">KEY EXPRESSIONS</p><h2>場面の重要表現</h2><div className="study-list">{scene.preview.map((item, i) => { const key = `expression-${i}`; return <div className="study-item" key={item.english}><button onClick={() => setRevealedNotes((old) => ({ ...old, [key]: !old[key] }))}>{item.english}<span>{revealedNotes[key] ? "−" : "＋"}</span></button>{revealedNotes[key] && <p>{item.japanese}</p>}</div>; })}</div></section>
      <section className="study-section"><p className="eyebrow">WORDS &amp; PHRASES</p><h2>単語・熟語</h2><div className="study-list">{scene.vocabulary.map((item, i) => { const key = `word-${i}`; return <div className="study-item" key={item.term}><button onClick={() => setRevealedNotes((old) => ({ ...old, [key]: !old[key] }))}>{item.term}<span>{revealedNotes[key] ? "−" : "＋"}</span></button>{revealedNotes[key] && <div className="word-meaning"><p>{item.japanese}</p><small>{item.example}</small></div>}</div>; })}</div></section>

      <article className="card prompt-card"><p className="eyebrow">CHATGPT LIVE INSTRUCTIONS</p><h2>ロールプレイ指示書</h2><p>場面・難易度・「{practiceMode === "scripted" ? "例文どおり" : "変化あり"}」を反映済みです。</p><ol className="live-steps"><li><b>指示書をコピー</b></li><li><b>場面専用チャットへ貼り付けて送信</b></li><li><b>Voiceを開始して「Start」と言う</b></li></ol><div className="prompt-preview">{chatGptInstructions(user, scenario, scene, practiceMode)}</div><button className="primary" onClick={copyInstructions}>{copied ? "コピーしました" : "指示書をコピー"}<span>{copied ? "✓" : "□"}</span></button><a className="secondary chatgpt-link" href="https://chatgpt.com/" target="_blank" rel="noreferrer">ChatGPTを開く</a><small>同じ場面は同じチャットで繰り返します。GPTは一言ずつ話し、あなたの返答を待ちます。「練習終了」で短い総評と次回の課題が出ます。</small></article>
    </section>}
    <footer>予習と指示書づくりを、このアプリで。</footer>
  </main>;
}
