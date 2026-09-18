"use client";

import { useSyncExternalStore } from "react";
import { LEARNING_SCRIPTS, USERS } from "@/lib/scripts";
import { storage } from "@/lib/storage";
import type { UserId } from "@/lib/types";

export default function Home() {
  const userId = useSyncExternalStore(
    storage.subscribe,
    storage.loadSelectedUser,
    storage.getServerSelectedUser,
  );
  const user = USERS.find((item) => item.id === userId) ?? USERS[0];

  const chooseUser = (nextId: UserId) => {
    storage.saveSelectedUser(nextId);
  };

  return (
    <main>
      <header>
        <div className="brand">TRIP TALK <span>β</span></div>
        <div className="step">台本一覧</div>
      </header>

      <section className="stack">
        <div>
          <p className="eyebrow">WHO IS PRACTICING?</p>
          <h1>今日は誰が<br />練習しますか？</h1>
        </div>

        <div className="users" aria-label="利用者を選択">
          {USERS.map((item) => (
            <button
              key={item.id}
              className={`user ${userId === item.id ? "active" : ""}`}
              aria-pressed={userId === item.id}
              onClick={() => chooseUser(item.id)}
            >
              <span aria-hidden="true">{item.emoji}</span>
              <b>{item.name}</b>
              <small>{userId === item.id ? "選択中" : "切り替える"}</small>
            </button>
          ))}
        </div>

        <section aria-labelledby="script-list-title">
          <p className="eyebrow">LEARNING SCRIPTS</p>
          <h2 id="script-list-title">台本一覧</h2>
          <p className="section-note">{user.name}として練習します。確定した台本は、ここから選んで予習できます。</p>

          {LEARNING_SCRIPTS.length === 0 ? (
            <article className="card empty-state">
              <span aria-hidden="true">📖</span>
              <div>
                <h3>台本はまだありません</h3>
                <p>最初の台本が確定すると、ここに追加されます。</p>
              </div>
            </article>
          ) : (
            <div className="script-list">
              {LEARNING_SCRIPTS.map((script) => {
                const target = USERS.find((item) => item.id === script.targetUserId);
                return (
                  <article className="card script-card" key={script.id}>
                    <div className="script-heading">
                      <b>{script.id}</b>
                      <span>{target?.name}向け</span>
                    </div>
                    <p className="script-scene">{script.scene} ＞ {script.situation}</p>
                    <h3>{script.summary}</h3>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <article className="card chatgpt-card">
          <div>
            <p className="eyebrow">PRACTICE LIVE</p>
            <h2>ChatGPTで実戦練習</h2>
            <p>台本を選べるようになったら、予習後にChatGPT Liveで練習します。</p>
          </div>
          <a className="secondary" href="https://chatgpt.com/" target="_blank" rel="noreferrer">
            ChatGPTを開く
          </a>
        </article>
      </section>

      <footer>台本で予習して、会話で試す。</footer>
    </main>
  );
}
