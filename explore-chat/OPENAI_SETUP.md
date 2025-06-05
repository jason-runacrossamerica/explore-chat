# 🤖 OpenAI Setup Guide

## Quick Setup

1. **Get your OpenAI API Key:**
   - Go to [OpenAI API Keys](https://platform.openai.com/api-keys)
   - Sign in or create an account
   - Click "Create new secret key"
   - Copy the key (starts with `sk-`)

2. **Add to your environment:**
   - Open `explore-chat/.env.local`
   - Replace `your_openai_api_key_here` with your actual key:
   ```
   OPENAI_API_KEY=sk-your-actual-key-here
   ```

3. **Restart the development server:**
   ```bash
   npm run dev
   ```

## 🎯 What You'll Get

Once configured, your fitness coach will:

- **Know your fitness data**: "Hey Sarah! I see you're 60% toward your 50-mile goal!"
- **Give personalized advice**: Based on your actual progress and challenges
- **Provide contextual motivation**: Tailored to your specific situation
- **Remember conversations**: Maintains context throughout your chat

## 👤 User Context Configuration

The chatbot can get user information in three ways (in order of priority):

### 1. URL Parameters (Highest Priority)
```
http://localhost:3000/chat?user_id=12345&project_id=67890
```

### 2. Environment Variables (Fallback)
```env
NEXT_PUBLIC_DEFAULT_USER_ID=your-default-user-id
NEXT_PUBLIC_DEFAULT_PROJECT_ID=your-default-project-id
```

### 3. Component Props (Manual Override)
```jsx
<FitnessCoachChatbot userId="12345" projectId="67890" />
```

**For Webflow Integration**: Use URL parameters to pass the current user's ID:
```javascript
// In your Webflow custom code
const userId = getCurrentUserId(); // Your function
const projectId = getCurrentProjectId(); // Your function
window.location.href = `/chat?user_id=${userId}&project_id=${projectId}`;
```

## 💰 Cost Information

- **Model**: GPT-4o-mini (very cost-effective)
- **Typical cost**: ~$0.01-0.05 per conversation
- **Free tier**: OpenAI provides $5 in free credits for new accounts

## 🔧 Configuration Options

You can customize the coach in `.env.local`:

```env
# Required
OPENAI_API_KEY=sk-your-key-here

# Optional customizations
OPENAI_MODEL=gpt-4o-mini
COACH_NAME=FitCoach
COACH_PERSONALITY=encouraging,knowledgeable,motivational
```

## 🚀 Testing

1. Open http://localhost:3000
2. Click the red fitness coach button
3. Try asking: "What's my current progress?"
4. The coach should respond with your actual fitness data!

## 🛠 Troubleshooting

**"OpenAI API key not configured"**
- Make sure your key is in `.env.local`
- Restart the dev server after adding the key

**"I'm having trouble connecting"**
- Check your internet connection
- Verify your OpenAI account has credits
- Check the browser console for detailed errors

## 🎨 Ready for Webflow

Once working locally, this chatbot can be:
- Embedded in any Webflow page
- Deployed to Cloudflare (as configured)
- Styled to match your exact brand colors and fonts
