import { useState, useCallback } from "react";
import { Upload, Image, Loader2, Brain, Sparkles, Scan } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import doctorGestureImage from "@/assets/doctor-gesture.jpg";

interface ImageUploaderProps {
  onImageUpload: (image: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  uploadedImage: string | null;
}

const ImageUploader = ({ onImageUpload, onAnalyze, isAnalyzing, uploadedImage }: ImageUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onImageUpload(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageUpload]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onImageUpload(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-white to-primary/5 border-primary/20 shadow-lg shadow-primary/10 overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-accent/10 to-transparent rounded-bl-full" />
      
      <div className="flex items-center gap-3 mb-6 relative">
        <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
          <Upload className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="font-display font-semibold text-lg text-gradient">Upload MRI Scan</h2>
          <p className="text-sm text-muted-foreground">Drag & drop or click to upload</p>
        </div>
      </div>

      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        className={`
          relative border-2 border-dashed rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden
          ${isDragging 
            ? "border-primary bg-gradient-to-br from-primary/10 to-accent/10 scale-[1.02]" 
            : "border-primary/30 hover:border-primary/60 hover:bg-gradient-to-br hover:from-primary/5 hover:to-accent/5"
          }
          ${uploadedImage ? "p-4" : "p-8"}
        `}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        
        {uploadedImage ? (
          <div className="relative">
            <img
              src={uploadedImage}
              alt="Uploaded MRI"
              className="w-full max-h-[300px] object-contain rounded-xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-xl" />
            {isAnalyzing && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/90 backdrop-blur-sm rounded-xl">
                <div className="text-center">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full gradient-hero flex items-center justify-center animate-pulse shadow-glow">
                      <Brain className="w-10 h-10 text-white" />
                    </div>
                    <Sparkles className="w-6 h-6 text-accent absolute -top-2 -right-2 animate-bounce" />
                    <Scan className="w-6 h-6 text-primary absolute -bottom-2 -left-2 animate-ping" />
                  </div>
                  <p className="mt-4 text-sm font-semibold text-gradient">Analyzing scan...</p>
                  <p className="text-xs text-muted-foreground">Applying CNN & Grad-CAM</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center relative">
            {/* Background image hint */}
            <div className="absolute inset-0 opacity-10">
              <img src={doctorGestureImage} alt="" className="w-full h-full object-cover rounded-xl" />
            </div>
            <div className="relative">
              <div className="w-20 h-20 mx-auto rounded-2xl gradient-hero flex items-center justify-center mb-4 shadow-lg shadow-primary/30">
                <Image className="w-10 h-10 text-white" />
              </div>
              <p className="text-base font-semibold text-gradient mb-2">
                Drop your MRI scan here
              </p>
              <p className="text-sm text-muted-foreground">
                Supports JPEG, PNG, DICOM formats
              </p>
            </div>
          </div>
        )}
      </div>

      {uploadedImage && (
        <Button
          onClick={onAnalyze}
          disabled={isAnalyzing}
          className="w-full mt-4 h-14 font-semibold text-lg gradient-hero hover:opacity-90 transition-opacity shadow-glow"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Processing with CNN...
            </>
          ) : (
            <>
              <Brain className="w-5 h-5 mr-2" />
              Analyze with AI
              <Sparkles className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>
      )}
    </Card>
  );
};

export default ImageUploader;
