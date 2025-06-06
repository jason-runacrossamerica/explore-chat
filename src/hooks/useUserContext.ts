"use client";

import { useState, useEffect } from 'react';

export interface UserContextParams {
  userId: string;
  projectId: string;
  source: 'url' | 'env' | 'props';
}

export function useUserContext(propsUserId?: string, propsProjectId?: string): UserContextParams {
  // Initialize with props if available, otherwise use environment defaults
  const getInitialContext = (): UserContextParams => {
    if (propsUserId && propsProjectId) {
      return {
        userId: propsUserId,
        projectId: propsProjectId,
        source: 'props'
      };
    }

    return {
      userId: process.env.NEXT_PUBLIC_DEFAULT_USER_ID || 'demo-user',
      projectId: process.env.NEXT_PUBLIC_DEFAULT_PROJECT_ID || 'demo-project',
      source: 'env'
    };
  };

  const [userContext, setUserContext] = useState<UserContextParams>(getInitialContext);

  useEffect(() => {
    // Check if we're in the browser
    if (typeof window === 'undefined') return;

    const urlParams = new URLSearchParams(window.location.search);
    const urlUserId = urlParams.get('user_id');
    const urlProjectId = urlParams.get('project_id');

    let userId: string;
    let projectId: string;
    let source: 'url' | 'env' | 'props';

    // Priority: URL params > Props > Environment variables
    if (urlUserId && urlProjectId) {
      // Use URL parameters if both are present (highest priority)
      userId = urlUserId;
      projectId = urlProjectId;
      source = 'url';
    } else if (propsUserId && propsProjectId) {
      // Use props if provided (medium priority)
      userId = propsUserId;
      projectId = propsProjectId;
      source = 'props';
    } else {
      // Fall back to environment variables or defaults (lowest priority)
      userId = process.env.NEXT_PUBLIC_DEFAULT_USER_ID || 'demo-user';
      projectId = process.env.NEXT_PUBLIC_DEFAULT_PROJECT_ID || 'demo-project';
      source = 'env';
    }

    setUserContext({ userId, projectId, source });
  }, [propsUserId, propsProjectId]);

  return userContext;
}
