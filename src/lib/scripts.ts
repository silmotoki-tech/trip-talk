import type { LearningScript, UserProfile } from "./types";

export const USERS: UserProfile[] = [
  { id: "tamoyan", name: "タモやん", emoji: "🧳" },
  { id: "gonzaemon", name: "ちゃみ", emoji: "🌿" },
];

// M0では実教材を作らない。承認済みの台本はM1以降、data/scriptsの
// 個別JSONを読み込み、この一覧へ接続する。
export const LEARNING_SCRIPTS: LearningScript[] = [];
