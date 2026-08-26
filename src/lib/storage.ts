import { Difficulty, PracticeMode, SessionRecord, UserId } from "./types";

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
  loadPracticeMode(userId: UserId): PracticeMode {
    if (typeof window === "undefined") return "scripted";
    return localStorage.getItem(key(userId, "practice-mode")) === "variation" ? "variation" : "scripted";
  },
  savePracticeMode(userId: UserId, value: PracticeMode) {
    localStorage.setItem(key(userId, "practice-mode"), value);
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
