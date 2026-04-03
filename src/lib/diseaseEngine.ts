import diseasesData from "@/data/diseases.json";
import severityData from "@/data/severity.json";

interface DiseaseInfo {
  symptoms: string[];
  description: string;
  precautions: string[];
}

export interface DiseaseMatch {
  disease: string;
  matchScore: number;
  matchedSymptoms: string[];
  totalSymptoms: number;
  description: string;
  precautions: string[];
  severityScore: number;
}

const diseases = diseasesData as Record<string, DiseaseInfo>;
const severity = severityData as Record<string, number>;

export function getAllSymptoms(): string[] {
  const all = new Set<string>();
  Object.values(diseases).forEach(d => d.symptoms.forEach(s => all.add(s)));
  return Array.from(all).sort();
}

export function getSymptomSeverity(symptom: string): number {
  return severity[symptom] ?? 3;
}

export function formatSymptomName(symptom: string): string {
  return symptom.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

export function findDiseases(selectedSymptoms: string[]): DiseaseMatch[] {
  if (selectedSymptoms.length === 0) return [];

  const results: DiseaseMatch[] = [];

  for (const [disease, info] of Object.entries(diseases)) {
    const matched = info.symptoms.filter(s => selectedSymptoms.includes(s));
    if (matched.length === 0) continue;

    const matchScore = matched.length / info.symptoms.length;
    const severityScore = matched.reduce((sum, s) => sum + getSymptomSeverity(s), 0) / matched.length;

    results.push({
      disease,
      matchScore,
      matchedSymptoms: matched,
      totalSymptoms: info.symptoms.length,
      description: info.description,
      precautions: info.precautions,
      severityScore,
    });
  }

  return results.sort((a, b) => b.matchScore - a.matchScore).slice(0, 10);
}

export function getDiseaseCount(): number {
  return Object.keys(diseases).length;
}

export function getSymptomCount(): number {
  return getAllSymptoms().length;
}
