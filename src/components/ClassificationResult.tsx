/**
 * src/components/ClassificationResult.tsx  (UPDATED — uses real API data)
 */

import { BadgeCheck, TrendingUp, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ClassificationResult as ClassificationResultType } from "@/lib/api";

const CLASS_META: Record<string, { label: string; color: string; bg: string }> = {
  glioma:      { label: "Glioma",      color: "text-red-600",    bg: "bg-red-50 border-red-200"    },
  meningioma:  { label: "Meningioma",  color: "text-orange-600", bg: "bg-orange-50 border-orange-200" },
  pituitary:   { label: "Pituitary",   color: "text-yellow-600", bg: "bg-yellow-50 border-yellow-200" },
  notumor:     { label: "No Tumor",    color: "text-green-600",  bg: "bg-green-50 border-green-200" },
};

interface Props {
  classification: ClassificationResultType;
  inferenceTimeMs: number;
}

const ClassificationResult = ({ classification, inferenceTimeMs }: Props) => {
  const meta = CLASS_META[classification.class_name] ?? {
    label: classification.class_name,
    color: "text-primary",
    bg: "bg-primary/5 border-primary/20",
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-white to-blue-500/5 border-blue-500/20 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
          <BadgeCheck className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="font-display font-semibold text-lg text-gradient">Classification Result</h2>
          <p className="text-sm text-muted-foreground">EfficientNet-B0 Prediction</p>
        </div>
        <span className="ml-auto text-xs text-muted-foreground">{inferenceTimeMs} ms</span>
      </div>

      {/* Primary result */}
      <div className={`rounded-2xl border p-5 mb-5 ${meta.bg}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Detected Condition</p>
            <p className={`text-2xl font-bold ${meta.color}`}>{meta.label}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground mb-1">Confidence</p>
            <p className={`text-2xl font-bold ${meta.color}`}>
              {(classification.confidence * 100).toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Confidence bar */}
        <div className="mt-3 h-2 rounded-full bg-white/60">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              classification.has_tumor ? "bg-red-400" : "bg-green-400"
            }`}
            style={{ width: `${classification.confidence * 100}%` }}
          />
        </div>
      </div>

      {/* All class probabilities */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-muted-foreground" />
          <p className="text-sm font-medium text-muted-foreground">All Class Probabilities</p>
        </div>
        {Object.entries(classification.probabilities)
          .sort(([, a], [, b]) => b - a)
          .map(([cls, prob]) => {
            const m = CLASS_META[cls];
            return (
              <div key={cls} className="flex items-center gap-3">
                <span className="w-28 text-xs text-muted-foreground capitalize">{m?.label ?? cls}</span>
                <div className="flex-1 h-2 rounded-full bg-muted/50">
                  <div
                    className={`h-full rounded-full ${m?.color.replace("text-", "bg-") ?? "bg-primary"} opacity-70`}
                    style={{ width: `${prob * 100}%` }}
                  />
                </div>
                <span className="w-12 text-xs text-right font-medium">{(prob * 100).toFixed(1)}%</span>
              </div>
            );
          })}
      </div>

      {classification.has_tumor && (
        <div className="mt-4 flex items-center gap-2 text-xs text-orange-600 bg-orange-50 border border-orange-200 rounded-xl p-3">
          <AlertCircle className="w-4 h-4 shrink-0" />
          Tumor detected — segmentation and clinical report generated below.
        </div>
      )}
    </Card>
  );
};

export default ClassificationResult;
