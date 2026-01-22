import { Brain, Cpu, Database, Zap, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import aiBrainImage from "@/assets/ai-brain.jpg";

interface AnalysisPanelProps {
  isAnalyzing: boolean;
  analysisSteps: { name: string; status: "pending" | "processing" | "complete" }[];
  modelInfo: {
    name: string;
    architecture: string;
    parameters: string;
    inputSize: string;
  };
}

const AnalysisPanel = ({ isAnalyzing, analysisSteps, modelInfo }: AnalysisPanelProps) => {
  return (
    <div className="space-y-6">
      {/* Model Information */}
      <Card className="p-6 bg-gradient-to-br from-white to-purple-500/5 border-purple-500/20 shadow-lg shadow-purple-500/10 overflow-hidden relative">
        {/* Background image */}
        <div className="absolute inset-0 opacity-5">
          <img src={aiBrainImage} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-500/10 to-transparent rounded-bl-full" />
        
        <div className="flex items-center gap-3 mb-6 relative">
          <div className="w-12 h-12 rounded-xl gradient-purple-pink flex items-center justify-center shadow-lg">
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-display font-semibold text-lg bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">Model Information</h2>
            <p className="text-sm text-muted-foreground">CNN Architecture Details</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 relative">
          {[
            { label: "Model", value: modelInfo.name, gradient: "from-purple-500/10 to-pink-500/10" },
            { label: "Architecture", value: modelInfo.architecture, gradient: "from-pink-500/10 to-red-500/10" },
            { label: "Parameters", value: modelInfo.parameters, gradient: "from-cyan-500/10 to-blue-500/10" },
            { label: "Input Size", value: modelInfo.inputSize, gradient: "from-green-500/10 to-cyan-500/10" },
          ].map((item, i) => (
            <div key={i} className={`p-4 rounded-xl bg-gradient-to-r ${item.gradient} border border-white/50`}>
              <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
              <p className="font-bold text-foreground">{item.value}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Processing Pipeline */}
      <Card className="p-6 bg-gradient-to-br from-white to-cyan-500/5 border-cyan-500/20 shadow-lg shadow-cyan-500/10 overflow-hidden relative">
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-cyan-500/10 to-transparent rounded-tr-full" />
        
        <div className="flex items-center gap-3 mb-6 relative">
          <div className="w-12 h-12 rounded-xl gradient-cyan-purple flex items-center justify-center shadow-lg">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-display font-semibold text-lg bg-gradient-to-r from-cyan-500 to-primary bg-clip-text text-transparent">Processing Pipeline</h2>
            <p className="text-sm text-muted-foreground">Analysis workflow stages</p>
          </div>
          <Sparkles className="w-5 h-5 text-cyan-500 absolute top-0 right-0 animate-pulse" />
        </div>

        <div className="space-y-3 relative">
          {analysisSteps.map((step, i) => (
            <div
              key={i}
              className={`
                flex items-center gap-3 p-4 rounded-xl border transition-all duration-300
                ${step.status === "complete" 
                  ? "bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30" 
                  : step.status === "processing"
                    ? "bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30 animate-pulse"
                    : "bg-muted/30 border-border/50"
                }
              `}
            >
              <div className={`
                w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold
                ${step.status === "complete"
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30"
                  : step.status === "processing"
                    ? "gradient-primary text-white shadow-lg shadow-primary/30"
                    : "bg-muted text-muted-foreground"
                }
              `}>
                {i + 1}
              </div>
              <span className={`flex-1 text-sm font-medium ${
                step.status === "pending" ? "text-muted-foreground" : "text-foreground"
              }`}>
                {step.name}
              </span>
              <Badge
                className={`text-xs border-0 ${
                  step.status === "complete" 
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white" 
                    : step.status === "processing"
                      ? "gradient-primary text-white"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {step.status === "complete" ? "✓ Done" : step.status === "processing" ? "Running..." : "Waiting"}
              </Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* RAG System */}
      <Card className="p-6 bg-gradient-to-br from-white to-primary/5 border-primary/20 shadow-lg shadow-primary/10 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full" />
        
        <div className="flex items-center gap-3 mb-5 relative">
          <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center shadow-glow">
            <Database className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-display font-semibold text-lg text-gradient">RAG Knowledge Base</h2>
            <p className="text-sm text-muted-foreground">Medical literature retrieval</p>
          </div>
        </div>

        <div className="space-y-3 text-sm relative">
          {[
            { label: "Documents Indexed", value: "2,847", color: "text-purple-600" },
            { label: "Vector Embeddings", value: "1.2M", color: "text-cyan-600" },
            { label: "LLM Model", value: "GPT-4 Turbo", color: "text-green-600" },
            { label: "Vector DB", value: "ChromaDB", color: "text-pink-600" },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/80 border border-border/50">
              <span className="text-muted-foreground">{item.label}</span>
              <span className={`font-bold ${item.color}`}>{item.value}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default AnalysisPanel;
