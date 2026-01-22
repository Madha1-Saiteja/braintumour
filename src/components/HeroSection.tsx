import { Brain, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBrainImage from "@/assets/hero-brain.jpg";
import aiBrainImage from "@/assets/ai-brain.jpg";

interface HeroSectionProps {
  onGetStarted: () => void;
}

const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  return (
    <div className="relative overflow-hidden rounded-3xl mb-8 gradient-hero p-1">
      <div className="relative bg-background/95 backdrop-blur-sm rounded-[1.4rem] overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-primary/20 to-accent/20 blur-3xl" />
          <div className="absolute -bottom-1/2 -left-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-accent/20 to-primary/20 blur-3xl" />
        </div>

        <div className="relative grid lg:grid-cols-2 gap-8 p-8 lg:p-12">
          {/* Left Content */}
          <div className="flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 w-fit mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered Medical Imaging</span>
            </div>

            <h1 className="text-4xl lg:text-5xl font-display font-bold mb-4">
              <span className="text-gradient-rainbow">Brain Tumor</span>
              <br />
              <span className="text-foreground">Classification</span>
            </h1>

            <p className="text-lg text-muted-foreground mb-8 max-w-md">
              Harness the power of CNN, Grad-CAM, and RAG for explainable brain tumor detection with medical-grade accuracy.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button
                onClick={onGetStarted}
                size="lg"
                className="gradient-primary hover:opacity-90 shadow-glow text-lg px-8"
              >
                <Brain className="w-5 h-5 mr-2" />
                Analyze MRI
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <span>96.9% Accuracy</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span>Real-time Analysis</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Images */}
          <div className="relative flex items-center justify-center">
            <div className="relative">
              {/* Main image */}
              <div className="relative w-72 h-72 lg:w-80 lg:h-80 rounded-3xl overflow-hidden shadow-xl shadow-primary/20 border-4 border-white/50 animate-float">
                <img
                  src={heroBrainImage}
                  alt="Brain Scan Visualization"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
              </div>

              {/* Secondary image */}
              <div className="absolute -bottom-8 -left-8 w-36 h-36 lg:w-44 lg:h-44 rounded-2xl overflow-hidden shadow-lg shadow-accent/20 border-4 border-white/50 animate-pulse-glow">
                <img
                  src={aiBrainImage}
                  alt="AI Neural Network"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating badge */}
              <div className="absolute -top-4 -right-4 px-4 py-2 rounded-full bg-white shadow-lg flex items-center gap-2">
                <div className="w-3 h-3 rounded-full gradient-primary" />
                <span className="text-sm font-semibold text-foreground">CNN + RAG</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
