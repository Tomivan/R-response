'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from './config';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useAuthStore } from '../store/authStore';

interface FirebaseContextType {
  user: User | null;
  loading: boolean;
}

const FirebaseContext = createContext<FirebaseContextType>({
  user: null,
  loading: true,
});

export const FirebaseProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const setStoreUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setStoreUser(user ? {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
      } : null);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setStoreUser]);

  return (
    <FirebaseContext.Provider value={{ user, loading }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => useContext(FirebaseContext);