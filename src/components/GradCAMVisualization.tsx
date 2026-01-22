import { Eye, Layers, ZoomIn, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import heroBrainImage from "@/assets/hero-brain.jpg";

interface GradCAMVisualizationProps {
  originalImage: string | null;
  heatmapImage: string | null;
  regions: { name: string; intensity: number }[];
}

const GradCAMVisualization = ({ originalImage, heatmapImage, regions }: GradCAMVisualizationProps) => {
  const [opacity, setOpacity] = useState([50]);

  if (!originalImage) {
    return (
      <Card className="p-6 bg-gradient-to-br from-white to-accent/5 border-accent/20 shadow-lg h-full flex items-center justify-center relative overflow-hidden">
        {/* Background hint */}
        <div className="absolute inset-0 opacity-5">
          <img src={heroBrainImage} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="text-center text-muted-foreground relative">
          <div className="w-16 h-16 rounded-2xl gradient-cyan-purple mx-auto mb-4 flex items-center justify-center opacity-40">
            <Eye className="w-8 h-8 text-white" />
          </div>
          <p className="text-sm">Grad-CAM visualization will appear here</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-white to-cyan-500/5 border-cyan-500/20 shadow-lg shadow-cyan-500/10 animate-fade-in overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-accent/10 to-transparent rounded-bl-full" />
      
      <div className="flex items-center gap-3 mb-6 relative">
        <div className="w-12 h-12 rounded-xl gradient-cyan-purple flex items-center justify-center shadow-lg shadow-cyan-500/30">
          <Layers className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="font-display font-semibold text-lg bg-gradient-to-r from-cyan-500 to-primary bg-clip-text text-transparent">Grad-CAM Visualization</h2>
          <p className="text-sm text-muted-foreground">Explainable AI Heatmap</p>
        </div>
        <Sparkles className="w-5 h-5 text-cyan-500 absolute top-0 right-0 animate-pulse" />
      </div>

      {/* Visualization */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-foreground/5 to-primary/5 mb-4 shadow-inner">
        <img
          src={originalImage}
          alt="Original MRI"
          className="absolute inset-0 w-full h-full object-contain"
        />
        {heatmapImage && (
          <img
            src={heatmapImage}
            alt="Grad-CAM Heatmap"
            className="absolute inset-0 w-full h-full object-contain mix-blend-multiply"
            style={{ opacity: opacity[0] / 100 }}
          />
        )}
        
        {/* Scan effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-scan" />
        </div>

        {/* Corner decorations */}
        <div className="absolute top-2 left-2 w-6 h-6 border-l-2 border-t-2 border-cyan-500/50 rounded-tl" />
        <div className="absolute top-2 right-2 w-6 h-6 border-r-2 border-t-2 border-cyan-500/50 rounded-tr" />
        <div className="absolute bottom-2 left-2 w-6 h-6 border-l-2 border-b-2 border-cyan-500/50 rounded-bl" />
        <div className="absolute bottom-2 right-2 w-6 h-6 border-r-2 border-b-2 border-cyan-500/50 rounded-br" />

        {/* Zoom button */}
        <button className="absolute top-3 right-3 w-10 h-10 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-lg">
          <ZoomIn className="w-5 h-5 text-foreground" />
        </button>
      </div>

      {/* Opacity Control */}
      <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-cyan-500/10 to-primary/10">
        <div className="flex items-center justify-between text-sm mb-3">
          <span className="text-muted-foreground font-medium">Heatmap Opacity</span>
          <span className="font-bold text-cyan-600">{opacity[0]}%</span>
        </div>
        <Slider
          value={opacity}
          onValueChange={setOpacity}
          max={100}
          step={1}
          className="cursor-pointer"
        />
      </div>

      {/* Detected Regions */}
      <div className="relative">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
          Highlighted Regions
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {regions.map((region, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-gradient-to-r from-muted/50 to-white border border-border/50 hover:shadow-md transition-shadow"
            >
              <p className="text-xs text-muted-foreground mb-2 font-medium">{region.name}</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-background rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${region.intensity}%`,
                      background: `linear-gradient(90deg, hsl(185 100% 45%), hsl(262 83% 58%))`,
                    }}
                  />
                </div>
                <span className="text-sm font-bold text-foreground">{region.intensity}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default GradCAMVisualization;
