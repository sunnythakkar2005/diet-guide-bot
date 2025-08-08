import { useState } from "react";
import Hero from "@/components/Hero";
import UploadDropzone from "@/components/UploadDropzone";
import PreferencesForm, { DietaryPreferences } from "@/components/PreferencesForm";
import { DietPlanGenerator } from "@/components/DietPlanGenerator";
import { AuthButton } from "@/components/AuthButton";
import { validateBloodReportFile } from "@/lib/fileProcessor";
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

  const handleFileSelected = (selectedFile: File) => {
    const validation = validateBloodReportFile(selectedFile);
    if (!validation.valid) {
      toast({
        title: "Invalid file",
        description: validation.error,
        variant: "destructive",
      });
      return;
    }
    setFile(selectedFile);
    toast({
      title: "File uploaded",
      description: `${selectedFile.name} has been uploaded successfully.`,
    });
  };

  return (
    <main>
      <Hero onGetStarted={() => {
        const el = document.getElementById("uploader");
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
      }} />

      <section className="container mx-auto px-4 pt-4">
        <div className="flex justify-end">
          <AuthButton />
        </div>
      </section>

      <section id="uploader" className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-6">
            <UploadDropzone onFileSelected={handleFileSelected} />
            <PreferencesForm value={prefs} onChange={setPrefs} />
          </div>
          <div>
            <DietPlanGenerator file={file} preferences={prefs} />
          </div>
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
