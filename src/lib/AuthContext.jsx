import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  applyActionCode,
  checkActionCode,
  verifyPasswordResetCode,
  confirmPasswordReset,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '@/lib/firebase';

const AuthContext = createContext(null);

// WHY THIS CHANGED (verification-link fix):
// The old settings pointed straight at Firebase's own generic hosted
// action page (`authDomain`/__/auth/action), which is what produced the
// plain white "Try verifying your email again" screen in the screenshot.
// That page is NOT part of this app, so we can't control its copy, its
// styling, or — more importantly — retry/diagnostic behavior when a code
// is stale.
//
// Setting `handleCodeInApp: true` and pointing `url` at our own
// `/auth/action` route means Firebase emails a link back to THIS app.
// Our AuthAction page then calls the Firebase SDK's own
// applyActionCode/confirmPasswordReset functions (never hand-rolled
// verification), and can show a proper ABIXMART-branded success/error
// state, offer "resend" inline, and redirect into the app afterward.
//
// A verification/reset link is single-use by design: Firebase invalidates
// the oobCode as soon as it's consumed, and issuing a new email invalidates
// any earlier oobCode for that user. So "expired or already used" on an
// old link after a resend is expected Firebase behavior, not a bug — the
// fix here is making sure the CURRENT email's link actually works and that
// the app gives a clear, actionable message when a stale link is opened
// (see AuthAction.jsx) instead of Firebase's generic page.
function actionCodeSettings(path = '/auth/action') {
  return {
    url: `${window.location.origin}${path}`,
    handleCodeInApp: true,
  };
}

