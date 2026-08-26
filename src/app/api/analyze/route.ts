import { NextResponse } from "next/server";

const fallback = {
  strengths: ["最後まで会話を続けようとしました", "必要な場面で聞き返せました"],
  improvements: ["依頼の前に “Could you” を付けるとより自然です"],
  focus: ["Could you say that again?"],
  nextExpressions: [{ english: "Could you say that again?", japanese: "もう一度言っていただけますか" }],
};

export async function POST(request: Request) {
  const input = await request.json();
  if (!process.env.OPENAI_API_KEY) return NextResponse.json({ ...fallback, mock: true });
  const headers: Record<string, string> = { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" };
  if (process.env.OPENAI_ORGANIZATION) headers["OpenAI-Organization"] = process.env.OPENAI_ORGANIZATION;
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers,
    body: JSON.stringify({
      model: process.env.OPENAI_ANALYSIS_MODEL || "gpt-5-mini",
      input: `Analyze this Japanese learner's English roleplay. Scenario: ${input.scenario}. Transcript: ${JSON.stringify(input.transcript)}. Return constructive feedback. Focus expressions must be things the learner needed but could not use in this session. Do not judge mastery or progression.`,
      text: { format: { type: "json_schema", name: "session_review", strict: true, schema: { type: "object", additionalProperties: false, required: ["strengths", "improvements", "focus", "nextExpressions"], properties: { strengths: { type: "array", items: { type: "string" } }, improvements: { type: "array", items: { type: "string" } }, focus: { type: "array", items: { type: "string" } }, nextExpressions: { type: "array", items: { type: "object", additionalProperties: false, required: ["english", "japanese"], properties: { english: { type: "string" }, japanese: { type: "string" } } } } } } } },
    }),
  });
  const data = await response.json();
  if (!response.ok) return NextResponse.json({ error: data.error?.message || "分析に失敗しました" }, { status: response.status });
  try { return NextResponse.json(JSON.parse(data.output_text)); } catch { return NextResponse.json(fallback); }
}
