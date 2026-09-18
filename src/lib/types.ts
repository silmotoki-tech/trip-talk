export type UserId = "tamoyan" | "gonzaemon";

export type DialogueRole = "partner" | "learner";

export type ExpressionFunction =
  | "question"
  | "answer"
  | "request"
  | "reaction"
  | "clarification"
  | "confirmation"
  | "repair"
  | "other";

export type ExpressionLearningStatus = "new" | "reused";

export interface DialogueTurn {
  role: DialogueRole;
  english: string;
  japanese: string;
}

export interface ScriptExpression {
  english: string;
  japanese: string;
  functions: ExpressionFunction[];
  learningStatus: ExpressionLearningStatus;
}

export interface LearningScript {
  id: string;
  targetUserId: UserId;
  scene: string;
  situation: string;
  summary: string;
  goal: string;
  dialogue: DialogueTurn[];
  expressions: ScriptExpression[];
}

export interface UserProfile {
  id: UserId;
  name: string;
  emoji: string;
}
