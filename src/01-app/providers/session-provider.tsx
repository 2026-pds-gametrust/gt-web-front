import { useEffect, type ReactNode } from 'react';
import { useAuthStore } from '@features/auth/model/use-auth-store';

/**
 * Boot-time session hydration: if tokens survived in this browser, GET /auth/me
 * says whether they are still worth anything. A 401/404 there simply clears the
 * local session — the app keeps working anonymously, since discovery is public.
 */
export function SessionProvider({ children }: { children: ReactNode }) {
  const bootstrap = useAuthStore((s) => s.bootstrap);

  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);

  return <>{children}</>;
}
