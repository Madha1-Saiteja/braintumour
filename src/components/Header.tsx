import { Brain, Activity, FileText, BarChart3, Sparkles } from "lucide-react";
import aiBrainImage from "@/assets/ai-brain.jpg";

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Header = ({ activeTab, onTabChange }: HeaderProps) => {
  const tabs = [
    { id: "upload", label: "Upload & Classify", icon: Brain, gradient: "from-primary to-accent" },
    { id: "analysis", label: "Analysis", icon: Activity, gradient: "from-accent to-primary" },
    { id: "explanation", label: "AI Explanation", icon: FileText, gradient: "from-primary to-pink-500" },
    { id: "metrics", label: "Metrics", icon: BarChart3, gradient: "from-cyan-500 to-primary" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-primary/10 shadow-sm">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-xl gradient-hero flex items-center justify-center shadow-glow overflow-hidden">
                <img src={aiBrainImage} alt="Logo" className="w-full h-full object-cover opacity-80" />
                <Brain className="w-5 h-5 text-white absolute" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-accent to-primary rounded-full animate-pulse flex items-center justify-center">
                <Sparkles className="w-2.5 h-2.5 text-white" />
              </div>
            </div>
            <div>
              <h1 className="font-display font-bold text-lg text-gradient">NeuroScan AI</h1>
              <p className="text-xs text-muted-foreground">Brain Tumor Classification</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1 p-1 bg-muted/50 rounded-xl">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                    ${isActive 
                      ? `bg-gradient-to-r ${tab.gradient} text-white shadow-lg shadow-primary/25` 
                      : "text-muted-foreground hover:text-foreground hover:bg-white/80"
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Status */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-success/10 to-accent/10 border border-success/20">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs font-semibold bg-gradient-to-r from-success to-accent bg-clip-text text-transparent">Model Ready</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
