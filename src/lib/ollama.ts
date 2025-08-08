interface OllamaResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  context?: number[];
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  prompt_eval_duration?: number;
  eval_count?: number;
  eval_duration?: number;
}

interface OllamaRequest {
  model: string;
  prompt: string;
  stream?: boolean;
  options?: {
    temperature?: number;
    top_p?: number;
    max_tokens?: number;
  };
}

class OllamaClient {
  private baseUrl: string;
  private defaultModel: string;

  constructor() {
    this.baseUrl = 'http://ollama:11434';
    this.defaultModel = import.meta.env.VITE_OLLAMA_MODEL || 'llama3.2:3b';
  }

  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.ok;
    } catch (error) {
      console.warn('Ollama server not available:', error);
      return false;
    }
  }

  async generateDietPlan(
    bloodReportData: string,
    dietaryPreferences: Record<string, boolean>,
    options?: { temperature?: number }
  ): Promise<string> {
    const preferences = Object.entries(dietaryPreferences)
      .filter(([_, value]) => value)
      .map(([key, _]) => key)
      .join(', ');

    const prompt = `You are a professional nutritionist and dietitian. Based on the following blood report data and dietary preferences, create a comprehensive, personalized diet plan.

Blood Report Data:
${bloodReportData}

Dietary Preferences: ${preferences || 'No specific restrictions'}

Please provide:
1. A summary of key health indicators from the blood report
2. Specific nutritional recommendations based on the results
3. A detailed 7-day meal plan with breakfast, lunch, dinner, and snacks
4. Foods to emphasize and foods to avoid
5. Hydration and supplement recommendations
6. Lifestyle tips for optimal health

Format the response in clear sections with practical, actionable advice. Keep recommendations evidence-based and safe.`;

    const request: OllamaRequest = {
      model: this.defaultModel,
      prompt,
      stream: false,
      options: {
        temperature: options?.temperature || 0.7,
        top_p: 0.9,
        max_tokens: 2000,
      },
    };

    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
      }

      const data: OllamaResponse = await response.json();
      return data.response;
    } catch (error) {
      console.error('Error generating diet plan:', error);
      throw new Error('Failed to generate diet plan. Please check your Ollama server connection.');
    }
  }

  async extractBloodReportData(fileContent: string): Promise<string> {
    const prompt = `You are a medical data extraction specialist. Extract and summarize the key health indicators from this blood report data. Focus on:

1. Complete Blood Count (CBC) values
2. Lipid profile (cholesterol, triglycerides)
3. Blood glucose levels
4. Liver function tests
5. Kidney function markers
6. Vitamin and mineral levels
7. Thyroid function (if present)
8. Any abnormal values or flags

Blood Report Content:
${fileContent}

Provide a structured summary of the key findings, noting any values that are outside normal ranges. If the data is unclear or incomplete, indicate what information is missing.`;

    const request: OllamaRequest = {
      model: this.defaultModel,
      prompt,
      stream: false,
      options: {
        temperature: 0.3, // Lower temperature for more factual extraction
        top_p: 0.8,
      },
    };

    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
      }

      const data: OllamaResponse = await response.json();
      return data.response;
    } catch (error) {
      console.error('Error extracting blood report data:', error);
      throw new Error('Failed to extract blood report data. Please check your Ollama server connection.');
    }
  }
}

export const ollamaClient = new OllamaClient();
