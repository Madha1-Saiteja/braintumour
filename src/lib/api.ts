/**
 * src/lib/api.ts
 * Centralized API client for X-Brain backend (FastAPI on port 8000)
 */

const BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? "https://braintumour-updated.onrender.com"
    : "http://localhost:8000");

// ── Response Types (mirror backend Pydantic models) ──────────────────────────

export interface ClassificationResult {
  class_name: string;       // 'glioma' | 'meningioma' | 'notumor' | 'pituitary'
  class_idx: number;
  confidence: number;       // 0.0 – 1.0
  probabilities: Record<string, number>;
  has_tumor: boolean;
}

export interface SegmentationResult {
  tumor_area_pct: number;
  tumor_pixels: number;
  total_pixels: number;
  has_mask: boolean;
  skipped: boolean;
}

export interface AnalysisResponse {
  classification: ClassificationResult;
  segmentation: SegmentationResult;
  clinical_report: Record<string, unknown>;
  images: {
    original: string;         // base64 PNG
    gradcam_heatmap: string;  // base64 PNG
    gradcam_overlay: string;  // base64 PNG
    seg_mask: string;         // base64 PNG
    seg_overlay: string;      // base64 PNG
  };
  inference_time_ms: number;
}

export interface HealthStatus {
  status: "ok" | "degraded";
  classifier: boolean;
  segmentor: boolean;
}

// ── API Functions ─────────────────────────────────────────────────────────────

/**
 * POST /analyze
 * Sends an MRI image file and optional patient ID for full pipeline analysis.
 */
export async function analyzeImage(
  file: File,
  patientId: string = "N/A"
): Promise<AnalysisResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const url = `${BASE_URL}/analyze?patient_id=${encodeURIComponent(patientId)}`;

  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const detail = await response.json().catch(() => ({ detail: response.statusText }));
    throw new Error(detail?.detail || `Analysis failed (${response.status})`);
  }

  return response.json() as Promise<AnalysisResponse>;
}

/**
 * GET /health
 * Check whether both models are loaded and ready.
 */
export async function checkHealth(): Promise<HealthStatus> {
  const response = await fetch(`${BASE_URL}/health`);
  if (!response.ok) throw new Error("Backend unreachable");
  return response.json() as Promise<HealthStatus>;
}

/**
 * Helper: convert a base64 string returned by the backend into an img src.
 * The backend returns raw base64 (no data-URL prefix), so we add it here.
 */
export function base64ToImageSrc(b64: string): string {
  if (!b64) return "";
  if (b64.startsWith("data:")) return b64;   // already a data URL
  return `data:image/png;base64,${b64}`;
}
