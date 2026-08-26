"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export default function SetupPage() {
  const [key, setKey] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const save = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    const response = await fetch("/api/setup-key", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ apiKey: key }),
    });
    const data = await response.json();
    setKey("");
    setMessage(data.message || data.error || "保存できませんでした");
    setSaving(false);
  };

  return <main className="setup-page">
    <header><div className="brand">TRIP TALK <span>β</span></div><div className="step">API設定</div></header>
    <section className="stack">
      <div><p className="eyebrow">OPENAI API</p><h1>APIキーを設定</h1><p>OpenAIでコピーしたキーを、下の欄に貼り付けてください。</p></div>
      <form className="card setup-form" onSubmit={save}>
        <label htmlFor="api-key">APIキー</label>
        <input id="api-key" type="password" value={key} onChange={(event) => setKey(event.target.value)} placeholder="sk-..." autoComplete="off" autoCapitalize="none" spellCheck={false} />
        <button className="primary" disabled={saving || !key.trim()}>{saving ? "保存中…" : "このキーを保存する"}<span>→</span></button>
      </form>
      {message && <p className="setup-message">{message}</p>}
      <p className="setup-note">キーはこのPCのサーバー設定に保存され、ブラウザの保存領域には残りません。</p>
      <Link className="secondary setup-link" href="/">アプリへ戻る</Link>
    </section>
  </main>;
}
