import {
  doc,
  increment,
  onSnapshot,
  runTransaction,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import type { Firestore } from "firebase/firestore";
import type { UserId } from "./types";
export type SelfRating = 1 | 2 | 3 | 4 | null;
export interface ScriptProgress {
  readAloudCount: number;
  lastReadAt: Timestamp | null;
  selfRating: SelfRating;
  updatedAt: Timestamp;
}
export function parseProgress(data: Record<string, unknown>): ScriptProgress {
  if (
    !Number.isSafeInteger(data.readAloudCount) ||
    Number(data.readAloudCount) < 0 ||
    Number(data.readAloudCount) > 2147483647 ||
    !(data.lastReadAt === null || data.lastReadAt instanceof Timestamp) ||
    ![null, 1, 2, 3, 4].includes(data.selfRating as SelfRating) ||
    !(data.updatedAt instanceof Timestamp)
  ) {
    throw new Error("進捗データの形式を確認してください");
  }
  return data as unknown as ScriptProgress;
}
function reference(db: Firestore, userId: UserId, scriptId: string) {
  if (
    !["tamoyan", "gonzaemon"].includes(userId) ||
    !/^(MOTOKI|CHAMI)(0|[1-9][0-9]*)$/.test(scriptId)
  )
    throw new Error("進捗パスが不正です");
  return doc(db, "progress", userId, "scripts", scriptId);
}
export function watchProgress(
  db: Firestore,
  userId: UserId,
  scriptId: string,
  next: (p: ScriptProgress | null) => void,
  fail: () => void,
) {
  return onSnapshot(
    reference(db, userId, scriptId),
    { includeMetadataChanges: true },
    (snapshot) => {
      // キャッシュや未確定のローカル書込みを保存成功として表示しない。
      if (snapshot.metadata.hasPendingWrites || snapshot.metadata.fromCache)
        return;
      try {
        next(snapshot.exists() ? parseProgress(snapshot.data()) : null);
      } catch {
        fail();
      }
    },
    fail,
  );
}
export async function saveProgress(
  db: Firestore,
  userId: UserId,
  scriptId: string,
  change: { kind: "read" } | { kind: "rating"; rating: SelfRating },
) {
  const ref = reference(db, userId, scriptId);
  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(ref);
    if (snapshot.exists()) parseProgress(snapshot.data());
    const defaults = snapshot.exists()
      ? {}
      : { readAloudCount: 0, lastReadAt: null, selfRating: null };
    transaction.set(
      ref,
      {
        ...defaults,
        ...(change.kind === "read"
          ? { readAloudCount: increment(1), lastReadAt: serverTimestamp() }
          : { selfRating: change.rating }),
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  });
}
