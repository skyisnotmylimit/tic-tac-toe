import { useEffect, useState, useCallback } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import type { FirebaseUser } from '../types/game';

interface AuthState {
  user: FirebaseUser | null;
  loading: boolean;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<string | null>;
  register: (email: string, password: string, displayName: string) => Promise<string | null>;
  signOut: () => Promise<void>;
}

export function useAuth(): AuthState & AuthActions {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<string | null> => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return null;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed';
      return message;
    }
  }, []);

  const register = useCallback(
    async (email: string, password: string, displayName: string): Promise<string | null> => {
      try {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(cred.user, { displayName });
        setUser({ ...cred.user });
        return null;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Registration failed';
        return message;
      }
    },
    []
  );

  const signOut = useCallback(async () => {
    await firebaseSignOut(auth);
  }, []);

  return { user, loading, login, register, signOut };
}
