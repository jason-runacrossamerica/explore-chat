import { NextRequest, NextResponse } from 'next/server';
import { FitnessCoachAI } from '@/services/openai';
import { UserContextService } from '@/services/userContext';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const projectId = searchParams.get('projectId');

    const coach = new FitnessCoachAI();
    
    let suggestions: string[];

    if (userId && projectId) {
      // Get user context for personalized suggestions
      const userContext = await UserContextService.getUserContext(userId, projectId);
      suggestions = coach.getSuggestedQuestions(userContext);
    } else {
      // Get generic suggestions
      suggestions = coach.getSuggestedQuestions();
    }

    return NextResponse.json({
      suggestions,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Suggestions API error:', error);
    
    // Return fallback suggestions
    const fallbackSuggestions = [
      "How can I stay motivated to exercise?",
      "What's a good workout routine for beginners?",
      "How do I track my progress effectively?",
      "Tips for building healthy habits?"
    ];

    return NextResponse.json({
      suggestions: fallbackSuggestions,
      timestamp: new Date().toISOString()
    });
  }
}
