import { BarChart3, TrendingUp, Target, Award, Activity, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, PieChart, Pie, Cell } from "recharts";
import heroBrainImage from "@/assets/hero-brain.jpg";

const classificationMetrics = [
  { name: "Glioma", accuracy: 96.2, precision: 94.8, recall: 97.1, f1: 95.9 },
  { name: "Meningioma", accuracy: 94.5, precision: 93.2, recall: 95.8, f1: 94.5 },
  { name: "Pituitary", accuracy: 97.8, precision: 98.1, recall: 97.5, f1: 97.8 },
  { name: "No Tumor", accuracy: 99.1, precision: 99.3, recall: 98.9, f1: 99.1 },
];

const radarData = [
  { metric: "Accuracy", value: 96.9 },
  { metric: "Precision", value: 96.4 },
  { metric: "Recall", value: 97.3 },
  { metric: "F1-Score", value: 96.8 },
  { metric: "Specificity", value: 98.2 },
];

const distributionData = [
  { name: "Glioma", value: 826, color: "hsl(350, 89%, 60%)" },
  { name: "Meningioma", value: 822, color: "hsl(280, 90%, 65%)" },
  { name: "Pituitary", value: 827, color: "hsl(190, 100%, 50%)" },
  { name: "No Tumor", value: 395, color: "hsl(160, 84%, 45%)" },
];

const MetricsDashboard = () => {
  const overallMetrics = [
    { label: "Overall Accuracy", value: "96.9%", icon: Target, gradient: "from-purple-500 to-pink-500" },
    { label: "Model Precision", value: "96.4%", icon: Award, gradient: "from-cyan-500 to-blue-500" },
    { label: "Average F1-Score", value: "96.8%", icon: TrendingUp, gradient: "from-green-500 to-emerald-500" },
    { label: "Training Epochs", value: "50", icon: Activity, gradient: "from-orange-500 to-red-500" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {overallMetrics.map((metric, i) => {
          const Icon = metric.icon;
          return (
            <Card key={i} className="p-5 bg-gradient-to-br from-white to-muted/50 border-border/50 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full" />
              <div className="flex items-center gap-4 relative">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${metric.gradient} flex items-center justify-center shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{metric.label}</p>
                  <p className={`text-2xl font-display font-bold bg-gradient-to-r ${metric.gradient} bg-clip-text text-transparent`}>{metric.value}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Per-Class Metrics */}
        <Card className="p-6 bg-gradient-to-br from-white to-purple-500/5 border-purple-500/20 shadow-lg overflow-hidden relative">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-purple-500/10 to-transparent rounded-bl-full" />
          <div className="flex items-center gap-3 mb-6 relative">
            <div className="w-12 h-12 rounded-xl gradient-purple-pink flex items-center justify-center shadow-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-display font-semibold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">Per-Class Performance</h3>
              <p className="text-sm text-muted-foreground">Classification metrics by tumor type</p>
            </div>
            <Sparkles className="w-5 h-5 text-purple-500 absolute top-0 right-0 animate-pulse" />
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={classificationMetrics} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <YAxis domain={[90, 100]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "12px",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.1)"
                  }}
                />
                <Bar dataKey="accuracy" name="Accuracy" fill="hsl(262, 83%, 58%)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="f1" name="F1-Score" fill="hsl(185, 100%, 45%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Radar Chart */}
        <Card className="p-6 bg-gradient-to-br from-white to-cyan-500/5 border-cyan-500/20 shadow-lg overflow-hidden relative">
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-cyan-500/10 to-transparent rounded-tr-full" />
          <div className="flex items-center gap-3 mb-6 relative">
            <div className="w-12 h-12 rounded-xl gradient-cyan-purple flex items-center justify-center shadow-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-display font-semibold bg-gradient-to-r from-cyan-500 to-primary bg-clip-text text-transparent">Model Performance Radar</h3>
              <p className="text-sm text-muted-foreground">Overall evaluation metrics</p>
            </div>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <PolarRadiusAxis domain={[90, 100]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
                <Radar
                  name="Performance"
                  dataKey="value"
                  stroke="hsl(262, 83%, 58%)"
                  fill="url(#radarGradient)"
                  fillOpacity={0.4}
                />
                <defs>
                  <linearGradient id="radarGradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="hsl(262, 83%, 58%)" />
                    <stop offset="100%" stopColor="hsl(185, 100%, 45%)" />
                  </linearGradient>
                </defs>
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Dataset Distribution */}
      <Card className="p-6 bg-gradient-to-br from-white via-primary/5 to-accent/5 border-primary/20 shadow-lg overflow-hidden relative">
        <div className="absolute inset-0 opacity-5">
          <img src={heroBrainImage} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="flex items-center gap-3 mb-6 relative">
          <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center shadow-glow">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-gradient">Dataset Distribution</h3>
            <p className="text-sm text-muted-foreground">Training data composition (3,064 MRI scans)</p>
          </div>
          <Sparkles className="w-5 h-5 text-primary absolute top-0 right-0 animate-pulse" />
        </div>
        <div className="grid lg:grid-cols-2 gap-6 relative">
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={50}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "12px",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.1)"
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-col justify-center gap-4">
            {distributionData.map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-white/80 border border-border/50">
                <div className="w-4 h-4 rounded-full shadow-lg" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-muted-foreground flex-1">{item.name}</span>
                <span className="text-sm font-bold text-foreground">{item.value} images</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MetricsDashboard;
