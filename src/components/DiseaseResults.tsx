import { DiseaseMatch, formatSymptomName } from "@/lib/diseaseEngine";
import { AlertTriangle, ChevronDown, ChevronUp, Shield, Stethoscope } from "lucide-react";
import { useState } from "react";

interface DiseaseResultsProps {
  results: DiseaseMatch[];
}

const SeverityBadge = ({ score }: { score: number }) => {
  let label: string, colorClass: string;
  if (score >= 6) {
    label = "High";
    colorClass = "bg-severity-high/15 text-severity-high";
  } else if (score >= 4) {
    label = "Moderate";
    colorClass = "bg-severity-medium/15 text-severity-medium";
  } else {
    label = "Low";
    colorClass = "bg-severity-low/15 text-severity-low";
  }
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${colorClass}`}>
      <AlertTriangle className="w-3 h-3" />
      {label}
    </span>
  );
};

const DiseaseCard = ({ result, index }: { result: DiseaseMatch; index: number }) => {
  const [expanded, setExpanded] = useState(false);
  const matchPercent = Math.round(result.matchScore * 100);

  return (
    <div
      className="card-medical p-5 animate-fade-in-up"
      style={{ animationDelay: `${index * 80}ms`, animationFillMode: "backwards" }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Stethoscope className="w-4 h-4 text-primary" />
            <h3 className="font-display text-lg font-semibold">{result.disease}</h3>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <SeverityBadge score={result.severityScore} />
            <span className="text-sm text-muted-foreground">
              {result.matchedSymptoms.length}/{result.totalSymptoms} symptoms matched
            </span>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold font-display text-primary">{matchPercent}%</span>
          <span className="text-xs text-muted-foreground">match</span>
        </div>
      </div>

      {/* Match bar */}
      <div className="w-full h-2 rounded-full bg-secondary mb-4">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${matchPercent}%` }}
        />
      </div>

      {result.description && (
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed line-clamp-2">
          {result.description}
        </p>
      )}

      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
      >
        {expanded ? "Hide" : "Show"} details
        {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {expanded && (
        <div className="mt-4 space-y-4 animate-fade-in-up">
          {result.description && (
            <div>
              <h4 className="text-sm font-semibold mb-1">Description</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{result.description}</p>
            </div>
          )}

          <div>
            <h4 className="text-sm font-semibold mb-2">Matched Symptoms</h4>
            <div className="flex flex-wrap gap-1.5">
              {result.matchedSymptoms.map(s => (
                <span key={s} className="px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium">
                  {formatSymptomName(s)}
                </span>
              ))}
            </div>
          </div>

          {result.precautions.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-1">
                <Shield className="w-4 h-4 text-primary" /> Precautions
              </h4>
              <ul className="space-y-1.5">
                {result.precautions.map((p, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    <span className="capitalize">{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const DiseaseResults = ({ results }: DiseaseResultsProps) => {
  if (results.length === 0) {
    return (
      <div className="card-medical p-8 text-center">
        <Stethoscope className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
        <h3 className="font-display text-lg font-semibold text-muted-foreground mb-1">
          No results yet
        </h3>
        <p className="text-sm text-muted-foreground">
          Select symptoms from the panel to see potential matches
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="font-display text-xl font-semibold">
        Potential Matches ({results.length})
      </h2>
      {results.map((r, i) => (
        <DiseaseCard key={r.disease} result={r} index={i} />
      ))}
      <p className="text-xs text-muted-foreground text-center pt-2">
        ⚠️ This tool is for educational purposes only. Always consult a healthcare professional.
      </p>
    </div>
  );
};

export default DiseaseResults;
