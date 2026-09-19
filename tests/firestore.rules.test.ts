import { readFileSync } from "node:fs";
import test from "node:test";
import {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds,
} from "@firebase/rules-unit-testing";
import {
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { saveProgress } from "../src/lib/progress";
import assert from "node:assert/strict";

test("進捗Rules: 認証・パス・型・範囲・競合・ユーザー分離", async () => {
  const env = await initializeTestEnvironment({
    projectId: "demo-trip-talk",
    firestore: {
      rules: readFileSync("firestore.rules", "utf8"),
      host: "127.0.0.1",
      port: 8080,
    },
  });
  try {
    await env.withSecurityRulesDisabled(async (context) => {
      for (const user of ["tamoyan", "gonzaemon"])
        await deleteDoc(
          doc(context.firestore(), `progress/${user}/scripts/MOTOKI999999`),
        );
    });
    const db = doc(
      env
        .authenticatedContext("anonymous-test", {
          firebase: { sign_in_provider: "anonymous" },
        })
        .firestore(),
      "test/reference",
    ).firestore;
    const guest = env.unauthenticatedContext().firestore();
    const path = "progress/tamoyan/scripts/MOTOKI999999";
    const value = () => ({
      readAloudCount: 0,
      lastReadAt: null,
      selfRating: null,
      updatedAt: serverTimestamp(),
    });
    await assertFails(getDoc(doc(guest, path)));
    await assertFails(setDoc(doc(guest, path), value()));
    for (const p of [
      "private/test",
      "progress/other/scripts/MOTOKI0",
      "progress/tamoyan/scripts/TEST",
      "progress/tamoyan/scripts/MOTOKI01",
    ])
      await assertFails(setDoc(doc(db, p), value()));
    for (const patch of [
      { extra: true },
      { selfRating: 0 },
      { selfRating: 5 },
      { selfRating: 1.5 },
      { selfRating: "1" },
      { readAloudCount: -1 },
      { readAloudCount: 0.5 },
      { readAloudCount: 2147483648 },
      { lastReadAt: "today" },
      { updatedAt: Timestamp.fromMillis(0) },
    ])
      await assertFails(setDoc(doc(db, path), { ...value(), ...patch }));
    await assertSucceeds(setDoc(doc(db, path), value()));
    await assertFails(deleteDoc(doc(db, path)));
    await Promise.all([
      saveProgress(db, "tamoyan", "MOTOKI999999", { kind: "read" }),
      saveProgress(db, "tamoyan", "MOTOKI999999", { kind: "read" }),
    ]);
    const before = (await getDoc(doc(db, path))).data()!;
    assert.equal(before.readAloudCount, 2);
    for (const rating of [1, 2, 3, 4, null] as const)
      await assertSucceeds(
        saveProgress(db, "tamoyan", "MOTOKI999999", { kind: "rating", rating }),
      );
    const after = (await getDoc(doc(db, path))).data()!;
    assert.ok(before.lastReadAt.isEqual(after.lastReadAt));
    assert.equal(after.selfRating, null);
    assert.equal(
      (
        await getDoc(doc(db, "progress/gonzaemon/scripts/MOTOKI999999"))
      ).exists(),
      false,
    );
    await assertSucceeds(
      saveProgress(db, "gonzaemon", "MOTOKI999999", { kind: "read" }),
    );
    assert.equal((await getDoc(doc(db, path))).data()!.readAloudCount, 2);
  } finally {
    await env.cleanup();
  }
});
