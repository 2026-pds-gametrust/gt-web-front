import { AppShell } from '@widgets/app-shell/app-shell';
import { ChatInbox } from '@widgets/chat-inbox/chat-inbox';

export function ConversationsPage() {
  return (
    <AppShell flushMain>
      <ChatInbox />
    </AppShell>
  );
}
