import { useState } from "react";
import Hero from "@/components/Hero";
import UploadDropzone from "@/components/UploadDropzone";
import PreferencesForm, { DietaryPreferences } from "@/components/PreferencesForm";
import ResultsPanel from "@/components/ResultsPanel";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const defaultPrefs: DietaryPreferences = {
  vegetarian: false,
  vegan: false,
  nonVegetarian: true,
  glutenFree: false,
  sugarFree: false,
  dairyFree: false,
  nutFree: false,
};

const Index = () => {
  const [file, setFile] = useState<File | null>(null);
  const [prefs, setPrefs] = useState<DietaryPreferences>(defaultPrefs);

  const handleGenerate = () => {
    toast({
      title: "Connect Supabase to enable AI recommendations",
      description:
        "Click the green Supabase button in the top-right to connect. Then I'll add auth, storage, and LLM provider support.",
    });
  };

  return (
    <main>
      <Hero onGetStarted={() => {
        const el = document.getElementById("uploader");
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
      }} />

      <section id="uploader" className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-6">
            <UploadDropzone onFileSelected={setFile} />
            <PreferencesForm value={prefs} onChange={setPrefs} />
            <div className="flex justify-end">
              <Button variant="hero" size="lg" onClick={handleGenerate}>
                Generate my plan
              </Button>
            </div>
          </div>
          <ResultsPanel hasInput={!!file} />
        </div>
      </section>

      {/* Structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Diet Guide Bot",
          url: "https://ba705ede-d506-43c4-9bbd-23d2cf04199c.lovableproject.com/",
          description: "Upload your blood report to get a personalized AI-powered diet plan.",
          potentialAction: {
            "@type": "SearchAction",
            target: "https://ba705ede-d506-43c4-9bbd-23d2cf04199c.lovableproject.com/?q={query}",
            query: "required",
          },
        }),
      }} />
    </main>
  );
};

export default Index;
