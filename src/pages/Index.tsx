import { useState, useCallback, useMemo } from "react";
import HeroSection from "@/components/HeroSection";
import SymptomSelector from "@/components/SymptomSelector";
import DiseaseResults from "@/components/DiseaseResults";
import DiseaseStatistics from "@/components/DiseaseStatistics";
import SymptomHistory, { saveToHistory } from "@/components/SymptomHistory";
import BodyMap from "@/components/BodyMap";
import ExportResults from "@/components/ExportResults";
import {
  getAllSymptoms,
  findDiseases,
  getDiseaseCount,
  getSymptomCount,
} from "@/lib/diseaseEngine";

const allSymptoms = getAllSymptoms();

const Index = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const [historyKey, setHistoryKey] = useState(0);

  const toggle = useCallback((symptom: string) => {
    setSelected(prev =>
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  }, []);

  const clear = useCallback(() => setSelected([]), []);

  const results = useMemo(() => findDiseases(selected), [selected]);

  const handleSaveCheck = useCallback(() => {
    if (selected.length > 0 && results.length > 0) {
      saveToHistory(selected, results);
      setHistoryKey(k => k + 1);
    }
  }, [selected, results]);

  const handleRestore = useCallback((symptoms: string[]) => {
    setSelected(symptoms);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <HeroSection
          diseaseCount={getDiseaseCount()}
          symptomCount={getSymptomCount()}
        />

        {/* Body Map */}
        <BodyMap allSymptoms={allSymptoms} selected={selected} onToggle={toggle} />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-8 space-y-6">
              <SymptomSelector
                allSymptoms={allSymptoms}
                selected={selected}
                onToggle={toggle}
                onClear={clear}
              />
              {selected.length > 0 && (
                <button
                  onClick={handleSaveCheck}
                  className="w-full py-2.5 rounded-lg bg-accent text-accent-foreground text-sm font-semibold hover:bg-accent/90 transition-colors"
                >
                  Save This Check to History
                </button>
              )}
            </div>
          </div>
          <div className="lg:col-span-3 space-y-6">
            {results.length > 0 && (
              <div className="flex justify-end">
                <ExportResults results={results} selectedSymptoms={selected} />
              </div>
            )}
            <DiseaseResults results={results} />
          </div>
        </div>

        {/* Statistics & History */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <DiseaseStatistics />
          <SymptomHistory key={historyKey} onRestore={handleRestore} />
        </div>
      </div>
    </div>
  );
};

export default Index;
