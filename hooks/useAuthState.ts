import { useState, useEffect } from 'react';
import { auth } from '../config/firebase';

export function useAuthState() {
  const [user, setUser] = useState<typeof user | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((userAuth) => {
      setUser(userAuth);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, isLoading };
}
