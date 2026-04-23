/**
 * src/components/RAGExplanation.tsx  (UPDATED — renders real clinical_report from backend)
 *
 * The backend's generate_clinical_report() returns a dict.
 * We render every key-value pair generically so the component
 * works regardless of the exact fields in clinical_knowledge.py.
 */

import { BookOpen, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Props {
  clinicalReport: Record<string, unknown>;
  className: string;
}

const RAGExplanation = ({ clinicalReport, className }: Props) => {
  const entries = Object.entries(clinicalReport);

  return (
    <Card className="p-6 bg-gradient-to-br from-white to-primary/5 border-primary/20 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center shadow-glow">
          <BookOpen className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="font-display font-semibold text-lg text-gradient">Clinical Report</h2>
          <p className="text-sm text-muted-foreground capitalize">
            AI-generated report for <strong>{className}</strong>
          </p>
        </div>
      </div>

      {entries.length === 0 ? (
        <p className="text-sm text-muted-foreground">No clinical report data returned.</p>
      ) : (
        <div className="space-y-4">
          {entries.map(([key, value]) => {
            const title = key
              .replace(/_/g, " ")
              .replace(/\b\w/g, (c) => c.toUpperCase());

            return (
              <div
                key={key}
                className="p-4 rounded-xl bg-muted/30 border border-border/50"
              >
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-primary/60" />
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    {title}
                  </p>
                </div>

                {/* Render value depending on type */}
                {typeof value === "string" || typeof value === "number" ? (
                  <p className="text-sm text-foreground leading-relaxed">{String(value)}</p>
                ) : Array.isArray(value) ? (
                  <ul className="list-disc list-inside space-y-1">
                    {value.map((item, i) => (
                      <li key={i} className="text-sm text-foreground">
                        {typeof item === "object" ? JSON.stringify(item) : String(item)}
                      </li>
                    ))}
                  </ul>
                ) : typeof value === "object" && value !== null ? (
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    {Object.entries(value as Record<string, unknown>).map(([k, v]) => (
                      <div key={k} className="flex justify-between text-xs p-2 rounded-lg bg-white/60 border border-border/30">
                        <span className="text-muted-foreground capitalize">{k.replace(/_/g, " ")}</span>
                        <span className="font-medium">{String(v)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-foreground">{String(value)}</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};

export default RAGExplanation;
