import { useState, useCallback, useMemo } from "react";
import HeroSection from "@/components/HeroSection";
import SymptomSelector from "@/components/SymptomSelector";
import DiseaseResults from "@/components/DiseaseResults";
import {
  getAllSymptoms,
  findDiseases,
  getDiseaseCount,
  getSymptomCount,
} from "@/lib/diseaseEngine";

const allSymptoms = getAllSymptoms();

const Index = () => {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = useCallback((symptom: string) => {
    setSelected(prev =>
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  }, []);

  const clear = useCallback(() => setSelected([]), []);

  const results = useMemo(() => findDiseases(selected), [selected]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <HeroSection
          diseaseCount={getDiseaseCount()}
          symptomCount={getSymptomCount()}
        />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-8">
              <SymptomSelector
                allSymptoms={allSymptoms}
                selected={selected}
                onToggle={toggle}
                onClear={clear}
              />
            </div>
          </div>
          <div className="lg:col-span-3">
            <DiseaseResults results={results} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