// Fields we own and refresh from Firebase Auth on every login/register —
// never blindly overwritten by a Google merge if the user already
// customized them in Firestore.
function buildGoogleProfilePatch(firebaseUser, existingProfile) {
  const patch = {
    uid: firebaseUser.uid,
    email: firebaseUser.email || '',
    provider: 'google',
    emailVerified: true,
    lastLoginAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  // Only seed these from Google if there's nothing there yet — a returning
  // user who already edited their name/photo in ABIXMART shouldn't have it
  // silently reset back to whatever Google has on file every time they log in.
  if (!existingProfile?.fullName) patch.fullName = firebaseUser.displayName || '';
  if (!existingProfile?.photoURL) patch.photoURL = firebaseUser.photoURL || '';
  if (existingProfile?.phone === undefined) patch.phone = '';
  if (!existingProfile) patch.createdAt = serverTimestamp();

  return patch;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const redirectHandledRef = useRef(false);

  const loadProfile = useCallback(async (firebaseUser) => {
    const ref = doc(db, 'users', firebaseUser.uid);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      return { ref, data: snap.data() };
    }

    // BUG FIX (missing-profile-document): a Firebase Auth user existed but
    // `users/{uid}` didn't (e.g. profile write failed mid-signup, or the
    // account was created before this Firestore step existed). Previously
    // this rendered raw placeholders ("—", "Your Account"). Instead,
    // reconstruct a profile from whatever Firebase Auth actually knows and
    // persist it, so the Account page always has real data to show.
    const reconstructed = {
      uid: firebaseUser.uid,
      fullName: firebaseUser.displayName || '',
      email: firebaseUser.email || '',
      phone: '',
      photoURL: firebaseUser.photoURL || '',
      provider: firebaseUser.providerData?.[0]?.providerId === 'google.com' ? 'google' : 'password',
      emailVerified: firebaseUser.emailVerified,
      createdAt: firebaseUser.metadata?.creationTime
        ? new Date(firebaseUser.metadata.creationTime)
        : serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
    };
    await setDoc(ref, reconstructed, { merge: true });
    const snap2 = await getDoc(ref);
    return { ref, data: snap2.exists() ? snap2.data() : reconstructed };
  }, []);

  const finishGoogleSignIn = useCallback(async (credential) => {
    const firebaseUser = credential.user;
    const ref = doc(db, 'users', firebaseUser.uid);
    const existingSnap = await getDoc(ref);
    const patch = buildGoogleProfilePatch(firebaseUser, existingSnap.exists() ? existingSnap.data() : null);
    await setDoc(ref, patch, { merge: true });
    return firebaseUser;
  }, []);

  useEffect(() => {
    // Handles the mobile/popup-blocked fallback: signInWithRedirect leaves
    // the page and comes back, so we have to pick the result up here once,
    // on mount, rather than from the click handler that started it.
    if (!redirectHandledRef.current) {
      redirectHandledRef.current = true;
      getRedirectResult(auth)
        .then((result) => {
          if (result) return finishGoogleSignIn(result);
        })
        .catch((err) => {
          // eslint-disable-next-line no-console
          console.error('[ABIXMART] Google redirect sign-in failed:', err?.code, err?.message);
        });
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      // `loading` is re-armed on every auth change (not just the first),
      // so the Account page waits for user AND profile together instead of
      // rendering a half-populated state mid-fetch.
      setLoading(true);
      setUser(firebaseUser);

      if (firebaseUser) {
        try {
          const { data } = await loadProfile(firebaseUser);
          setProfile(data);
          updateDoc(doc(db, 'users', firebaseUser.uid), { lastLoginAt: serverTimestamp() }).catch(() => {});
        } catch {
          setProfile(null);
        }
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, [loadProfile, finishGoogleSignIn]);

  const register = useCallback(async ({ fullName, phone, email, password }) => {
    const credential = await createUserWithEmailAndPassword(auth, email, password);

    await updateProfile(credential.user, { displayName: fullName });

    // Document ID is the Firebase Auth UID (not email) — required so a
    // deleted-and-recreated account with the same email never collides
    // with an old Firestore doc, and so an orphaned Firestore doc left
    // behind after an Auth user was deleted can never block a new signup
    // (Firebase Auth alone decides auth/email-already-in-use).
    try {
      await setDoc(doc(db, 'users', credential.user.uid), {
        uid: credential.user.uid,
        fullName,
        phone,
        email,
        photoURL: '',
        provider: 'password',
        emailVerified: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[ABIXMART] Firestore profile creation failed:', err?.code, err?.message, err);
      throw Object.assign(new Error('profile-write-failed'), { code: 'abixmart/profile-write-failed', cause: err });
    }

    let verificationError = null;
    try {
      await sendEmailVerification(credential.user, actionCodeSettings());
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
      // Non-fatal — profile doc may not exist yet for older accounts;
      // onAuthStateChanged's loadProfile() will reconstruct it.
    }
    return credential.user;
  }, []);

  const loginWithGoogle = useCallback(async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return await finishGoogleSignIn(result);
    } catch (err) {
      if (err?.code === 'auth/popup-blocked' || err?.code === 'auth/popup-closed-by-user') {
        // Fall back to redirect flow — most reliable on mobile browsers
        // and in-app webviews where popups are routinely blocked.
        if (err.code === 'auth/popup-blocked') {
          await signInWithRedirect(auth, googleProvider);
          return; // Page will navigate away; result picked up by getRedirectResult() above.
        }
      }
      throw err;
    }
  }, [finishGoogleSignIn]);

  const logout = useCallback(() => signOut(auth), []);

  const resendVerification = useCallback(async () => {
    if (!auth.currentUser) {
      throw new Error('No signed-in user to verify.');
    }
    try {
      await sendEmailVerification(auth.currentUser, actionCodeSettings());
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[ABIXMART] resend sendEmailVerification failed:', err?.code, err?.message, err);
      throw err;
    }
  }, []);

  const resetPassword = useCallback(
    (email) => sendPasswordResetEmail(auth, email, actionCodeSettings()),
    []
  );

  const refreshUser = useCallback(async () => {
    if (!auth.currentUser) return;
    await auth.currentUser.reload();
    setUser(auth.currentUser);
    if (auth.currentUser.emailVerified) {
      try {
        await updateDoc(doc(db, 'users', auth.currentUser.uid), { emailVerified: true, updatedAt: serverTimestamp() });
        setProfile((prev) => (prev ? { ...prev, emailVerified: true } : prev));
      } catch {
        // Non-fatal.
      }
    }
    return auth.currentUser.emailVerified;
  }, []);

  // --- Used by the in-app /auth/action page (AuthAction.jsx) ---------
  // These wrap Firebase's own action-code SDK calls; the app never
  // constructs or interprets verification/reset URLs itself.

  const confirmEmailVerification = useCallback(async (oobCode) => {
    // checkActionCode first so we can tell "already used / expired" apart
    // from any other failure and show a precise message, before actually
    // consuming the code with applyActionCode.
    await checkActionCode(auth, oobCode);
    await applyActionCode(auth, oobCode);
    if (auth.currentUser) {
      await auth.currentUser.reload();
      setUser(auth.currentUser);
      try {
        await updateDoc(doc(db, 'users', auth.currentUser.uid), { emailVerified: true, updatedAt: serverTimestamp() });
        setProfile((prev) => (prev ? { ...prev, emailVerified: true } : prev));
      } catch {
        // Non-fatal.
      }
    }
  }, []);

  const verifyResetCode = useCallback((oobCode) => verifyPasswordResetCode(auth, oobCode), []);

  const confirmReset = useCallback(
    (oobCode, newPassword) => confirmPasswordReset(auth, oobCode, newPassword),
    []
  );

  const value = {
    user,
    profile,
    loading,
    isAuthenticated: Boolean(user),
    register,
    login,
    loginWithGoogle,
    logout,
    resendVerification,
    resetPassword,
    refreshUser,
    confirmEmailVerification,
    verifyResetCode,
    confirmReset,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}