import { getFunctions, httpsCallable } from 'firebase/functions';

export interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

const SYSTEM_PROMPT = `You are an AI assistant for a car repair and modification service. For the initial request, provide a detailed response based on the given vehicle information and problem description. Your response should include:

1. Repair estimate (in both text and JSON format)
2. Step-by-step repair instructions (in both text and JSON format)
3. List of parts and tools needed (in both text and JSON format)

For follow-up questions, provide conversational responses while maintaining awareness of the context.

Ensure your JSON responses follow these structures:

repairEstimate: {
  expectedRepairTime: string,
  averageRepairPrice: number,
  toolsAndMaterials: string[],
  averageShopPrice: number,
  repairDifficulty: string,
  summary: string
}

repairInstructions: {
  steps: string[]
}

partsAndTools: {
  parts: string[],
  tools: string[]
}`;

export const sendToClaude = async (
  project: any,
  message: string,
  history: ClaudeMessage[]
): Promise<{ textResponse: string; jsonResponse: any } | null> => {
  try {
    const functions = getFunctions();
    const chatWithClaude = httpsCallable<{
      messages: ClaudeMessage[];
    }, { textResponse: string; jsonResponse: any }>(functions, 'chatWithClaude');

    let messages: ClaudeMessage[] = [];

    if (history.length === 0) {
      // This is the initial message
      const vehicleInfo = project.carProfile ? JSON.stringify(project.carProfile) : 'Not available';
      messages = [
        { 
          role: 'user', 
          content: `${SYSTEM_PROMPT}\n\nVehicle Info: ${vehicleInfo}\nProblem: ${project.problemDescription}\n\nUser message: ${message}` 
        }
      ];
    } else {
      messages = history.concat({ role: 'user', content: message });
    }

    const result = await chatWithClaude({ messages });

    return result.data;
  } catch (error) {
    console.error('Error sending message to Claude:', error);
    return null;
  }
};