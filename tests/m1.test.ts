import assert from "node:assert/strict";
import test from "node:test";
import sample from "./fixtures/sample.json";
import { parseScript, practiceQuestions } from "../src/lib/script-schema";
import { makePrompt } from "../src/lib/prompts";
import { parseProgress } from "../src/lib/progress";
import { Timestamp } from "firebase/firestore";

test("質問はpartnerのみ、回答は直後のlearnerのみ", () => {
  const q = practiceQuestions(parseScript(sample));
  assert.equal(q.length, 3);
  assert.equal(q[0].answer?.english, "Answer one.");
  assert.equal(q[1].answer, null);
  assert.equal(q[2].answer?.english, "Answer three.");
});
test("不正な教材とID・対象者の不一致は拒否", () => {
  for (const patch of [
    { id: "TEST" },
    { targetUserId: "gonzaemon" },
    { dialogue: [] },
    { expressions: [{ functions: ["invalid"] }] },
  ])
    assert.throws(() => parseScript({ ...sample, ...patch }));
  assert.equal(
    parseScript({ ...sample, id: "CHAMI0", targetUserId: "gonzaemon" }).id,
    "CHAMI0",
  );
});
test("読み上げに全発話を順番どおり含み、同じLive内の再読を指示", () => {
  const script = parseScript(sample);
  const prompt = makePrompt(script, "reading");
  assert.ok(
    prompt.endsWith(
      script.dialogue.map((t) => `${t.role}: ${t.english}`).join("\n"),
    ),
  );
  for (const word of [
    "もう一回",
    "改変・要約・省略・追加しない",
    "返答を待たず",
    "停止",
  ])
    assert.ok(prompt.includes(word));
  assert.ok(makePrompt(script, "roleplay").includes("私の返答を待って"));
});
test("進捗データの型・範囲を検証", () => {
  const valid = {
    readAloudCount: 1,
    lastReadAt: Timestamp.now(),
    selfRating: 4,
    updatedAt: Timestamp.now(),
  };
  assert.equal(parseProgress(valid).selfRating, 4);
  for (const patch of [
    { readAloudCount: -1 },
    { readAloudCount: 1.5 },
    { selfRating: 5 },
    { lastReadAt: "today" },
    { updatedAt: null },
  ])
    assert.throws(() => parseProgress({ ...valid, ...patch }));
});
