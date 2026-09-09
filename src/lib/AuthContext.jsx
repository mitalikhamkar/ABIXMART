import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

// Real Firebase-backed auth context. `user` is the raw Firebase Auth user
// (or null). `profile` is that user's Firestore users/{uid} document.
const AuthContext = createContext(null);

// FIX (Firebase Issue #1): sendEmailVerification / sendPasswordResetEmail
// were being called with no ActionCodeSettings, so Firebase routed the
// click to its generic hosted action page with no way back into
// ABIXMART. Passing `url` gives Firebase a "Continue" destination, and
// `handleCodeInApp: false` keeps verification happening on Firebase's
// own hosted handler (which is what actually flips emailVerified),
// rather than us trying to catch the oobCode ourselves.
//
// FIREBASE CONSOLE ACTION STILL REQUIRED: this only works if the domain
// the link is opened from (localhost in dev, your real domain in prod)
// is listed under Authentication → Settings → Authorized domains.
const actionCodeSettings = {
  url: `${window.location.origin}/login`,
  handleCodeInApp: false,
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        try {
          const ref = doc(db, 'users', firebaseUser.uid);
          const snap = await getDoc(ref);
          setProfile(snap.exists() ? snap.data() : null);
          // Best-effort — don't block the auth state on this.
          updateDoc(ref, { lastLoginAt: serverTimestamp() }).catch(() => {});
        } catch {
          setProfile(null);
        }
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  /**
   * BUG FIX: account creation + verification email used to be one
   * all-or-nothing chain. If `sendEmailVerification` threw for ANY
   * reason (most commonly Firebase's `auth/too-many-requests` rate
   * limit, which fires easily during repeated testing/dev signups), the
   * whole `register()` promise rejected — even though
   * `createUserWithEmailAndPassword` and the Firestore profile write had
   * already succeeded. The caller's catch block then showed a generic
   * "Something went wrong" error and never set `submitted = true`, so it
   * looked to the user like signup itself had failed — while a real
   * Firebase account (with no verification email ever sent) silently
   * existed. That mismatch is exactly the "account created, no email
   * received" symptom.
   *
   * Fix: the verification email is now sent as an explicit, SEPARATE
   * step. Its failure is captured and returned to the caller (as
   * `verificationError`) instead of rejecting the whole registration,
   * and the real Firebase error code is logged to the console instead of
   * being silently discarded — so it's actually possible to see WHY it
   * failed (open devtools after signing up and check for a line starting
   * "[ABIXMART] sendEmailVerification failed:").
   */
  const register = useCallback(async ({ fullName, phone, email, password }) => {
    const credential = await createUserWithEmailAndPassword(auth, email, password);

    await updateProfile(credential.user, { displayName: fullName });

    await setDoc(doc(db, 'users', credential.user.uid), {
      fullName,
      phone,
      email,
      emailVerified: false,
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
    });

    let verificationError = null;
    try {
      await sendEmailVerification(credential.user, actionCodeSettings);
    } catch (err) {
      verificationError = err;
      // eslint-disable-next-line no-console
      console.error('[ABIXMART] sendEmailVerification failed:', err?.code, err?.message, err);
    }

    return { user: credential.user, verificationError };
  }, []);

  const login = useCallback(async (email, password) => {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    try {
      await updateDoc(doc(db, 'users', credential.user.uid), { lastLoginAt: serverTimestamp() });
    } catch {
      // Non-fatal — profile doc may not exist yet for older accounts.
    }
    return credential.user;
  }, []);

  const logout = useCallback(() => signOut(auth), []);

  // Intentionally does NOT catch its own errors — the caller (the
  // "Resend" button on the Account page) needs the real rejection so it
  // can show it instead of pretending the email went out.
  const resendVerification = useCallback(async () => {
    if (!auth.currentUser) {
      throw new Error('No signed-in user to verify.');
    }
    try {
      await sendEmailVerification(auth.currentUser, actionCodeSettings);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[ABIXMART] resend sendEmailVerification failed:', err?.code, err?.message, err);
      throw err;
    }
  }, []);

  const resetPassword = useCallback(
    (email) => sendPasswordResetEmail(auth, email, actionCodeSettings),
    []
  );

  // Re-reads the Firebase user (e.g. after they click the verification
  // link in another tab) so `user.emailVerified` reflects reality.
  const refreshUser = useCallback(async () => {
    if (!auth.currentUser) return;
    await auth.currentUser.reload();
    setUser(auth.currentUser);
    if (auth.currentUser.emailVerified) {
      try {
        await updateDoc(doc(db, 'users', auth.currentUser.uid), { emailVerified: true });
      } catch {
        // Non-fatal.
      }
    }
    return auth.currentUser.emailVerified;
  }, []);

  const value = {
    user,
    profile,
    loading,
    isAuthenticated: Boolean(user),
    register,
    login,
    logout,
    resendVerification,
    resetPassword,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}