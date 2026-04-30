import { useEffect, useState } from 'react';
import { getUserInfo } from '@/services/auth.services';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'CONTENT_MANAGER' | 'VIEWER';
}

export interface Session {
  user: User;
  expires: string;
}

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const user = await getUserInfo();
        if (user?.data) {
          setSession({
            user: user.data,
            expires: user.data.expiresAt || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          });
        } else {
          setSession(null);
        }
      } catch (error) {
        console.error('Failed to load session:', error);
        setSession(null);
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, []);

  return { session, loading };
}
