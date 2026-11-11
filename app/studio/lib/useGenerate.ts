// app/studio/lib/useGenerate.ts
import { useState } from 'react';

interface GenerateOptions {
  onSuccess?: (result: string, newUsageCount: number, historyItem?: any) => void;
  onError?: (error: string) => void;
}

export function useGenerate() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);

  const generate = async (
    modeId: string, 
    formData: Record<string, string>, 
    userId: string | undefined,
    options?: GenerateOptions
  ) => {
    setIsGenerating(true);
    setGenError(null);

    const maxRetries = 3;
    let attempt = 0;
    let success = false;

    while (attempt < maxRetries && !success) {
      try {
        attempt++;
        
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ modeId, formData, userId }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to generate content');
        }

        if (!data.result) {
          throw new Error('AI returned an empty response');
        }

        success = true;
        if (options?.onSuccess) {
          options.onSuccess(data.result, data.newUsageCount, data.historyItem);
        }
        
      } catch (err: any) {
        console.error(`Generation attempt ${attempt} failed:`, err);
        
        if (attempt >= maxRetries) {
          const errorMessage = err.message || 'AI service is currently overloaded. Please try again.';
          setGenError(errorMessage);
          if (options?.onError) {
            options.onError(errorMessage);
          }
        } else {
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
      }
    }

    setIsGenerating(false);
  };

  return { generate, isGenerating, genError, setGenError };
}