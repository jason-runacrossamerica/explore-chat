"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Dumbbell, X, Send } from 'lucide-react';
import { useUserContext } from '@/hooks/useUserContext';
import styles from './ChatInterface.module.css';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatInterfaceProps {
  userId?: string;
  projectId?: string;
  className?: string;
  isFullPage?: boolean;
  onClose?: () => void;
}

interface ChatResponse {
  response?: string;
  fallbackResponse?: string;
  timestamp?: string;
}

interface SuggestionsResponse {
  suggestions?: string[];
}

export function ChatInterface({
  userId: propsUserId,
  projectId: propsProjectId,
  className = '',
  isFullPage = false,
  onClose
}: ChatInterfaceProps) {
  // Get user context from URL params, props, or environment variables
  const { userId, projectId, source } = useUserContext(propsUserId, propsProjectId);

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
      const greetingResponse = await fetch('/api/chat', {
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
      const suggestionsResponse = await fetch(`/api/suggestions?userId=${userId}&projectId=${projectId}`);
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

  // Initialize chatbot when component mounts (for full page) or when opened (for popup)
  useEffect(() => {
    if (!isInitialized) {
      initializeChatbot();
    }
  }, [initializeChatbot, isInitialized]);

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
      const response = await fetch('/api/chat', {
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
    <div className={`${styles.chatInterface} ${isFullPage ? styles.fullPage : styles.popup} ${className}`}>
      {/* Header */}
      <div className={styles.chatHeader}>
        <div className={styles.coachInfo}>
          <div className={styles.coachAvatar}>
            <Dumbbell size={20} />
          </div>
          <div>
            <h3>Fitness Coach</h3>
            <span className={styles.status}>
              Online • {source === 'url' ? 'URL params' : source === 'env' ? 'Default user' : 'Props'} • Ready to help
            </span>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Close chat"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className={styles.messagesContainer}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`${styles.message} ${message.isUser ? styles.userMessage : styles.aiMessage}`}
          >
            <div className={styles.messageContent}>
              {message.text}
            </div>
            <div className={styles.messageTime}>
              {message.timestamp.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className={`${styles.message} ${styles.aiMessage}`}>
            <div className={`${styles.messageContent} ${styles.typingIndicator}`}>
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
        <div className={styles.suggestionsContainer}>
          <div className={styles.suggestionsTitle}>Try asking:</div>
          <div className={styles.suggestionsGrid}>
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSendMessage(suggestion)}
                className={styles.suggestionButton}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className={styles.chatInput}>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask me about your fitness goals..."
          className={styles.inputField}
          rows={1}
        />
        <button
          onClick={() => handleSendMessage()}
          disabled={!inputText.trim()}
          className={styles.sendButton}
          aria-label="Send message"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
