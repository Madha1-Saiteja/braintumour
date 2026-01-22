import { useState } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ImageUploader from "@/components/ImageUploader";
import ClassificationResult from "@/components/ClassificationResult";
import GradCAMVisualization from "@/components/GradCAMVisualization";
import RAGExplanation from "@/components/RAGExplanation";
import MetricsDashboard from "@/components/MetricsDashboard";
import AnalysisPanel from "@/components/AnalysisPanel";

// Mock data for demonstration
const mockClassificationResult = {
  prediction: "Glioma",
  confidence: 94.7,
  probabilities: [
    { label: "Glioma", value: 94.7 },
    { label: "Meningioma", value: 3.2 },
    { label: "Pituitary", value: 1.4 },
    { label: "No Tumor", value: 0.7 },
  ],
};

const mockRegions = [
  { name: "Frontal Lobe", intensity: 87 },
  { name: "Temporal Region", intensity: 62 },
  { name: "White Matter", intensity: 45 },
  { name: "Gray Matter", intensity: 28 },
];

const mockExplanation = {
  summary: "The model classified the MRI scan as Glioma with 94.7% confidence. Grad-CAM analysis highlights abnormal signal intensity in the frontal lobe region, consistent with characteristic glioma presentation. The irregular borders and heterogeneous enhancement pattern observed align with WHO Grade II-III glioma criteria.",
  medicalContext: "Gliomas are primary brain tumors originating from glial cells. According to WHO classification guidelines, they typically present with irregular borders in T1-weighted MRI scans. The detected tumor location in the frontal lobe is consistent with 35% of reported glioma cases. Early detection and accurate classification are crucial for treatment planning.",
  sources: [
    { title: "WHO Classification of CNS Tumors (2021)", type: "Guideline" },
    { title: "Radiological Features of Brain Gliomas", type: "Research" },
    { title: "MRI Patterns in Tumor Detection", type: "Textbook" },
  ],
  keyFindings: [
    "High signal intensity detected in frontal lobe region",
    "Irregular tumor margins consistent with infiltrative growth",
    "Mass effect observed with minimal midline shift",
    "Enhancement pattern suggests Grade II-III classification",
  ],
};

const modelInfo = {
  name: "EfficientNet-B4",
  architecture: "CNN + Transfer Learning",
  parameters: "19.3M",
  inputSize: "224 × 224 × 3",
};

const Index = () => {
  const [activeTab, setActiveTab] = useState("upload");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [showHero, setShowHero] = useState(true);
  const [analysisSteps, setAnalysisSteps] = useState<{ name: string; status: "pending" | "processing" | "complete" }[]>([
    { name: "Image Preprocessing", status: "pending" },
    { name: "CNN Feature Extraction", status: "pending" },
    { name: "Tumor Classification", status: "pending" },
    { name: "Grad-CAM Generation", status: "pending" },
    { name: "RAG Knowledge Retrieval", status: "pending" },
    { name: "LLM Explanation Generation", status: "pending" },
  ]);

  const handleImageUpload = (image: string) => {
    setUploadedImage(image);
    setAnalysisComplete(false);
    setAnalysisSteps((steps) =>
      steps.map((s) => ({ ...s, status: "pending" }))
    );
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);

    // Simulate step-by-step processing
    for (let i = 0; i < analysisSteps.length; i++) {
      setAnalysisSteps((steps) =>
        steps.map((s, idx) => ({
          ...s,
          status: idx === i ? "processing" : idx < i ? "complete" : "pending",
        }))
      );
      await new Promise((resolve) => setTimeout(resolve, 600));
      setAnalysisSteps((steps) =>
        steps.map((s, idx) => ({
          ...s,
          status: idx <= i ? "complete" : s.status,
        }))
      );
    }

    setIsAnalyzing(false);
    setAnalysisComplete(true);
  };

  const handleGetStarted = () => {
    setShowHero(false);
  };

  // Generate a mock heatmap overlay
  const heatmapImage = analysisComplete
    ? "data:image/svg+xml," +
      encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="224" height="224">
          <defs>
            <radialGradient id="heat" cx="40%" cy="35%" r="45%">
              <stop offset="0%" style="stop-color:rgba(255,0,0,0.8)"/>
              <stop offset="40%" style="stop-color:rgba(255,165,0,0.5)"/>
              <stop offset="70%" style="stop-color:rgba(255,255,0,0.3)"/>
              <stop offset="100%" style="stop-color:rgba(0,255,0,0.1)"/>
            </radialGradient>
          </defs>
          <rect width="224" height="224" fill="url(#heat)"/>
        </svg>
      `)
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="container mx-auto px-4 sm:px-6 py-8">
        {showHero && activeTab === "upload" && (
          <HeroSection onGetStarted={handleGetStarted} />
        )}

        {activeTab === "upload" && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Upload & Classification */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <ImageUploader
                  onImageUpload={handleImageUpload}
                  onAnalyze={handleAnalyze}
                  isAnalyzing={isAnalyzing}
                  uploadedImage={uploadedImage}
                />
                <ClassificationResult
                  result={analysisComplete ? mockClassificationResult : null}
                />
              </div>
              <GradCAMVisualization
                originalImage={uploadedImage}
                heatmapImage={heatmapImage}
                regions={analysisComplete ? mockRegions : []}
              />
            </div>

            {/* Right Column - Analysis Pipeline */}
            <div>
              <AnalysisPanel
                isAnalyzing={isAnalyzing}
                analysisSteps={analysisSteps}
                modelInfo={modelInfo}
              />
            </div>
          </div>
        )}

        {activeTab === "analysis" && (
          <div className="grid lg:grid-cols-2 gap-6">
            <GradCAMVisualization
              originalImage={uploadedImage}
              heatmapImage={heatmapImage}
              regions={analysisComplete ? mockRegions : []}
            />
            <ClassificationResult
              result={analysisComplete ? mockClassificationResult : null}
            />
          </div>
        )}

        {activeTab === "explanation" && (
          <div className="max-w-4xl mx-auto">
            <RAGExplanation
              explanation={analysisComplete ? mockExplanation : null}
              tumorType={analysisComplete ? mockClassificationResult.prediction : null}
            />
          </div>
        )}

        {activeTab === "metrics" && <MetricsDashboard />}
      </main>

      {/* Footer */}
      <footer className="border-t border-primary/10 mt-12 bg-gradient-to-r from-primary/5 via-transparent to-accent/5">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm font-medium text-gradient">
              NeuroScan AI — Explainable Brain Tumor Classification
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="px-3 py-1 rounded-full bg-primary/10">CNN + Grad-CAM + RAG</span>
              <span className="w-1.5 h-1.5 rounded-full gradient-primary" />
              <span className="px-3 py-1 rounded-full bg-accent/10">Research Demo</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
