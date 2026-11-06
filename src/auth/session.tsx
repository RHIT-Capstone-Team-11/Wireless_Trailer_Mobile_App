import { createContext, use, useMemo, type PropsWithChildren } from 'react';

import { useStorageState } from './storage';

export type User = {
  name: string;
  email: string;
};

type SessionContextValue = {
  user: User | null;
  isLoading: boolean;
  /** Resolves to an error message, or null on success. */
  signIn: (email: string, password: string) => Promise<string | null>;
  signOut: () => void;
};

const SessionContext = createContext<SessionContextValue | null>(null);

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function nameFromEmail(email: string) {
  return email
    .split('@')[0]
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(' ');
}

export function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

export function useSession() {
  const value = use(SessionContext);
  if (!value) throw new Error('useSession must be used inside <SessionProvider />');
  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, stored], setStored] = useStorageState('wireless.session');

  const value = useMemo<SessionContextValue>(() => {
    let user: User | null = null;
    try {
      user = stored ? (JSON.parse(stored) as User) : null;
    } catch {
      user = null;
    }

    return {
      user,
      isLoading,
      // Placeholder auth: accepts any well-formed email and a 6+ character password.
      // Replace with a call to the real backend once one exists.
      signIn: async (email, password) => {
        const trimmed = email.trim().toLowerCase();
        if (!EMAIL_PATTERN.test(trimmed)) return 'Enter a valid email address.';
        if (password.length < 6) return 'Password must be at least 6 characters.';
        setStored(JSON.stringify({ name: nameFromEmail(trimmed), email: trimmed }));
        return null;
      },
      signOut: () => setStored(null),
    };
  }, [isLoading, stored, setStored]);

  return <SessionContext value={value}>{children}</SessionContext>;
}
