import { NextRequest, NextResponse } from 'next/server';
import { FitnessCoachAI, ChatMessage } from '@/services/openai';

interface ChatRequestBody {
  message?: string;
  conversationHistory?: ChatMessage[];
  userId?: string;
  projectId?: string;
  type?: 'message' | 'greeting';
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequestBody = await request.json();
    const {
      message,
      conversationHistory = [],
      userId,
      projectId,
      type = 'message' // 'message' or 'greeting'
    } = body;

    console.log(`[Chat API] Request received - type: ${type}, userId: ${userId}, projectId: ${projectId}`);
    if (type === 'message') {
      console.log(`[Chat API] Message: ${message}`);
    }

    // Validate required fields for regular messages
    if (type === 'message' && !message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          error: 'OpenAI API key not configured',
          fallbackResponse: "I'm not fully set up yet! Please add your OpenAI API key to the .env.local file to enable intelligent responses. 🤖"
        },
        { status: 500 }
      );
    }

    // Initialize the AI coach
    const coach = new FitnessCoachAI();

    let response: string;

    if (type === 'greeting') {
      // Generate a personalized greeting
      response = await coach.generateGreeting(userId, projectId);
    } else {
      // Validate message for regular chat
      if (!message) {
        return NextResponse.json(
          { error: 'Message is required for chat' },
          { status: 400 }
        );
      }

      // Generate a response to the user's message
      response = await coach.generateResponse(
        message,
        conversationHistory,
        userId,
        projectId
      );
    }

    return NextResponse.json({
      response,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chat API error:', error);

    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('OPENAI_API_KEY')) {
        return NextResponse.json(
          { 
            error: 'OpenAI API key not configured',
            fallbackResponse: "I'm not fully set up yet! Please add your OpenAI API key to the .env.local file to enable intelligent responses. 🤖"
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { 
        error: 'Internal server error',
        fallbackResponse: "I'm having a temporary hiccup, but I'm still here to help! Try asking me about your fitness goals, workout tips, or motivation strategies. 💪"
      },
      { status: 500 }
    );
  }
}

// Handle GET requests for health check
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'Fitness Coach Chat API',
    timestamp: new Date().toISOString()
  });
}
