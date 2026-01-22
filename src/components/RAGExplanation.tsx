import { Bot, BookOpen, Sparkles, Quote, ExternalLink, Brain } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import doctorGestureImage from "@/assets/doctor-gesture.jpg";

interface RAGExplanationProps {
  explanation: {
    summary: string;
    medicalContext: string;
    sources: { title: string; type: string }[];
    keyFindings: string[];
  } | null;
  tumorType: string | null;
}

const RAGExplanation = ({ explanation, tumorType }: RAGExplanationProps) => {
  if (!explanation) {
    return (
      <Card className="p-6 bg-gradient-to-br from-white to-primary/5 border-primary/20 shadow-lg h-full flex items-center justify-center relative overflow-hidden">
        {/* Background hint */}
        <div className="absolute inset-0 opacity-5">
          <img src={doctorGestureImage} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="text-center text-muted-foreground relative">
          <div className="w-16 h-16 rounded-2xl gradient-primary mx-auto mb-4 flex items-center justify-center opacity-40">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <p className="text-sm">AI-generated explanation will appear here</p>
          <p className="text-xs mt-1 opacity-70">Powered by RAG + LLM</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-8 bg-gradient-to-br from-white via-primary/5 to-accent/5 border-primary/20 shadow-xl shadow-primary/10 animate-slide-in-right overflow-hidden relative">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-accent/10 to-transparent rounded-bl-full" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-primary/10 to-transparent rounded-tr-full" />
      
      <div className="flex items-center gap-4 mb-8 relative">
        <div className="relative">
          <div className="w-14 h-14 rounded-2xl gradient-hero flex items-center justify-center shadow-glow">
            <Bot className="w-7 h-7 text-white" />
          </div>
          <Sparkles className="w-5 h-5 text-accent absolute -top-2 -right-2 animate-bounce" />
        </div>
        <div>
          <h2 className="font-display font-bold text-xl text-gradient-rainbow">AI Medical Explanation</h2>
          <p className="text-sm text-muted-foreground">RAG-Enhanced Analysis</p>
        </div>
      </div>

      {/* Summary */}
      <div className="relative p-6 rounded-2xl bg-gradient-to-br from-primary/10 via-white to-accent/10 border border-primary/20 mb-8 shadow-inner">
        <Quote className="absolute top-4 left-4 w-6 h-6 text-primary/30" />
        <p className="text-base text-foreground leading-relaxed pl-8">{explanation.summary}</p>
      </div>

      {/* Key Findings */}
      <div className="mb-8">
        <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full gradient-primary" />
          Key Findings
        </h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {explanation.keyFindings.map((finding, i) => (
            <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-accent/10 to-transparent border border-accent/20">
              <div className="w-6 h-6 rounded-full gradient-cyan-purple flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {i + 1}
              </div>
              <span className="text-sm text-foreground">{finding}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Medical Context */}
      <div className="mb-8">
        <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          Medical Context
        </h3>
        <div className="p-5 rounded-xl bg-white/80 border border-border/50 shadow-sm">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {explanation.medicalContext}
          </p>
        </div>
      </div>

      {/* Sources */}
      <div className="mb-6">
        <h3 className="text-base font-semibold text-foreground mb-4">Retrieved Sources</h3>
        <div className="space-y-3">
          {explanation.sources.map((source, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-muted/50 to-white border border-border/50 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <Badge className="bg-gradient-to-r from-primary to-accent text-white border-0 text-xs">
                  {source.type}
                </Badge>
                <span className="text-sm font-medium text-foreground">{source.title}</span>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-warning/10 to-orange-500/10 border border-warning/30">
        <p className="text-xs text-muted-foreground">
          <span className="font-bold text-warning">⚠️ Disclaimer:</span> This AI-generated explanation is for informational purposes only and should not replace professional medical diagnosis. Always consult with a qualified healthcare provider.
        </p>
      </div>
    </Card>
  );
};

export default RAGExplanation;
