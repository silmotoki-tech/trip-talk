import { Difficulty, SessionRecord, UserId } from "./types";

const key = (userId: UserId, suffix: string) => `english-mvp:${userId}:${suffix}`;

export const storage = {
  loadDifficulty(userId: UserId, fallback: Difficulty): Difficulty {
    if (typeof window === "undefined") return fallback;
    const value = localStorage.getItem(key(userId, "difficulty"));
    return value ? JSON.parse(value) : fallback;
  },
  saveDifficulty(userId: UserId, value: Difficulty) {
    localStorage.setItem(key(userId, "difficulty"), JSON.stringify(value));
  },
  saveSession(session: SessionRecord) {
    localStorage.setItem(key(session.userId, "latest-session"), JSON.stringify(session));
  },
  loadLatest(userId: UserId): SessionRecord | null {
    if (typeof window === "undefined") return null;
    const value = localStorage.getItem(key(userId, "latest-session"));
    return value ? JSON.parse(value) : null;
  },
};
