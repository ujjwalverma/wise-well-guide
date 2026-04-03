import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import { formatSymptomName, getSymptomSeverity } from "@/lib/diseaseEngine";

interface SymptomSelectorProps {
  allSymptoms: string[];
  selected: string[];
  onToggle: (symptom: string) => void;
  onClear: () => void;
}

const SymptomSelector = ({ allSymptoms, selected, onToggle, onClear }: SymptomSelectorProps) => {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search) return allSymptoms;
    const q = search.toLowerCase();
    return allSymptoms.filter(s => formatSymptomName(s).toLowerCase().includes(q));
  }, [allSymptoms, search]);

  const severityColor = (s: string) => {
    const w = getSymptomSeverity(s);
    if (w >= 6) return "border-severity-high/40";
    if (w >= 4) return "border-severity-medium/40";
    return "";
  };

  return (
    <div className="card-medical p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl font-semibold">Select Symptoms</h2>
        {selected.length > 0 && (
          <button
            onClick={onClear}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" /> Clear all ({selected.length})
          </button>
        )}
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search symptoms..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-secondary text-secondary-foreground border border-border focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all"
        />
      </div>

      {selected.length > 0 && (
        <div className="mb-4 pb-4 border-b border-border">
          <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide font-medium">Selected</p>
          <div className="flex flex-wrap gap-2">
            {selected.map(s => (
              <button
                key={s}
                onClick={() => onToggle(s)}
                className="symptom-chip symptom-chip-active"
              >
                {formatSymptomName(s)}
                <X className="w-3 h-3" />
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="max-h-64 overflow-y-auto pr-1">
        <div className="flex flex-wrap gap-2">
          {filtered
            .filter(s => !selected.includes(s))
            .map(s => (
              <button
                key={s}
                onClick={() => onToggle(s)}
                className={`symptom-chip ${severityColor(s)}`}
              >
                {formatSymptomName(s)}
              </button>
            ))}
        </div>
        {filtered.filter(s => !selected.includes(s)).length === 0 && (
          <p className="text-muted-foreground text-sm text-center py-4">No symptoms found</p>
        )}
      </div>
    </div>
  );
};

export default SymptomSelector;
