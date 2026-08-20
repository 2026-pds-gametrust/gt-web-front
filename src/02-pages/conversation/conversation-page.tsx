import { useParams } from 'react-router-dom';
import { AppShell } from '@widgets/app-shell/app-shell';
import { ChatInbox } from '@widgets/chat-inbox/chat-inbox';

export function ConversationPage() {
  const { conversationId = '' } = useParams();
  return (
    <AppShell flushMain>
      <ChatInbox conversationId={conversationId} />
    </AppShell>
  );
}
