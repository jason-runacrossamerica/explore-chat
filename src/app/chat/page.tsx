import React from 'react';
import { ChatInterface } from '@/components/ChatInterface';

interface ChatPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ChatPage({ searchParams }: ChatPageProps) {
  // Access URL parameters server-side
  const params = await searchParams;
  const userId = typeof params.user_id === 'string' ? params.user_id : undefined;
  const projectId = typeof params.project_id === 'string' ? params.project_id : undefined;

  console.log(`[ChatPage] Server-side params - userId: ${userId}, projectId: ${projectId}`);

  return (
    <div className="chat-page">
      {/* Full Page Chat Interface with server-extracted parameters */}
      <ChatInterface
        isFullPage={true}
        userId={userId}
        projectId={projectId}
      />

      <style jsx>{`
        .chat-page {
          height: 100vh;
          width: 100vw;
          overflow: hidden;
          font-family: 'din-2014-narrow', 'Droid Sans', sans-serif;
        }
      `}</style>
    </div>
  );
}
