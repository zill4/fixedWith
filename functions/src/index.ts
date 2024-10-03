import * as functions from "firebase-functions";
import Anthropic from '@anthropic-ai/sdk';

const CLAUDE_API_KEY = functions.config().claude.key;

const anthropic = new Anthropic({
  apiKey: CLAUDE_API_KEY,
});

export const chatWithClaude = functions.https.onCall(async (data) => {
  try {
    const { messages } = data;

    // Ensure all messages have the required 'content' field and are not empty
    const validMessages = messages.filter(msg => msg.content && msg.content.trim() !== '');

    if (validMessages.length === 0) {
      throw new Error('No valid messages provided');
    }

    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1000,
      messages: validMessages,
    });

    // Extract text content from the response
    const textContent = response.content
      .filter(block => block.type === 'text')
      .map(block => (block as { type: 'text', text: string }).text)
      .join('\n');

    return { 
      textResponse: textContent,
      jsonResponse: {} // You may want to parse JSON from the response if needed
    };
  } catch (error) {
    console.error("Error calling Claude API:", error);
    throw new functions.https.HttpsError(
      "internal",
      "An error occurred while processing your request"
    );
  }
});