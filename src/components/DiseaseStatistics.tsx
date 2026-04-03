import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { BarChart3 } from "lucide-react";
import diseasesData from "@/data/diseases.json";
import severityData from "@/data/severity.json";
import { formatSymptomName } from "@/lib/diseaseEngine";

const diseases = diseasesData as Record<string, { symptoms: string[]; description: string; precautions: string[] }>;
const severity = severityData as Record<string, number>;

const COLORS = [
  "hsl(172, 66%, 40%)",
  "hsl(38, 90%, 55%)",
  "hsl(15, 80%, 55%)",
  "hsl(152, 60%, 45%)",
  "hsl(200, 70%, 50%)",
  "hsl(280, 60%, 55%)",
];

const DiseaseStatistics = () => {
  const { symptomFrequency, severityDistribution, diseaseSizeData } = useMemo(() => {
    // Symptom frequency
    const freqMap: Record<string, number> = {};
    Object.values(diseases).forEach(d =>
      d.symptoms.forEach(s => {
        freqMap[s] = (freqMap[s] || 0) + 1;
      })
    );
    const symptomFrequency = Object.entries(freqMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, count]) => ({ name: formatSymptomName(name), count }));

    // Severity distribution
    const buckets = { Low: 0, Moderate: 0, High: 0, Critical: 0 };
    Object.values(severity).forEach(v => {
      if (v >= 7) buckets.Critical++;
      else if (v >= 5) buckets.High++;
      else if (v >= 3) buckets.Moderate++;
      else buckets.Low++;
    });
    const severityDistribution = Object.entries(buckets).map(([name, value]) => ({ name, value }));

    // Disease by symptom count
    const diseaseSizeData = Object.entries(diseases)
      .map(([name, d]) => ({ name, symptoms: d.symptoms.length }))
      .sort((a, b) => b.symptoms - a.symptoms)
      .slice(0, 8);

    return { symptomFrequency, severityDistribution, diseaseSizeData };
  }, []);

  const SEVERITY_COLORS = [
    "hsl(152, 60%, 45%)",
    "hsl(38, 90%, 55%)",
    "hsl(15, 80%, 55%)",
    "hsl(0, 72%, 55%)",
  ];

  return (
    <div className="card-medical p-6 space-y-8">
      <div className="flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-primary" />
        <h2 className="font-display text-xl font-semibold">Dataset Statistics</h2>
      </div>

      {/* Top Symptoms */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
          Most Common Symptoms
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={symptomFrequency} layout="vertical" margin={{ left: 0, right: 16 }}>
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid hsl(180, 15%, 90%)",
                  fontSize: "13px",
                }}
              />
              <Bar dataKey="count" fill="hsl(172, 66%, 40%)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Severity Pie */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
            Symptom Severity Distribution
          </h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={severityDistribution} cx="50%" cy="50%" outerRadius={75} dataKey="value" label>
                  {severityDistribution.map((_, i) => (
                    <Cell key={i} fill={SEVERITY_COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Disease complexity */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
            Disease Complexity (by symptom count)
          </h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={diseaseSizeData} margin={{ left: 0, right: 8 }}>
                <XAxis dataKey="name" tick={{ fontSize: 9 }} angle={-30} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid hsl(180, 15%, 90%)",
                    fontSize: "13px",
                  }}
                />
                <Bar dataKey="symptoms" radius={[4, 4, 0, 0]}>
                  {diseaseSizeData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiseaseStatistics;
