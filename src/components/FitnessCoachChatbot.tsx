"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Send, Dumbbell } from 'lucide-react';
import { useUserContext } from '@/hooks/useUserContext';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface FitnessCoachChatbotProps {
  userId?: string;
  projectId?: string;
  className?: string;
}

interface ChatResponse {
  response?: string;
  fallbackResponse?: string;
  timestamp?: string;
}

interface SuggestionsResponse {
  suggestions?: string[];
}

export function FitnessCoachChatbot({
  userId: propsUserId,
  projectId: propsProjectId,
  className = ''
}: FitnessCoachChatbotProps) {
  // Get user context from URL params, props, or environment variables
  const { userId, projectId, source } = useUserContext(propsUserId, propsProjectId);

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeChatbot = useCallback(async () => {
    setIsTyping(true);
    try {
      // Get personalized greeting
      const greetingResponse = await fetch('/chat/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'greeting',
          userId,
          projectId
        })
      });

      const greetingData: ChatResponse = await greetingResponse.json();

      const greetingMessage: Message = {
        id: Date.now().toString(),
        text: greetingData.response || greetingData.fallbackResponse || "Hey there! 💪 I'm your fitness coach. How can I help you today?",
        isUser: false,
        timestamp: new Date()
      };

      setMessages([greetingMessage]);

      // Get suggested questions
      const suggestionsResponse = await fetch(`/chat/api/suggestions?userId=${userId}&projectId=${projectId}`);
      const suggestionsData: SuggestionsResponse = await suggestionsResponse.json();
      setSuggestions(suggestionsData.suggestions || []);

    } catch (error) {
      console.error('Error initializing chatbot:', error);
      const fallbackMessage: Message = {
        id: Date.now().toString(),
        text: "Hey there! 💪 I'm your fitness coach. I'm here to help you crush your goals and stay motivated. How can I support you today?",
        isUser: false,
        timestamp: new Date()
      };
      setMessages([fallbackMessage]);
    } finally {
      setIsTyping(false);
      setIsInitialized(true);
    }
  }, [userId, projectId]);

  // Initialize chatbot when opened
  useEffect(() => {
    if (isOpen && !isInitialized) {
      initializeChatbot();
    }
  }, [isOpen, isInitialized, initializeChatbot]);

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputText.trim();
    if (!textToSend) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: textToSend,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      // Prepare conversation history for context
      const conversationHistory = messages.map(msg => ({
        role: msg.isUser ? 'user' : 'assistant' as const,
        content: msg.text
      }));

      // Call our chat API
      const response = await fetch('/chat/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          conversationHistory,
          userId,
          projectId
        })
      });

      const data: ChatResponse = await response.json();

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response || data.fallbackResponse || "I'm here to help! Could you try asking that again?",
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);

    } catch (error) {
      console.error('Error sending message:', error);
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm having trouble connecting right now, but I'm still here to help! Try asking me about fitness tips or motivation strategies. 💪",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={`fitness-coach-chatbot ${className}`}>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="chat-button"
          aria-label="Open fitness coach chat"
        >
          <Dumbbell size={24} />
          <div className="pulse-ring"></div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window">
          {/* Header */}
          <div className="chat-header">
            <div className="coach-info">
              <div className="coach-avatar">
                <Dumbbell size={20} />
              </div>
              <div>
                <h3>Fitness Coach</h3>
                <span className="status">
                  Online • {source === 'url' ? 'URL params' : source === 'env' ? 'Default user' : 'Props'} • Ready to help
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="close-button"
              aria-label="Close chat"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="messages-container">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${message.isUser ? 'user-message' : 'ai-message'}`}
              >
                <div className="message-content">
                  {message.text}
                </div>
                <div className="message-time">
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="message ai-message">
                <div className="message-content typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          {suggestions.length > 0 && messages.length <= 1 && (
            <div className="suggestions-container">
              <div className="suggestions-title">Try asking:</div>
              <div className="suggestions-grid">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSendMessage(suggestion)}
                    className="suggestion-button"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="chat-input">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about your fitness goals..."
              className="input-field"
              rows={1}
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim()}
              className="send-button"
              aria-label="Send message"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .fitness-coach-chatbot {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 1000;
          font-family: 'din-2014-narrow', 'Droid Sans', sans-serif;
        }

        .chat-button {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: linear-gradient(135deg, #dc2626, #ef4444);
          border: none;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 32px rgba(220, 38, 38, 0.3);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .chat-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(220, 38, 38, 0.4);
        }

        .pulse-ring {
          position: absolute;
          width: 100%;
          height: 100%;
          border: 2px solid #dc2626;
          border-radius: 50%;
          animation: pulse 2s infinite;
          opacity: 0.6;
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.3;
          }
          100% {
            transform: scale(1.4);
            opacity: 0;
          }
        }

        .chat-window {
          width: 380px;
          height: 600px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: slideUp 0.3s ease-out;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .chat-header {
          background: linear-gradient(135deg, #dc2626, #ef4444);
          color: white;
          padding: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .coach-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .coach-avatar {
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .coach-info h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 700;
          font-family: 'din-2014-narrow', sans-serif;
        }

        .status {
          font-size: 12px;
          opacity: 0.9;
          font-family: 'Droid Sans', sans-serif;
        }

        .close-button {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: background-color 0.2s;
        }

        .close-button:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .messages-container {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
          background: #fafafa;
        }

        .message {
          display: flex;
          flex-direction: column;
          max-width: 80%;
        }

        .user-message {
          align-self: flex-end;
          align-items: flex-end;
        }

        .ai-message {
          align-self: flex-start;
          align-items: flex-start;
        }

        .message-content {
          padding: 12px 16px;
          border-radius: 16px;
          font-size: 14px;
          line-height: 1.4;
          font-family: 'Droid Sans', sans-serif;
        }

        .user-message .message-content {
          background: #dc2626;
          color: white;
          border-bottom-right-radius: 4px;
        }

        .ai-message .message-content {
          background: white;
          color: #333;
          border: 1px solid #e5e5e5;
          border-bottom-left-radius: 4px;
        }

        .message-time {
          font-size: 11px;
          color: #666;
          margin-top: 4px;
          font-family: 'Droid Sans', sans-serif;
        }

        .typing-indicator {
          display: flex;
          gap: 4px;
          align-items: center;
          padding: 16px !important;
        }

        .typing-indicator span {
          width: 8px;
          height: 8px;
          background: #dc2626;
          border-radius: 50%;
          animation: typing 1.4s infinite ease-in-out;
        }

        .typing-indicator span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-indicator span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes typing {
          0%, 60%, 100% {
            transform: translateY(0);
            opacity: 0.5;
          }
          30% {
            transform: translateY(-10px);
            opacity: 1;
          }
        }

        .chat-input {
          padding: 20px;
          background: white;
          border-top: 1px solid #e5e5e5;
          display: flex;
          gap: 12px;
          align-items: flex-end;
        }

        .input-field {
          flex: 1;
          border: 1px solid #e5e5e5;
          border-radius: 12px;
          padding: 12px 16px;
          font-size: 14px;
          font-family: 'Droid Sans', sans-serif;
          resize: none;
          outline: none;
          transition: border-color 0.2s;
          max-height: 100px;
        }

        .input-field:focus {
          border-color: #dc2626;
        }

        .send-button {
          width: 44px;
          height: 44px;
          background: #dc2626;
          border: none;
          border-radius: 12px;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .send-button:hover:not(:disabled) {
          background: #b91c1c;
          transform: translateY(-1px);
        }

        .send-button:disabled {
          background: #d1d5db;
          cursor: not-allowed;
        }

        .suggestions-container {
          padding: 16px 20px;
          background: #f9fafb;
          border-top: 1px solid #e5e5e5;
        }

        .suggestions-title {
          font-size: 12px;
          color: #6b7280;
          margin-bottom: 12px;
          font-family: 'Droid Sans', sans-serif;
          font-weight: 500;
        }

        .suggestions-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .suggestion-button {
          background: white;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          padding: 8px 12px;
          font-size: 12px;
          color: #374151;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
          font-family: 'Droid Sans', sans-serif;
          line-height: 1.3;
        }

        .suggestion-button:hover {
          border-color: #dc2626;
          background: #fef2f2;
          color: #dc2626;
        }

        @media (max-width: 480px) {
          .chat-window {
            width: calc(100vw - 32px);
            height: calc(100vh - 100px);
            position: fixed;
            bottom: 16px;
            right: 16px;
          }
        }
      `}</style>
    </div>
  );
}
