import type { LearningScript } from "./types";
export function makePrompt(
  script: LearningScript,
  mode: "roleplay" | "reading",
) {
  const rules =
    mode === "reading"
      ? `これは教材の読み上げです。下の台本の英語だけを、partner・learnerとも記載順に最初から最後まで1回読んでください。
内容を改変・要約・省略・追加しないでください。役割ラベルは読まず、ユーザーの返答を待たず、会話を広げないでください。
1回読み切ったら停止してください。同じLive会話内で私が「もう一回」と言ったら、同じ台本を同じルールで最初から最後まで1回再読し、停止してください。`
      : `旅行英会話のロールプレイをしてください。あなたはpartner、私はlearnerです。
台本を参考にpartnerの発話を1つずつ話し、私の返答を待ってください。私の回答例を先に読み上げないでください。
私が助けを求めたときだけ短いヒントをください。終わったら良かった点と改善点を短く伝えてください。進級は私が決めます。`;
  return `${rules}\n\n場面: ${script.scene} / ${script.situation}\n目標: ${script.goal}\n\n台本 ${script.id}\n${script.dialogue.map((t) => `${t.role}: ${t.english}`).join("\n")}`;
}
