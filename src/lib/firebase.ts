import { getApps, initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};
export const firebaseConfigured = Object.values(config).every(
  (value) => !!value?.trim(),
);
let connection: ReturnType<typeof connect> | undefined;
async function connect() {
  if (!firebaseConfigured) throw new Error("Firebase設定待ち");
  const app =
    getApps().find((app) => app.name === "trip-talk") ??
    initializeApp(config, "trip-talk");
  const auth = getAuth(app);
  await auth.authStateReady();
  if (!auth.currentUser) await signInAnonymously(auth);
  return getFirestore(app);
}
export function progressDatabase() {
  connection ??= connect().catch((error) => {
    connection = undefined;
    throw error;
  });
  return connection;
}
