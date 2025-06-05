"use client";

import React from 'react';
import { ChatInterface } from '@/components/ChatInterface';

export default function ChatPage() {
  return (
    <div className="chat-page">
      {/* Full Page Chat Interface */}
      <ChatInterface isFullPage={true} />

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
