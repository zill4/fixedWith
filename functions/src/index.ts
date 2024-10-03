import * as functions from "firebase-functions";
import Anthropic from '@anthropic-ai/sdk';

const CLAUDE_API_KEY = functions.config().claude.key;

const anthropic = new Anthropic({
  apiKey: CLAUDE_API_KEY,
});

export const chatWithClaude = functions.https.onCall(async (data) => {
  try {
    const { message } = data;

    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1000,
      messages: [{ role: "user", content: message }],
    });

    // Extract text content from the response
    const textContent = response.content
      .filter(block => block.type === 'text')
      .map(block => (block as { type: 'text', text: string }).text)
      .join('\n');

    return { message: textContent };
  } catch (error) {
    console.error("Error calling Claude API:", error);
    throw new functions.https.HttpsError(
      "internal",
      "An error occurred while processing your request"
    );
  }
});