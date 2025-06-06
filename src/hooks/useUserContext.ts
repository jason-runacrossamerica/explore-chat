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
    console.log(`[useUserContext] Props userId: ${propsUserId}, projectId: ${propsProjectId}`);
    console.log(`[useUserContext] Env userId: ${process.env.NEXT_PUBLIC_DEFAULT_USER_ID}, projectId: ${process.env.NEXT_PUBLIC_DEFAULT_PROJECT_ID}`);

    // Prioritize URL parameters first, then props, then environment variables
    const userId = urlUserId || propsUserId || process.env.NEXT_PUBLIC_DEFAULT_USER_ID || 'demo-user';
    const projectId = urlProjectId || propsProjectId || process.env.NEXT_PUBLIC_DEFAULT_PROJECT_ID || 'demo-project';

    // Determine the primary source based on what was actually used
    let source: 'url' | 'env' | 'props';
    if (urlUserId || urlProjectId) {
      source = 'url';
    } else if (propsUserId || propsProjectId) {
      source = 'props';
    } else {
      source = 'env';
    }

    console.log(`[useUserContext] Final values - userId: ${userId} (from ${urlUserId ? 'URL' : propsUserId ? 'props' : 'env'}), projectId: ${projectId} (from ${urlProjectId ? 'URL' : propsProjectId ? 'props' : 'env'}), source: ${source}`);
    setUserContext({ userId, projectId, source });
  }, [propsUserId, propsProjectId]);

  console.log(`[useUserContext] Returning context:`, userContext);
  return userContext;
}
