/**
 * src/components/GradCAMVisualization.tsx  (UPDATED — real images from backend)
 */

import { useState } from "react";
import { Eye, Layers } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { SegmentationResult } from "@/lib/api";

type ViewMode = "original" | "gradcam" | "overlay" | "seg_mask" | "seg_overlay";

interface Props {
  originalSrc:  string;
  heatmapSrc:   string;
  overlaySrc:   string;
  segMaskSrc:   string;
  segOverlaySrc:string;
  segmentation: SegmentationResult;
}

const VIEWS: { key: ViewMode; label: string }[] = [
  { key: "original",    label: "Original"     },
  { key: "gradcam",     label: "Grad-CAM"     },
  { key: "overlay",     label: "CAM Overlay"  },
  { key: "seg_mask",    label: "Seg Mask"     },
  { key: "seg_overlay", label: "Seg Overlay"  },
];

const GradCAMVisualization = ({
  originalSrc,
  heatmapSrc,
  overlaySrc,
  segMaskSrc,
  segOverlaySrc,
  segmentation,
}: Props) => {
  const [view, setView] = useState<ViewMode>("overlay");

  const srcMap: Record<ViewMode, string> = {
    original:    originalSrc,
    gradcam:     heatmapSrc,
    overlay:     overlaySrc,
    seg_mask:    segMaskSrc,
    seg_overlay: segOverlaySrc,
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-white to-emerald-500/5 border-emerald-500/20 shadow-lg">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg">
          <Eye className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="font-display font-semibold text-lg bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
            Visual Explanation
          </h2>
          <p className="text-sm text-muted-foreground">Grad-CAM & Segmentation</p>
        </div>
        {!segmentation.skipped && (
          <span className="ml-auto text-xs font-medium text-red-600 bg-red-50 border border-red-200 px-2 py-1 rounded-full">
            {segmentation.tumor_area_pct}% area
          </span>
        )}
      </div>

      {/* View toggle */}
      <div className="flex flex-wrap gap-1 mb-4">
        {VIEWS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setView(key)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              view === key
                ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Image display */}
      <div className="rounded-xl overflow-hidden border border-border/50 bg-black/5">
        {srcMap[view] ? (
          <img
            src={srcMap[view]}
            alt={view}
            className="w-full object-contain max-h-[280px]"
          />
        ) : (
          <div className="h-40 flex items-center justify-center text-muted-foreground text-sm">
            No image available
          </div>
        )}
      </div>

      {/* Segmentation stats */}
      {!segmentation.skipped && (
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          {[
            { label: "Tumor Pixels", value: segmentation.tumor_pixels.toLocaleString() },
            { label: "Total Pixels",  value: segmentation.total_pixels.toLocaleString()  },
            { label: "Coverage",      value: `${segmentation.tumor_area_pct}%`            },
          ].map((s) => (
            <div key={s.label} className="p-2 rounded-xl bg-muted/40">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="font-bold text-sm">{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {segmentation.skipped && (
        <div className="mt-4 flex items-center gap-2 text-xs text-green-700 bg-green-50 border border-green-200 rounded-xl p-3">
          <Layers className="w-4 h-4 shrink-0" />
          No tumor detected — segmentation skipped.
        </div>
      )}
    </Card>
  );
};

export default GradCAMVisualization;
