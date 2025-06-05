"use client";

import { useState, useEffect } from 'react';

export interface UserContextParams {
  userId: string;
  projectId: string;
  source: 'url' | 'env' | 'props';
}

export function useUserContext(propsUserId?: string, propsProjectId?: string): UserContextParams {
  const [userContext, setUserContext] = useState<UserContextParams>({
    userId: propsUserId || process.env.NEXT_PUBLIC_DEFAULT_USER_ID || 'demo-user',
    projectId: propsProjectId || process.env.NEXT_PUBLIC_DEFAULT_PROJECT_ID || 'demo-project',
    source: 'props'
  });

  useEffect(() => {
    // Check if we're in the browser
    if (typeof window === 'undefined') return;

    const urlParams = new URLSearchParams(window.location.search);
    const urlUserId = urlParams.get('user_id');
    const urlProjectId = urlParams.get('project_id');

    console.log(`[useUserContext] URL search params:`, window.location.search);
    console.log(`[useUserContext] URL userId: ${urlUserId}, projectId: ${urlProjectId}`);

    let userId: string;
    let projectId: string;
    let source: 'url' | 'env' | 'props';

    if (urlUserId && urlProjectId) {
      // Use URL parameters if both are present
      userId = urlUserId;
      projectId = urlProjectId;
      source = 'url';
    } else if (propsUserId && propsProjectId) {
      // Use props if provided
      userId = propsUserId;
      projectId = propsProjectId;
      source = 'props';
    } else {
      // Fall back to environment variables or defaults
      userId = process.env.NEXT_PUBLIC_DEFAULT_USER_ID || 'demo-user';
      projectId = process.env.NEXT_PUBLIC_DEFAULT_PROJECT_ID || 'demo-project';
      source = 'env';
    }

    console.log(`[useUserContext] Setting context - userId: ${userId}, projectId: ${projectId}, source: ${source}`);
    setUserContext({ userId, projectId, source });
  }, [propsUserId, propsProjectId]);

  console.log(`[useUserContext] Returning context:`, userContext);
  return userContext;
}
