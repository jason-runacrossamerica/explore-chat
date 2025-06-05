// User Context Service - Fetches fitness data from your APIs

export interface UserProfile {
  first_name: string;
  user_id: string;
}

export interface ProjectParticipant {
  project_goal_distance: number;
  project_goal_distance_units: 'Miles' | 'KM';
  cohort_start_date?: string;
  cohort_end_date?: string;
}

export interface Challenge {
  challenge_id: string;
  title: string;
  start_date: string;
  end_date: string;
  has_result: boolean;
  challenge_extra_data: {
    title_inactive?: string;
    explore_description?: string;
  };
}

export interface ChallengeData {
  challenges_with_badges: Challenge[];
}

export interface UserContext {
  profile: UserProfile | null;
  participant: ProjectParticipant | null;
  seasonProgress: number | null;
  challenges: Challenge[] | null;
  communityTotal: number | null;
  error?: string;
}

const API_BASE = 'https://runprod.cockpitmobile.com';

export class UserContextService {
  static async fetchUserProfile(userId: string): Promise<UserProfile | null> {
    const url = `${API_BASE}/users/${userId}`;
    console.log(`[UserContext] Fetching user profile from: ${url}`);

    try {
      const response = await fetch(url);
      console.log(`[UserContext] User profile response status: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[UserContext] User profile API error: ${response.status} - ${errorText}`);
        throw new Error(`Failed to fetch user profile: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`[UserContext] User profile data received:`, data);
      return data;
    } catch (error) {
      console.error('[UserContext] Error fetching user profile:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.error('[UserContext] Network error - check if API is accessible');
      }
      return null;
    }
  }

  static async fetchProjectParticipant(userId: string, projectId: string): Promise<ProjectParticipant | null> {
    const url = `${API_BASE}/projectparticipants?user_id=${userId}&project_id=${projectId}`;
    console.log(`[UserContext] Fetching project participant from: ${url}`);

    try {
      const response = await fetch(url);
      console.log(`[UserContext] Project participant response status: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[UserContext] Project participant API error: ${response.status} - ${errorText}`);
        throw new Error(`Failed to fetch project participant: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`[UserContext] Project participant data received:`, data);
      return data[0] || null;
    } catch (error) {
      console.error('[UserContext] Error fetching project participant:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.error('[UserContext] Network error - check if API is accessible');
      }
      return null;
    }
  }

  static async fetchSeasonProgress(projectId: string, userId: string): Promise<number | null> {
    try {
      const response = await fetch(`${API_BASE}/events/${projectId}/cumulative/distance/users/${userId}`, {
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error('Failed to fetch season progress');
      const data = await response.json();
      return data.total_distance || 0;
    } catch (error) {
      console.error('Error fetching season progress:', error);
      return null;
    }
  }

  static async fetchChallenges(userId: string, projectId: string, participant: ProjectParticipant): Promise<Challenge[] | null> {
    try {
      const hasCohort = participant.cohort_start_date && participant.cohort_end_date;
      const url = hasCohort
        ? `${API_BASE}/events/${projectId}/challenges/user/${userId}/dates`
        : `${API_BASE}/events/${projectId}/challenges/user/${userId}?include_unlockable=t`;

      const options: RequestInit = {
        method: hasCohort ? 'POST' : 'GET',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: hasCohort ? JSON.stringify({
          cohort_start_date: new Date(participant.cohort_start_date),
          cohort_end_date: new Date(participant.cohort_end_date)
        }) : undefined
      };

      const response = await fetch(url, options);
      if (!response.ok) throw new Error('Failed to fetch challenges');
      const data: ChallengeData = await response.json();
      return data.challenges_with_badges || [];
    } catch (error) {
      console.error('Error fetching challenges:', error);
      return null;
    }
  }

  static async fetchCommunityTotal(projectId: string): Promise<number | null> {
    try {
      const response = await fetch(`${API_BASE}/projects/${projectId}/community-total`);
      if (!response.ok) throw new Error('Failed to fetch community total');
      const data = await response.json();
      return data.total || 0;
    } catch (error) {
      console.error('Error fetching community total:', error);
      return null;
    }
  }

  static async getUserContext(userId: string, projectId: string): Promise<UserContext> {
    console.log(`[UserContext] Getting user context for userId: ${userId}, projectId: ${projectId}`);

    try {
      // Fetch user profile and project participant in parallel
      console.log('[UserContext] Fetching user profile and project participant...');
      const [profile, participant] = await Promise.all([
        this.fetchUserProfile(userId),
        this.fetchProjectParticipant(userId, projectId)
      ]);

      console.log(`[UserContext] Profile result:`, profile ? 'SUCCESS' : 'FAILED');
      console.log(`[UserContext] Participant result:`, participant ? 'SUCCESS' : 'FAILED');

      if (!profile || !participant) {
        console.warn('[UserContext] Missing basic user data, returning error context');
        return {
          profile: null,
          participant: null,
          seasonProgress: null,
          challenges: null,
          communityTotal: null,
          error: 'Failed to fetch basic user data'
        };
      }

      // Fetch additional data in parallel
      const [seasonProgress, challenges, communityTotal] = await Promise.all([
        this.fetchSeasonProgress(projectId, userId),
        this.fetchChallenges(userId, projectId, participant),
        this.fetchCommunityTotal(projectId)
      ]);

      return {
        profile,
        participant,
        seasonProgress,
        challenges,
        communityTotal
      };
    } catch (error) {
      console.error('Error getting user context:', error);
      return {
        profile: null,
        participant: null,
        seasonProgress: null,
        challenges: null,
        communityTotal: null,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  static formatUserContextForAI(context: UserContext): string {
    if (context.error || !context.profile || !context.participant) {
      return "I don't have access to your fitness data right now, but I'm still here to help with general fitness advice!";
    }

    const { profile, participant, seasonProgress, challenges, communityTotal } = context;
    
    // Calculate progress percentage
    const progressPercent = seasonProgress && participant.project_goal_distance 
      ? Math.round((seasonProgress / participant.project_goal_distance) * 100)
      : 0;

    // Format active challenges
    const activeChallenges = challenges?.filter(c => {
      const now = new Date();
      const start = new Date(c.start_date);
      const end = new Date(c.end_date);
      return start <= now && end >= now;
    }) || [];

    // Format upcoming challenges
    const upcomingChallenges = challenges?.filter(c => {
      const now = new Date();
      const start = new Date(c.start_date);
      const fiveDaysFromNow = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);
      return start > now && start <= fiveDaysFromNow;
    }) || [];

    let contextString = `User Profile:
- Name: ${profile.first_name}
- Goal: ${participant.project_goal_distance} ${participant.project_goal_distance_units} this season
- Current Progress: ${seasonProgress || 0} ${participant.project_goal_distance_units} (${progressPercent}% of goal)`;

    if (communityTotal) {
      contextString += `\n- Community Total: ${communityTotal} KM contributed by all participants`;
    }

    if (activeChallenges.length > 0) {
      contextString += `\n\nActive Challenges:`;
      activeChallenges.forEach(c => {
        contextString += `\n- ${c.title} (ends ${new Date(c.end_date).toLocaleDateString()})`;
      });
    }

    if (upcomingChallenges.length > 0) {
      contextString += `\n\nUpcoming Challenges:`;
      upcomingChallenges.forEach(c => {
        contextString += `\n- ${c.title} (starts ${new Date(c.start_date).toLocaleDateString()})`;
      });
    }

    return contextString;
  }
}
