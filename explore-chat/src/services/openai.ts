import OpenAI from 'openai';
import { UserContext, UserContextService } from './userContext';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export class FitnessCoachAI {
  private openai: OpenAI;
  private model: string;

  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }

    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    this.model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
  }

  private getSystemPrompt(userContext?: string): string {
    const coachName = process.env.COACH_NAME || 'FitCoach';
    const personality = process.env.COACH_PERSONALITY || 'encouraging,knowledgeable,motivational';

    return `You are ${coachName}, an expert fitness coach and motivational companion. Your personality is ${personality}.

CORE PRINCIPLES:
- Be encouraging, positive, and motivational
- Provide specific, actionable fitness advice
- Use the user's real fitness data to give personalized responses
- Celebrate achievements and progress, no matter how small
- Help users overcome challenges and stay consistent
- Use emojis sparingly but effectively (💪, 🏃‍♀️, 🎯, 🔥)
- Keep responses conversational and friendly
- Focus on sustainable, healthy habits

RESPONSE STYLE:
- Keep responses concise but helpful (2-4 sentences usually)
- Address the user by name when you know it
- Reference their specific goals, progress, and challenges
- Provide practical next steps or suggestions
- Be enthusiastic but not overwhelming

${userContext ? `\nCURRENT USER DATA:\n${userContext}` : '\nNote: User fitness data is not available right now.'}

Remember: You're not just an AI, you're their personal fitness coach who cares about their success!`;
  }

  async generateResponse(
    userMessage: string,
    conversationHistory: ChatMessage[],
    userId?: string,
    projectId?: string
  ): Promise<string> {
    try {
      // Get user context if IDs are provided
      let userContext: UserContext | undefined;
      let contextString: string | undefined;

      if (userId && projectId) {
        userContext = await UserContextService.getUserContext(userId, projectId);
        contextString = UserContextService.formatUserContextForAI(userContext);
      }

      // Build messages array
      const messages: ChatMessage[] = [
        {
          role: 'system',
          content: this.getSystemPrompt(contextString)
        },
        ...conversationHistory.slice(-10), // Keep last 10 messages for context
        {
          role: 'user',
          content: userMessage
        }
      ];

      // Call OpenAI
      const completion = await this.openai.chat.completions.create({
        model: this.model,
        messages: messages,
        max_tokens: 300,
        temperature: 0.7,
        presence_penalty: 0.1,
        frequency_penalty: 0.1,
      });

      const response = completion.choices[0]?.message?.content;
      
      if (!response) {
        throw new Error('No response generated from OpenAI');
      }

      return response.trim();

    } catch (error) {
      console.error('Error generating AI response:', error);
      
      // Provide helpful fallback responses
      if (error instanceof Error && error.message.includes('API key')) {
        return "I'm having trouble connecting to my AI brain right now. Please check that your OpenAI API key is set up correctly! 🤖";
      }
      
      return "I'm having a temporary hiccup, but I'm still here to help! Try asking me about your fitness goals, workout tips, or motivation strategies. 💪";
    }
  }

  // Helper method to generate contextual greeting
  async generateGreeting(userId?: string, projectId?: string): Promise<string> {
    console.log(`[OpenAI] Generating greeting for userId: ${userId}, projectId: ${projectId}`);

    try {
      if (!userId || !projectId) {
        console.log('[OpenAI] No userId or projectId provided, using default greeting');
        return "Hey there! 💪 I'm your fitness coach. I'm here to help you crush your goals and stay motivated. How can I support you today?";
      }

      console.log('[OpenAI] Fetching user context...');
      const userContext = await UserContextService.getUserContext(userId, projectId);
      console.log('[OpenAI] User context received:', userContext);

      const contextString = UserContextService.formatUserContextForAI(userContext);
      console.log('[OpenAI] Formatted context string:', contextString);

      const messages: ChatMessage[] = [
        {
          role: 'system',
          content: this.getSystemPrompt(contextString)
        },
        {
          role: 'user',
          content: 'Generate a personalized greeting for me based on my current fitness data and progress.'
        }
      ];

      console.log('[OpenAI] Calling OpenAI API for greeting generation...');
      const completion = await this.openai.chat.completions.create({
        model: this.model,
        messages: messages,
        max_tokens: 150,
        temperature: 0.8,
      });

      const response = completion.choices[0]?.message?.content?.trim() ||
        "Hey there! 💪 I'm your fitness coach. Ready to crush some goals today?";

      console.log('[OpenAI] Generated greeting:', response);
      return response;

    } catch (error) {
      console.error('[OpenAI] Error generating greeting:', error);
      if (error instanceof Error) {
        console.error('[OpenAI] Error details:', error.message, error.stack);
      }
      return "Hey there! 💪 I'm your fitness coach. I'm here to help you crush your goals and stay motivated. How can I support you today?";
    }
  }

  // Helper method to suggest conversation starters
  getSuggestedQuestions(userContext?: UserContext): string[] {
    const baseQuestions = [
      "How can I stay motivated to exercise?",
      "What's a good workout routine for beginners?",
      "How do I track my progress effectively?",
      "Tips for building healthy habits?"
    ];

    if (!userContext?.profile || !userContext?.participant) {
      return baseQuestions;
    }

    const contextualQuestions = [];
    
    // Add goal-specific questions
    if (userContext.participant.project_goal_distance) {
      contextualQuestions.push(`How can I reach my ${userContext.participant.project_goal_distance} ${userContext.participant.project_goal_distance_units} goal?`);
    }

    // Add progress-specific questions
    if (userContext.seasonProgress !== null) {
      const progressPercent = userContext.participant.project_goal_distance 
        ? Math.round((userContext.seasonProgress / userContext.participant.project_goal_distance) * 100)
        : 0;
      
      if (progressPercent < 25) {
        contextualQuestions.push("How do I get started with my fitness journey?");
      } else if (progressPercent < 75) {
        contextualQuestions.push("How do I maintain momentum?");
      } else {
        contextualQuestions.push("How do I finish strong?");
      }
    }

    // Add challenge-specific questions
    if (userContext.challenges && userContext.challenges.length > 0) {
      contextualQuestions.push("Tell me about my current challenges");
    }

    return [...contextualQuestions, ...baseQuestions].slice(0, 4);
  }
}
