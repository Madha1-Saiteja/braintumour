import { CheckCircle2, AlertTriangle, TrendingUp, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ClassificationResultProps {
  result: {
    prediction: string;
    confidence: number;
    probabilities: { label: string; value: number }[];
  } | null;
}

const tumorGradients: Record<string, string> = {
  "Glioma": "from-red-500 to-orange-500",
  "Meningioma": "from-purple-500 to-pink-500",
  "Pituitary": "from-cyan-500 to-blue-500",
  "No Tumor": "from-green-500 to-emerald-500",
};

const tumorBgColors: Record<string, string> = {
  "Glioma": "bg-gradient-to-r from-red-500/10 to-orange-500/10 border-red-500/30",
  "Meningioma": "bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30",
  "Pituitary": "bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-cyan-500/30",
  "No Tumor": "bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30",
};

const ClassificationResult = ({ result }: ClassificationResultProps) => {
  if (!result) {
    return (
      <Card className="p-6 bg-gradient-to-br from-white to-accent/5 border-accent/20 shadow-lg h-full flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <div className="w-16 h-16 rounded-2xl gradient-cyan-purple mx-auto mb-4 flex items-center justify-center opacity-30">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <p className="text-sm">Upload and analyze an MRI to see classification results</p>
        </div>
      </Card>
    );
  }

  const isNoTumor = result.prediction === "No Tumor";

  return (
    <Card className="p-6 bg-gradient-to-br from-white to-primary/5 border-primary/20 shadow-lg shadow-primary/10 animate-fade-in overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-accent/10 to-transparent rounded-tr-full" />
      
      <div className="flex items-center gap-3 mb-6 relative">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${isNoTumor ? "bg-gradient-to-r from-green-500 to-emerald-500" : "bg-gradient-to-r from-orange-500 to-red-500"}`}>
          {isNoTumor ? (
            <CheckCircle2 className="w-6 h-6 text-white" />
          ) : (
            <AlertTriangle className="w-6 h-6 text-white" />
          )}
        </div>
        <div>
          <h2 className="font-display font-semibold text-lg text-gradient">Classification Result</h2>
          <p className="text-sm text-muted-foreground">CNN Model Prediction</p>
        </div>
        <Sparkles className="w-5 h-5 text-accent absolute top-0 right-0 animate-pulse" />
      </div>

      {/* Main Prediction */}
      <div className={`p-5 rounded-2xl border-2 mb-6 ${tumorBgColors[result.prediction] || "bg-muted"} relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="flex items-center justify-between relative">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Detected</p>
            <p className={`text-2xl font-display font-bold bg-gradient-to-r ${tumorGradients[result.prediction]} bg-clip-text text-transparent`}>{result.prediction}</p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Confidence</p>
            <p className="text-3xl font-display font-bold text-gradient">{result.confidence}%</p>
          </div>
        </div>
      </div>

      {/* Probability Distribution */}
      <div className="relative">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full gradient-primary" />
          Probability Distribution
        </h3>
        <div className="space-y-3">
          {result.probabilities.map((prob) => (
            <div key={prob.label}>
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span className="text-muted-foreground font-medium">{prob.label}</span>
                <span className="font-bold text-foreground">{prob.value.toFixed(1)}%</span>
              </div>
              <div className="relative h-3 bg-muted/50 rounded-full overflow-hidden">
                <div
                  className={`absolute inset-y-0 left-0 rounded-full transition-all duration-1000 bg-gradient-to-r ${tumorGradients[prob.label] || "from-primary to-accent"}`}
                  style={{ width: `${prob.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default ClassificationResult;
