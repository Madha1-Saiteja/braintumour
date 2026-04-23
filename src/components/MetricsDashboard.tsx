/**
 * src/components/MetricsDashboard.tsx  (UPDATED — real data from backend)
 */

import { BarChart2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { ClassificationResult, SegmentationResult } from "@/lib/api";

interface Props {
  classification:  ClassificationResult;
  segmentation:    SegmentationResult;
  inferenceTimeMs: number;
}

const MetricsDashboard = ({ classification, segmentation, inferenceTimeMs }: Props) => {
  const topProb = classification.confidence;

  const metrics = [
    {
      label: "Prediction Confidence",
      value: `${(topProb * 100).toFixed(1)}%`,
      bar: topProb,
      color: topProb > 0.85 ? "bg-green-500" : topProb > 0.6 ? "bg-yellow-500" : "bg-red-400",
    },
    {
      label: "Tumor Coverage",
      value: segmentation.skipped ? "N/A" : `${segmentation.tumor_area_pct}%`,
      bar: segmentation.skipped ? 0 : segmentation.tumor_area_pct / 100,
      color: "bg-red-400",
    },
    {
      label: "Inference Speed",
      value: `${inferenceTimeMs} ms`,
      bar: Math.min(inferenceTimeMs / 5000, 1),        // normalize to 5 s ceiling
      color: inferenceTimeMs < 1000 ? "bg-green-500" : "bg-yellow-500",
    },
  ];

  return (
    <Card className="p-6 bg-gradient-to-br from-white to-violet-500/5 border-violet-500/20 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 flex items-center justify-center shadow-lg">
          <BarChart2 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="font-display font-semibold text-lg bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
            Analysis Metrics
          </h2>
          <p className="text-sm text-muted-foreground">Pipeline performance snapshot</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {metrics.map((m) => (
          <div key={m.label} className="p-4 rounded-2xl bg-muted/30 border border-border/50 space-y-2">
            <p className="text-xs text-muted-foreground">{m.label}</p>
            <p className="text-2xl font-bold text-foreground">{m.value}</p>
            <div className="h-1.5 rounded-full bg-muted">
              <div
                className={`h-full rounded-full transition-all duration-700 ${m.color}`}
                style={{ width: `${m.bar * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* All class probability table */}
      <div className="mt-6">
        <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide">Full Probability Distribution</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {Object.entries(classification.probabilities)
            .sort(([, a], [, b]) => b - a)
            .map(([cls, prob]) => (
              <div
                key={cls}
                className={`p-3 rounded-xl border text-center ${
                  cls === classification.class_name
                    ? "border-primary/40 bg-primary/5"
                    : "border-border/50 bg-muted/20"
                }`}
              >
                <p className="text-xs text-muted-foreground capitalize mb-1">{cls}</p>
                <p className="font-bold text-sm">{(prob * 100).toFixed(1)}%</p>
              </div>
            ))}
        </div>
      </div>
    </Card>
  );
};

export default MetricsDashboard;
