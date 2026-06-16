"use client";

import { useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInAnonymously,
  signOut,
  type User,
} from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";

export default function FirebaseDemo() {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState("Connecting to Firebase Auth emulator...");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const auth = getFirebaseAuth();

    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setStatus(nextUser ? "Signed in anonymously" : "Not signed in");
      setBusy(false);
    });

    return () => unsubscribe();
  }, []);

  async function handleSignIn() {
    setBusy(true);
    setError(null);
    try {
      await signInAnonymously(getFirebaseAuth());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Anonymous sign-in failed");
      setBusy(false);
    }
  }

  async function handleSignOut() {
    setBusy(true);
    setError(null);
    try {
      await signOut(getFirebaseAuth());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-out failed");
      setBusy(false);
    }
  }

  return (
    <section className="w-full max-w-xl rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mb-6 space-y-2">
        <p className="text-sm font-medium uppercase tracking-wide text-orange-600">
          Firebase Demo
        </p>
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Anonymous Auth via local emulator
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{status}</p>
      </div>

      <div className="mb-6 flex gap-2">
        <button
          type="button"
          onClick={handleSignIn}
          disabled={busy || !!user}
          className="rounded-xl bg-orange-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Sign in anonymously
        </button>
        <button
          type="button"
          onClick={handleSignOut}
          disabled={busy || !user}
          className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
        >
          Sign out
        </button>
      </div>

      {error && (
        <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {error}
        </p>
      )}

      <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
        {user ? (
          <dl className="space-y-2 text-sm">
            <div>
              <dt className="text-zinc-500">UID</dt>
              <dd className="break-all font-mono text-zinc-900 dark:text-zinc-100">
                {user.uid}
              </dd>
            </div>
            <div>
              <dt className="text-zinc-500">Provider</dt>
              <dd className="text-zinc-900 dark:text-zinc-100">anonymous</dd>
            </div>
            <div>
              <dt className="text-zinc-500">Created</dt>
              <dd className="text-zinc-900 dark:text-zinc-100">
                {user.metadata.creationTime ?? "n/a"}
              </dd>
            </div>
          </dl>
        ) : (
          <p className="text-sm text-zinc-500">
            Click sign in to create an anonymous user in the Auth emulator.
          </p>
        )}
      </div>
    </section>
  );
}
