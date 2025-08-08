import heroImage from "@/assets/hero-health.jpg";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface HeroProps {
  onGetStarted?: () => void;
}

const Hero = ({ onGetStarted }: HeroProps) => {
  return (
    <header className="relative overflow-hidden">
      <section className="gradient-hero">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                AI Diet Plan from Blood Reports
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-prose">
                Upload your blood report and get a personalized, evidence-based
                nutrition plan tailored to your biomarkers and dietary preferences
                like vegetarian, vegan, gluten-free, and sugar-free.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button variant="hero" size="lg" onClick={onGetStarted}>
                  Get started <ArrowRight className="ml-1" />
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <a href="#how-it-works">How it works</a>
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src={heroImage}
                alt="Abstract health and nutrition gradient artwork for diet planning"
                loading="lazy"
                className="w-full h-auto rounded-xl border shadow-sm"
              />
            </div>
          </div>
        </div>
      </section>
    </header>
  );
};

export default Hero;
