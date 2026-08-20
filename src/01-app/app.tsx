import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from '@app/providers/app-router';
import { ErrorBoundary } from '@app/providers/error-boundary';
import { SessionProvider } from '@app/providers/session-provider';

export function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <SessionProvider>
          <AppRouter />
        </SessionProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
