import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from '@app/providers/app-router';
import { SessionProvider } from '@app/providers/session-provider';

export function App() {
  return (
    <BrowserRouter>
      <SessionProvider>
        <AppRouter />
      </SessionProvider>
    </BrowserRouter>
  );
}
