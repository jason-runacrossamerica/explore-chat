import React from 'react';
import { ChatInterface } from '@/components/ChatInterface';
import './chat-page.css';

interface ChatPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ChatPage({ searchParams }: ChatPageProps) {
  // Await the searchParams promise (Next.js 15+ requirement)
  const params = await searchParams;

  // Extract user_id and project_id from URL parameters
  const userId = typeof params.user_id === 'string' ? params.user_id : undefined;
  const projectId = typeof params.project_id === 'string' ? params.project_id : undefined;

  return (
    <div className="chat-page">
      {/* Full Page Chat Interface with URL params passed as props */}
      <ChatInterface
        isFullPage={true}
        userId={userId}
        projectId={projectId}
      />
    </div>
  );
}
