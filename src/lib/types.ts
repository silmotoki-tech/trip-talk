export type UserId = "tamoyan" | "gonzaemon";
export type PracticeMode = "scripted" | "variation";
export type PathChoice = "repeat" | "expand" | "change";
export type Phase = "home" | "preview" | "live" | "review";

export interface Difficulty {
  speed: number;
  reductions: number;
  listening: number;
}

export interface UserProfile {
  id: UserId;
  name: string;
  conversationName: string;
  emoji: string;
  scenarioId: string;
  difficulty: Difficulty;
}

export interface PreviewItem {
  english: string;
  japanese: string;
}

export interface VocabularyItem {
  term: string;
  japanese: string;
  example: string;
}

export interface StoryTurn {
  role: "staff" | "learner";
  english: string;
  japanese: string;
}

export interface Scene {
  id: string;
  title: string;
  icon: string;
  start: string;
  goal: string;
  stages: string[];
  story: StoryTurn[];
  preview: PreviewItem[];
  reactions: PreviewItem[];
  vocabulary: VocabularyItem[];
}

export interface Scenario {
  id: string;
  title: string;
  place: string;
  scenes: Scene[];
}

export interface TranscriptLine {
  role: "user" | "assistant";
  text: string;
  at: number;
}

export interface Review {
  strengths: string[];
  improvements: string[];
  focus: string[];
  nextExpressions: PreviewItem[];
}

export interface SessionRecord {
  id: string;
  userId: UserId;
  scenarioId: string;
  sceneId: string;
  startedAt: number;
  endedAt: number;
  difficulty: Difficulty;
  transcript: TranscriptLine[];
  review: Review;
  nextChoice?: PathChoice;
}
