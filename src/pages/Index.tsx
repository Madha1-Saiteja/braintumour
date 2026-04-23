/**
 * src/pages/Index.tsx  (UPDATED — full backend integration)
 *
 * This is the central orchestrator.  It owns:
 *  - the uploaded File + preview URL
 *  - the analysisSteps pipeline state
 *  - the API call via analyzeImage()
 *  - passing results down to every display component
 */

import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

import Header             from "@/components/Header";
import HeroSection        from "@/components/HeroSection";
import ImageUploader      from "@/components/ImageUploader";
import AnalysisPanel      from "@/components/AnalysisPanel";
import ClassificationResult   from "@/components/ClassificationResult";
import GradCAMVisualization   from "@/components/GradCAMVisualization";
import MetricsDashboard       from "@/components/MetricsDashboard";
import RAGExplanation         from "@/components/RAGExplanation";

import {
  analyzeImage,
  checkHealth,
  base64ToImageSrc,
  type AnalysisResponse,
  type HealthStatus,
} from "@/lib/api";

// ── Static model info (matches backend architecture) ─────────────────────────
const MODEL_INFO = {
  name:         "EfficientNet-B0",
  architecture: "CNN + SwinUNETR",
  parameters:   "~5.3M",
  inputSize:    "224 × 224",
};

const PIPELINE_STEPS = [
  "Image Preprocessing",
  "Tumor Classification",
  "Grad-CAM Generation",
  "Tumor Segmentation",
  "Clinical Report",
];

type StepStatus = "pending" | "processing" | "complete";

function buildSteps(statuses: StepStatus[]) {
  return PIPELINE_STEPS.map((name, i) => ({
    name,
    status: statuses[i] ?? "pending",
  }));
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function Index() {
  const { toast } = useToast();

  // ── State ──────────────────────────────────────────────────────────────────
  const [uploadedImage, setUploadedImage]   = useState<string | null>(null);
  const [selectedFile,  setSelectedFile]    = useState<File | null>(null);
  const [isAnalyzing,   setIsAnalyzing]     = useState(false);
  const [result,        setResult]          = useState<AnalysisResponse | null>(null);
  const [health,        setHealth]          = useState<HealthStatus | null>(null);

  const [stepStatuses, setStepStatuses] = useState<StepStatus[]>(
    PIPELINE_STEPS.map(() => "pending")
  );
  const [activeTab, setActiveTab] = useState("upload");

  const uploadSectionRef = useRef<HTMLDivElement | null>(null);
  const explanationSectionRef = useRef<HTMLDivElement | null>(null);
  const metricsSectionRef = useRef<HTMLDivElement | null>(null);

  const scrollToSection = (id: string) => {
    const sectionMap: Record<string, HTMLDivElement | null> = {
      upload: uploadSectionRef.current,
      analysis: uploadSectionRef.current,
      explanation: explanationSectionRef.current,
      metrics: metricsSectionRef.current,
    };
    const target = sectionMap[id] ?? uploadSectionRef.current;
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    scrollToSection(tab);
  };

  // ── Health check on mount ──────────────────────────────────────────────────
  useEffect(() => {
    checkHealth()
      .then(setHealth)
      .catch(() =>
        toast({
          title: "Backend unreachable",
          description: "Make sure the X-Brain API is running on port 8000.",
          variant: "destructive",
        })
      );
  }, []);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleFileSelect = (dataUrl: string, file: File) => {
    setUploadedImage(dataUrl);
    setSelectedFile(file);
    setResult(null);
    setStepStatuses(PIPELINE_STEPS.map(() => "pending"));
  };

  /**
   * Animate the pipeline steps while waiting for the real API response.
   * Each step lights up for ~700 ms before the next one starts.
   * When the API resolves all steps flip to "complete" at once.
   */
  const animatePipeline = (): Promise<void> => {
    return new Promise((resolve) => {
      let idx = 0;
      const tick = () => {
        if (idx >= PIPELINE_STEPS.length) { resolve(); return; }
        setStepStatuses((prev) => {
          const next = [...prev] as StepStatus[];
          if (idx > 0) next[idx - 1] = "complete";
          next[idx] = "processing";
          return next;
        });
        idx++;
        setTimeout(tick, 700);
      };
      tick();
    });
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setResult(null);

    try {
      // Start animation (don't await — run concurrently with fetch)
      animatePipeline();

      const data = await analyzeImage(selectedFile);

      // Mark all steps complete
      setStepStatuses(PIPELINE_STEPS.map(() => "complete"));
      setResult(data);

      toast({
        title: "Analysis complete",
        description: `Detected: ${data.classification.class_name} (${(data.classification.confidence * 100).toFixed(1)}% confidence) — ${data.inference_time_ms} ms`,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setStepStatuses(PIPELINE_STEPS.map(() => "pending"));
      toast({
        title: "Analysis failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // ── Derived values for child components ────────────────────────────────────
  const analysisSteps = buildSteps(stepStatuses);

  return (
    <div className="min-h-screen bg-background">
      <Header activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Backend status banner */}
      {health && health.status === "degraded" && (
        <div className="bg-yellow-50 border-b border-yellow-200 text-yellow-800 text-sm text-center py-2 px-4">
          ⚠️ Backend degraded —{" "}
          {!health.classifier && "Classifier model missing. "}
          {!health.segmentor  && "Segmentor model missing. "}
          Check <code>checkpoints/</code> folder.
        </div>
      )}

      <main className="container mx-auto px-4 py-8 space-y-10">
        <HeroSection />

        <div ref={uploadSectionRef} id="upload-section" className="scroll-mt-24">
          {/* Upload + Pipeline */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ImageUploader
              onFileSelect={handleFileSelect}
              onAnalyze={handleAnalyze}
              isAnalyzing={isAnalyzing}
              uploadedImage={uploadedImage}
            />
            <AnalysisPanel
              isAnalyzing={isAnalyzing}
              analysisSteps={analysisSteps}
              modelInfo={MODEL_INFO}
            />
          </div>
        </div>

        {/* Results — only shown after a successful analysis */}
        {result && (
          <div className="space-y-6">
            {/* Classification + Grad-CAM side by side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ClassificationResult
                classification={result.classification}
                inferenceTimeMs={result.inference_time_ms}
              />
              <GradCAMVisualization
                originalSrc={base64ToImageSrc(result.images.original)}
                heatmapSrc={base64ToImageSrc(result.images.gradcam_heatmap)}
                overlaySrc={base64ToImageSrc(result.images.gradcam_overlay)}
                segMaskSrc={base64ToImageSrc(result.images.seg_mask)}
                segOverlaySrc={base64ToImageSrc(result.images.seg_overlay)}
                segmentation={result.segmentation}
              />
            </div>

            <div ref={metricsSectionRef} id="metrics-section" className="scroll-mt-24">
              <MetricsDashboard
                classification={result.classification}
                segmentation={result.segmentation}
                inferenceTimeMs={result.inference_time_ms}
              />
            </div>

            <div ref={explanationSectionRef} id="explanation-section" className="scroll-mt-24">
              <RAGExplanation
                clinicalReport={result.clinical_report}
                className={result.classification.class_name}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
