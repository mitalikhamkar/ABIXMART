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

    await sendEmailVerification(credential.user);

    return credential.user;
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

  const resendVerification = useCallback(async () => {
    if (auth.currentUser) await sendEmailVerification(auth.currentUser);
  }, []);

  const resetPassword = useCallback((email) => sendPasswordResetEmail(auth, email), []);

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