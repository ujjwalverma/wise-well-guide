import { Download, Printer } from "lucide-react";
import type { DiseaseMatch } from "@/lib/diseaseEngine";
import { formatSymptomName } from "@/lib/diseaseEngine";

interface ExportResultsProps {
  results: DiseaseMatch[];
  selectedSymptoms: string[];
}

const generateTextReport = (results: DiseaseMatch[], symptoms: string[]) => {
  const lines: string[] = [];
  lines.push("═══════════════════════════════════════════");
  lines.push("  HEALTH SYMPTOM CHECK REPORT");
  lines.push("  Generated: " + new Date().toLocaleString());
  lines.push("═══════════════════════════════════════════");
  lines.push("");
  lines.push("SELECTED SYMPTOMS:");
  symptoms.forEach(s => lines.push("  • " + formatSymptomName(s)));
  lines.push("");
  lines.push("───────────────────────────────────────────");
  lines.push(`POTENTIAL MATCHES (${results.length}):`);
  lines.push("───────────────────────────────────────────");

  results.forEach((r, i) => {
    lines.push("");
    lines.push(`${i + 1}. ${r.disease} — ${Math.round(r.matchScore * 100)}% match`);
    lines.push(`   Severity: ${r.severityScore >= 6 ? "High" : r.severityScore >= 4 ? "Moderate" : "Low"}`);
    lines.push(`   Matched: ${r.matchedSymptoms.map(formatSymptomName).join(", ")}`);
    if (r.description) {
      lines.push(`   Description: ${r.description}`);
    }
    if (r.precautions.length > 0) {
      lines.push("   Precautions:");
      r.precautions.forEach(p => lines.push(`     - ${p}`));
    }
  });

  lines.push("");
  lines.push("───────────────────────────────────────────");
  lines.push("⚠️ DISCLAIMER: This report is for educational");
  lines.push("purposes only. Consult a healthcare professional.");
  lines.push("───────────────────────────────────────────");

  return lines.join("\n");
};

const ExportResults = ({ results, selectedSymptoms }: ExportResultsProps) => {
  if (results.length === 0) return null;

  const handleDownload = () => {
    const text = generateTextReport(results, selectedSymptoms);
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `health-report-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    const text = generateTextReport(results, selectedSymptoms);
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head><title>Health Report</title>
            <style>
              body { font-family: monospace; white-space: pre-wrap; padding: 2rem; font-size: 13px; line-height: 1.6; }
            </style>
          </head>
          <body>${text}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handleDownload}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
      >
        <Download className="w-4 h-4" />
        Download Report
      </button>
      <button
        onClick={handlePrint}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-colors border border-border"
      >
        <Printer className="w-4 h-4" />
        Print
      </button>
    </div>
  );
};

export default ExportResults;
