import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { ollamaClient } from "@/lib/ollama";
import { extractTextFromFile } from "@/lib/fileProcessor";
import { DietaryPreferences } from "./PreferencesForm";
import { toast } from "@/hooks/use-toast";

interface DietPlanGeneratorProps {
  file: File | null;
  preferences: DietaryPreferences;
}

export function DietPlanGenerator({ file, preferences }: DietPlanGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [dietPlan, setDietPlan] = useState<string | null>(null);
  const [ollamaAvailable, setOllamaAvailable] = useState<boolean | null>(null);

  const checkOllamaStatus = async () => {
    const available = await ollamaClient.isAvailable();
    setOllamaAvailable(available);
    return available;
  };

  const generatePlan = async () => {
    if (!file) {
      toast({
        title: "No file uploaded",
        description: "Please upload a blood report first.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setDietPlan(null);

    try {
      // Check if Ollama is available
      const available = await checkOllamaStatus();
      if (!available) {
        throw new Error("Ollama server is not available. Please make sure it's running on http://localhost:11434");
      }

      // Extract text from the uploaded file
      const fileContent = await extractTextFromFile(file);
      
      // Extract blood report data using Ollama
      const bloodReportData = await ollamaClient.extractBloodReportData(fileContent);
      
      // Generate diet plan
      const plan = await ollamaClient.generateDietPlan(bloodReportData, preferences);
      
      setDietPlan(plan);
      toast({
        title: "Diet plan generated!",
        description: "Your personalized diet plan is ready.",
      });
    } catch (error) {
      console.error("Error generating diet plan:", error);
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Failed to generate diet plan",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Diet Plan Generator</CardTitle>
          <CardDescription>
            Generate a personalized diet plan based on your blood report and preferences using Ollama AI.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {ollamaAvailable === false && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Ollama server is not available. Please make sure Ollama is running on http://localhost:11434
                <br />
                <a 
                  href="https://ollama.ai" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Download and install Ollama
                </a>
              </AlertDescription>
            </Alert>
          )}

          {ollamaAvailable === true && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Ollama server is connected and ready to generate your diet plan.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2">
            <Button 
              onClick={checkOllamaStatus} 
              variant="outline"
              disabled={isGenerating}
            >
              Check Ollama Status
            </Button>
            <Button 
              onClick={generatePlan} 
              disabled={!file || isGenerating || ollamaAvailable === false}
              className="flex-1"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Plan...
                </>
              ) : (
                "Generate Diet Plan"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {dietPlan && (
        <Card>
          <CardHeader>
            <CardTitle>Your Personalized Diet Plan</CardTitle>
            <CardDescription>
              Generated based on your blood report and dietary preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                {dietPlan}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
