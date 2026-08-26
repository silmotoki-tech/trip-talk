import { NextResponse } from "next/server";
import { writeFile } from "node:fs/promises";
import path from "node:path";

export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "この設定ページはローカル開発時のみ利用できます。" }, { status: 403 });
  }

  const { apiKey } = await request.json();
  const key = typeof apiKey === "string" ? apiKey.trim() : "";
  if (!key.startsWith("sk-") || key.length < 20) {
    return NextResponse.json({ error: "APIキーを確認してください。通常は sk- から始まります。" }, { status: 400 });
  }

  const contents = [
    "# Server only. Do not share or commit this file.",
    `OPENAI_API_KEY=${key}`,
    "# OPENAI_ORGANIZATION can be set separately when the account belongs to multiple organizations.",
    "OPENAI_REALTIME_MODEL=gpt-realtime",
    "OPENAI_ANALYSIS_MODEL=gpt-5-mini",
    "",
  ].join("\n");
  await writeFile(path.join(process.cwd(), ".env.local"), contents, "utf8");
  return NextResponse.json({ message: "保存できました。Codexに『できた』と送ってください。" });
}
