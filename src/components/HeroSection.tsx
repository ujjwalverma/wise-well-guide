import { Activity, Database, Shield } from "lucide-react";

interface HeroSectionProps {
  diseaseCount: number;
  symptomCount: number;
}

const HeroSection = ({ diseaseCount, symptomCount }: HeroSectionProps) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-primary p-8 md:p-12 text-primary-foreground">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-primary-foreground/20 -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-primary-foreground/10 translate-y-1/3 -translate-x-1/4" />
      </div>
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-6 h-6" />
          <span className="text-sm font-medium tracking-wide uppercase opacity-80">
            AI-Powered Health Insights
          </span>
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">
          Symptom Checker & Disease Finder
        </h1>
        <p className="text-primary-foreground/80 max-w-2xl text-lg mb-8">
          Select your symptoms below to get potential disease matches with severity analysis, 
          descriptions, and recommended precautions.
        </p>
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 opacity-70" />
            <span className="font-semibold">{diseaseCount}</span>
            <span className="opacity-70">Diseases</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 opacity-70" />
            <span className="font-semibold">{symptomCount}</span>
            <span className="opacity-70">Symptoms</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
