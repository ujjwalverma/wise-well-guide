import { useState, useEffect } from "react";
import { History, Trash2, RotateCcw, Clock } from "lucide-react";
import { formatSymptomName } from "@/lib/diseaseEngine";
import type { DiseaseMatch } from "@/lib/diseaseEngine";

export interface HistoryEntry {
  id: string;
  timestamp: number;
  symptoms: string[];
  topResult: string | null;
  matchCount: number;
}

const STORAGE_KEY = "symptom-check-history";

export function saveToHistory(symptoms: string[], results: DiseaseMatch[]) {
  const entry: HistoryEntry = {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    symptoms,
    topResult: results.length > 0 ? results[0].disease : null,
    matchCount: results.length,
  };
  const existing = loadHistory();
  const updated = [entry, ...existing].slice(0, 20);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function loadHistory(): HistoryEntry[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

interface SymptomHistoryProps {
  onRestore: (symptoms: string[]) => void;
}

const SymptomHistory = ({ onRestore }: SymptomHistoryProps) => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const clearHistory = () => {
    localStorage.removeItem(STORAGE_KEY);
    setHistory([]);
  };

  const removeEntry = (id: string) => {
    const updated = history.filter(h => h.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setHistory(updated);
  };

  if (history.length === 0) {
    return (
      <div className="card-medical p-6">
        <div className="flex items-center gap-2 mb-3">
          <History className="w-5 h-5 text-primary" />
          <h2 className="font-display text-xl font-semibold">Check History</h2>
        </div>
        <p className="text-sm text-muted-foreground text-center py-4">
          No history yet. Run a symptom check to start tracking.
        </p>
      </div>
    );
  }

  return (
    <div className="card-medical p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-primary" />
          <h2 className="font-display text-xl font-semibold">Check History</h2>
        </div>
        <button
          onClick={clearHistory}
          className="text-xs text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1"
        >
          <Trash2 className="w-3 h-3" /> Clear all
        </button>
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto">
        {history.map(entry => (
          <div
            key={entry.id}
            className="p-3 rounded-lg bg-secondary/50 border border-border group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                {new Date(entry.timestamp).toLocaleString()}
              </span>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onRestore(entry.symptoms)}
                  className="p-1 rounded hover:bg-primary/10 text-primary"
                  title="Restore symptoms"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => removeEntry(entry.id)}
                  className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                  title="Remove"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-1 mb-1.5">
              {entry.symptoms.slice(0, 4).map(s => (
                <span key={s} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">
                  {formatSymptomName(s)}
                </span>
              ))}
              {entry.symptoms.length > 4 && (
                <span className="text-xs text-muted-foreground">+{entry.symptoms.length - 4} more</span>
              )}
            </div>
            {entry.topResult && (
              <p className="text-xs text-muted-foreground">
                Top match: <span className="font-medium text-foreground">{entry.topResult}</span>
                {entry.matchCount > 1 && ` (+${entry.matchCount - 1} others)`}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SymptomHistory;
