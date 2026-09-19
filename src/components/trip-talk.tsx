"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { USERS } from "@/lib/scripts";
import { storage } from "@/lib/storage";
import { firebaseConfigured, progressDatabase } from "@/lib/firebase";
import { saveProgress, watchProgress } from "@/lib/progress";
import type { ScriptProgress, SelfRating } from "@/lib/progress";
import { practiceQuestions } from "@/lib/script-schema";
import { makePrompt } from "@/lib/prompts";
import type { LearningScript, UserId } from "@/lib/types";

type Entry =
  { state: "ready"; data: ScriptProgress | null } | { state: "error" };
const date = (p: ScriptProgress | null | undefined) =>
  p?.lastReadAt
    ? p.lastReadAt.toDate().toLocaleString("ja-JP")
    : "まだありません";
function ProgressText({ entry }: { entry?: Entry }) {
  if (!firebaseConfigured) return <p>進捗：保存設定待ち</p>;
  if (!entry) return <p>進捗を読み込み中…</p>;
  if (entry.state === "error") return <p>進捗を取得できませんでした</p>;
  return (
    <div className="progress-text">
      <p>
        音読 {entry.data?.readAloudCount ?? 0}回 · 評価{" "}
        {entry.data?.selfRating ? `${entry.data.selfRating}/4` : "未評価"}
      </p>
      <p>最終音読：{date(entry.data)}</p>
    </div>
  );
}
export default function TripTalk({ scripts }: { scripts: LearningScript[] }) {
  const userId = useSyncExternalStore(
    storage.subscribe,
    storage.loadSelectedUser,
    storage.getServerSelectedUser,
  );
  return <Workspace key={userId} userId={userId} scripts={scripts} />;
}
function Workspace({
  userId,
  scripts,
}: {
  userId: UserId;
  scripts: LearningScript[];
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [entries, setEntries] = useState<Record<string, Entry>>({});
  const [connectionError, setConnectionError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const script = scripts.find((s) => s.id === selected);
  const user = USERS.find((u) => u.id === userId)!;
  useEffect(() => {
    if (!firebaseConfigured) return;
    let active = true;
    const unsubscribes: (() => void)[] = [];
    const fail = () => {
      if (active) setConnectionError(true);
    };
    const timeout = setTimeout(fail, 15000);
    progressDatabase()
      .then((db) => {
        if (!active) return;
        if (!scripts.length) clearTimeout(timeout);
        for (const s of scripts)
          unsubscribes.push(
            watchProgress(
              db,
              userId,
              s.id,
              (data) => {
                if (!active) return;
                setEntries((old) => ({
                  ...old,
                  [s.id]: { state: "ready", data },
                }));
              },
              () => {
                if (active)
                  setEntries((old) => ({ ...old, [s.id]: { state: "error" } }));
                fail();
              },
            ),
          );
      })
      .catch(fail);
    return () => {
      active = false;
      clearTimeout(timeout);
      unsubscribes.forEach((unsubscribe) => unsubscribe());
    };
  }, [userId, scripts, attempt]);
  const allReady =
    scripts.length > 0 &&
    scripts.every((s) => entries[s.id]?.state === "ready");
  return (
    <main>
      <header>
        <div className="brand">
          TRIP TALK <span>β</span>
        </div>
        <div className="step">{script ? "台本詳細" : "台本一覧"}</div>
      </header>
      <section className="stack">
        <div>
          <p className="eyebrow">WHO IS PRACTICING?</p>
          <h1>
            今日は誰が
            <br />
            練習しますか？
          </h1>
        </div>
        <div className="users" aria-label="利用者を選択">
          {USERS.map((item) => (
            <button
              key={item.id}
              className={`user ${userId === item.id ? "active" : ""}`}
              aria-pressed={userId === item.id}
              onClick={() => storage.saveSelectedUser(item.id)}
            >
              <span aria-hidden="true">{item.emoji}</span>
              <b>{item.name}</b>
              <small>{userId === item.id ? "選択中" : "切り替える"}</small>
            </button>
          ))}
        </div>
        {!firebaseConfigured && (
          <p className="notice" role="status">
            進捗保存は設定待ちです。台本の閲覧・練習・指示書は使えます。
          </p>
        )}
        {connectionError && !allReady && (
          <div className="notice" role="alert">
            <p>進捗に接続できません。通信と保存設定を確認してください。</p>
            <button
              className="secondary"
              onClick={() => {
                setConnectionError(false);
                setEntries({});
                setAttempt((n) => n + 1);
              }}
            >
              再接続
            </button>
          </div>
        )}
        {script ? (
          <>
            <button className="secondary" onClick={() => setSelected(null)}>
              台本一覧に戻る
            </button>
            <ScriptDetail
              key={script.id}
              script={script}
              userId={userId}
              entry={entries[script.id]}
            />
          </>
        ) : (
          <section aria-labelledby="script-list-title">
            <p className="eyebrow">LEARNING SCRIPTS</p>
            <h2 id="script-list-title">台本一覧</h2>
            <p className="section-note">
              {user.name}
              として練習します。どちらの利用者もすべての台本を使えます。
            </p>
            {!scripts.length ? (
              <article className="card empty-state">
                <span aria-hidden="true">📖</span>
                <div>
                  <h3>台本はまだありません</h3>
                  <p>最初の台本が確定すると、ここに追加されます。</p>
                </div>
              </article>
            ) : (
              <div className="script-list">
                {scripts.map((s) => (
                  <article className="card script-card" key={s.id}>
                    <div className="script-heading">
                      <b>{s.id}</b>
                      <span>
                        {USERS.find((u) => u.id === s.targetUserId)?.name}向け
                      </span>
                    </div>
                    <p className="script-scene">
                      {s.scene} ＞ {s.situation}
                    </p>
                    <h3>{s.summary}</h3>
                    <ProgressText entry={entries[s.id]} />
                    <button
                      className="secondary"
                      onClick={() => setSelected(s.id)}
                    >
                      {s.id}を開く
                    </button>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}
        <article className="card chatgpt-card">
          <div>
            <p className="eyebrow">PRACTICE LIVE</p>
            <h2>ChatGPTで実戦練習</h2>
            <p>
              指示書をコピーしてChatGPTに貼り付け、音声会話を始めてください。
            </p>
          </div>
          <a
            className="secondary"
            href="https://chatgpt.com/"
            target="_blank"
            rel="noreferrer"
          >
            ChatGPTを開く
          </a>
        </article>
      </section>
      <footer>台本で予習して、会話で試す。</footer>
    </main>
  );
}
export function ScriptDetail({
  script,
  userId,
  entry,
}: {
  script: LearningScript;
  userId: UserId;
  entry?: Entry;
}) {
  const [mode, setMode] = useState<"full" | "questions">("full");
  const [japanese, setJapanese] = useState(false);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [copyStatus, setCopyStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const lock = useRef(false);
  const questions = practiceQuestions(script);
  const current = questions[index];
  const canSave = firebaseConfigured && entry?.state === "ready" && !saving;
  async function save(
    change: { kind: "read" } | { kind: "rating"; rating: SelfRating },
  ) {
    if (!canSave || lock.current) return;
    lock.current = true;
    setSaving(true);
    setMessage("保存中…");
    try {
      await saveProgress(await progressDatabase(), userId, script.id, change);
      setMessage("保存しました");
    } catch {
      setMessage(
        "保存できませんでした。通信・設定を確認して、もう一度操作してください。",
      );
    } finally {
      lock.current = false;
      setSaving(false);
    }
  }
  return (
    <section className="detail stack">
      <div>
        <p className="eyebrow">{script.id}</p>
        <h2>{script.summary}</h2>
        <p>
          {script.scene} ＞ {script.situation}
        </p>
        <p>目標：{script.goal}</p>
      </div>
      <div className="card">
        <h3>自分の進捗</h3>
        <ProgressText entry={entry} />
        <button
          className="primary"
          disabled={!canSave}
          onClick={() => save({ kind: "read" })}
        >
          音読 +1
        </button>
        <label className="rating">
          自己評価
          <select
            aria-label="自己評価"
            disabled={!canSave}
            value={
              entry?.state === "ready" ? (entry.data?.selfRating ?? "") : ""
            }
            onChange={(event) =>
              save({
                kind: "rating",
                rating: event.target.value
                  ? (Number(event.target.value) as SelfRating)
                  : null,
              })
            }
          >
            <option value="">未評価</option>
            {[1, 2, 3, 4].map((n) => (
              <option key={n} value={n}>
                {n} / 4
              </option>
            ))}
          </select>
        </label>
        <p role="status">{message}</p>
      </div>
      <div className="mode-buttons">
        <button
          className="secondary"
          aria-pressed={mode === "full"}
          onClick={() => setMode("full")}
        >
          全文を見る
        </button>
        <button
          className="secondary"
          aria-pressed={mode === "questions"}
          onClick={() => {
            setMode("questions");
            setIndex(0);
            setAnswer(false);
          }}
        >
          質問だけで練習
        </button>
      </div>
      <label className="toggle">
        <input
          type="checkbox"
          checked={japanese}
          onChange={(event) => setJapanese(event.target.checked)}
        />
        日本語を表示
      </label>
      {mode === "full" ? (
        <div className="script-list">
          {script.dialogue.map((turn, i) => (
            <article className={`card turn ${turn.role}`} key={i}>
              <small>{turn.role === "partner" ? "相手" : "自分"}</small>
              <p lang="en">{turn.english}</p>
              {japanese && <p className="translation">{turn.japanese}</p>}
            </article>
          ))}
        </div>
      ) : (
        <div className="card" aria-live="polite">
          {current ? (
            <>
              <p className="eyebrow">
                {index + 1} / {questions.length} · 相手
              </p>
              <p lang="en">{current.question.english}</p>
              {japanese && (
                <p className="translation">{current.question.japanese}</p>
              )}
              <p className="section-note">自分の答えを声に出してみましょう。</p>
              {answer && (
                <div className="answer">
                  <b>回答例</b>
                  {current.answer ? (
                    <>
                      <p lang="en">{current.answer.english}</p>
                      {japanese && <p>{current.answer.japanese}</p>}
                    </>
                  ) : (
                    <p>直後の回答例はありません。</p>
                  )}
                </div>
              )}
              <button
                className="secondary"
                disabled={answer}
                onClick={() => setAnswer(true)}
              >
                答えを見る
              </button>
              <button
                className="primary"
                onClick={() => {
                  setIndex((i) => i + 1);
                  setAnswer(false);
                }}
              >
                次へ
              </button>
            </>
          ) : (
            <>
              <h3>
                {questions.length
                  ? "最後まで練習しました"
                  : "相手の発話はありません"}
              </h3>
              <p>練習回数・正誤は保存しません。</p>
              {questions.length > 0 && (
                <button
                  className="secondary"
                  onClick={() => {
                    setIndex(0);
                    setAnswer(false);
                  }}
                >
                  もう一度練習する
                </button>
              )}
            </>
          )}
        </div>
      )}
      {mode === "full" && (
        <section>
          <h3>重要表現</h3>
          {script.expressions.length ? (
            script.expressions.map((e, i) => (
              <article className="card expression" key={i}>
                <p lang="en">{e.english}</p>
                {japanese && <p>{e.japanese}</p>}
                <small>
                  {e.learningStatus === "new" ? "新規" : "既習"} ·{" "}
                  {e.functions
                    .map(
                      (f) =>
                        ({
                          question: "質問",
                          answer: "回答",
                          request: "依頼",
                          reaction: "反応",
                          clarification: "聞き返し",
                          confirmation: "確認",
                          repair: "言い直し",
                          other: "その他",
                        })[f],
                    )
                    .join("・")}
                </small>
              </article>
            ))
          ) : (
            <p>重要表現の登録はありません。</p>
          )}
        </section>
      )}
      <section className="card">
        <h3>ChatGPT Live用の指示書</h3>
        <button
          className="secondary"
          onClick={() => {
            setPrompt(makePrompt(script, "roleplay"));
            setCopyStatus("");
          }}
        >
          ロールプレイ指示書
        </button>
        <button
          className="secondary"
          onClick={() => {
            setPrompt(makePrompt(script, "reading"));
            setCopyStatus("");
          }}
        >
          読み上げ指示書
        </button>
        {prompt && (
          <>
            <label className="prompt-label">
              指示書
              <textarea
                readOnly
                value={prompt}
                rows={12}
                onFocus={(event) => event.target.select()}
              />
            </label>
            <button
              className="primary"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(prompt);
                  setCopyStatus("コピーしました");
                } catch {
                  setCopyStatus(
                    "コピーできませんでした。上の指示書を長押しして手動でコピーしてください。",
                  );
                }
              }}
            >
              指示書をコピー
            </button>
            <p role="status">{copyStatus}</p>
          </>
        )}
      </section>
    </section>
  );
}
