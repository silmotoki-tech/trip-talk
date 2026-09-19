import type { LearningScript } from "./types";

const functions = new Set([
  "question",
  "answer",
  "request",
  "reaction",
  "clarification",
  "confirmation",
  "repair",
  "other",
]);
const record = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === "object" && !Array.isArray(v);
const text = (v: unknown): v is string =>
  typeof v === "string" && v.trim().length > 0;
export function parseScript(value: unknown): LearningScript {
  if (
    !record(value) ||
    !text(value.id) ||
    !(
      value.targetUserId === "tamoyan"
        ? /^MOTOKI(0|[1-9][0-9]*)$/
        : value.targetUserId === "gonzaemon"
          ? /^CHAMI(0|[1-9][0-9]*)$/
          : /$^/
    ).test(value.id) ||
    ![value.scene, value.situation, value.summary, value.goal].every(text) ||
    !Array.isArray(value.dialogue) ||
    value.dialogue.length === 0 ||
    !value.dialogue.every(
      (t) =>
        record(t) &&
        ["partner", "learner"].includes(String(t.role)) &&
        text(t.english) &&
        text(t.japanese),
    ) ||
    !Array.isArray(value.expressions) ||
    !value.expressions.every(
      (e) =>
        record(e) &&
        text(e.english) &&
        text(e.japanese) &&
        Array.isArray(e.functions) &&
        e.functions.every((f) => functions.has(String(f))) &&
        ["new", "reused"].includes(String(e.learningStatus)),
    )
  ) {
    throw new Error("LearningScript schemaに一致しない台本です");
  }
  return value as unknown as LearningScript;
}

export function practiceQuestions(script: LearningScript) {
  return script.dialogue.flatMap((turn, index) =>
    turn.role === "partner"
      ? [
          {
            question: turn,
            answer:
              script.dialogue[index + 1]?.role === "learner"
                ? script.dialogue[index + 1]
                : null,
          },
        ]
      : [],
  );
}
