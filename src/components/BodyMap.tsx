import { useState } from "react";
import { User } from "lucide-react";
import { formatSymptomName } from "@/lib/diseaseEngine";

const BODY_REGIONS: Record<string, { label: string; symptoms: string[]; path: string }> = {
  head: {
    label: "Head & Brain",
    symptoms: [
      "headache", "dizziness", "altered_sensorium", "blurred_and_distorted_vision",
      "visual_disturbances", "loss_of_balance", "lack_of_concentration",
      "slurred_speech", "spinning_movements", "unsteadiness",
    ],
    path: "M 95,20 C 115,20 125,35 125,50 C 125,68 115,75 105,78 L 95,80 L 85,78 C 75,75 65,68 65,50 C 65,35 75,20 95,20 Z",
  },
  throat: {
    label: "Throat & Neck",
    symptoms: [
      "throat_irritation", "patches_in_throat", "phlegm", "cough",
      "continuous_sneezing", "sinus_pressure", "loss_of_smell",
      "enlarged_thyroid", "swollen_lymph_nodes",
    ],
    path: "M 88,80 L 102,80 L 104,95 L 86,95 Z",
  },
  chest: {
    label: "Chest & Lungs",
    symptoms: [
      "chest_pain", "breathlessness", "fast_heart_rate", "palpitations",
      "blood_in_sputum", "rusty_sputum", "mucoid_sputum",
      "congestion",
    ],
    path: "M 70,95 L 120,95 L 125,130 L 65,130 Z",
  },
  abdomen: {
    label: "Abdomen & Stomach",
    symptoms: [
      "stomach_pain", "abdominal_pain", "belly_pain", "acidity",
      "nausea", "vomiting", "loss_of_appetite", "indigestion",
      "constipation", "diarrhoea", "stomach_bleeding", "distention_of_abdomen",
      "passage_of_gases", "pain_during_bowel_movements", "bloody_stool",
    ],
    path: "M 68,130 L 122,130 L 120,175 L 70,175 Z",
  },
  liver: {
    label: "Liver & Organs",
    symptoms: [
      "yellowing_of_eyes", "yellowish_skin", "dark_urine", "acute_liver_failure",
      "fluid_overload", "swelling_of_stomach", "swelled_lymph_nodes",
      "prominent_veins_on_calf",
    ],
    path: "M 65,130 L 68,130 L 70,160 L 62,155 Z",
  },
  skin: {
    label: "Skin",
    symptoms: [
      "itching", "skin_rash", "nodal_skin_eruptions", "dischromic_patches",
      "pus_filled_pimples", "blackheads", "skin_peeling", "silver_like_dusting",
      "blister", "red_sore_around_nose", "yellow_crust_ooze", "bruising",
      "inflammatory_nails", "brittle_nails", "small_dents_in_nails",
    ],
    path: "M 50,95 L 65,95 L 62,155 L 48,140 Z",
  },
  limbs: {
    label: "Arms & Legs",
    symptoms: [
      "joint_pain", "knee_pain", "hip_joint_pain", "muscle_weakness",
      "muscle_wasting", "stiff_neck", "swelling_joints", "movement_stiffness",
      "painful_walking", "weakness_in_limbs", "weakness_of_one_body_side",
      "cold_hands_and_feets", "cramps", "back_pain", "neck_pain",
    ],
    path: "M 70,175 L 120,175 L 125,240 L 110,280 L 100,280 L 95,250 L 90,280 L 80,280 L 65,240 Z",
  },
  urinary: {
    label: "Urinary & Reproductive",
    symptoms: [
      "burning_micturition", "spotting_urination", "bladder_discomfort",
      "foul_smell_of_urine", "continuous_feel_of_urine", "polyuria",
      "abnormal_menstruation",
    ],
    path: "M 122,130 L 125,130 L 130,165 L 125,175 L 120,175 Z",
  },
  general: {
    label: "General / Systemic",
    symptoms: [
      "fatigue", "lethargy", "malaise", "high_fever", "mild_fever",
      "chills", "shivering", "sweating", "dehydration", "weight_loss",
      "weight_gain", "obesity", "restlessness", "anxiety", "depression",
      "irritability", "mood_swings", "excessive_hunger", "increased_appetite",
      "irregular_sugar_level", "toxic_look_(typhos)",
    ],
    path: "M 130,95 L 145,110 L 142,140 L 130,135 Z",
  },
};

interface BodyMapProps {
  allSymptoms: string[];
  selected: string[];
  onToggle: (symptom: string) => void;
}

const BodyMap = ({ allSymptoms, selected, onToggle }: BodyMapProps) => {
  const [activeRegion, setActiveRegion] = useState<string | null>(null);

  const regionSymptoms = activeRegion
    ? BODY_REGIONS[activeRegion].symptoms.filter(s => allSymptoms.includes(s))
    : [];

  const getRegionColor = (regionKey: string) => {
    const region = BODY_REGIONS[regionKey];
    const regionSyms = region.symptoms.filter(s => allSymptoms.includes(s));
    const selectedCount = regionSyms.filter(s => selected.includes(s)).length;
    if (selectedCount > 0) return "fill-primary/60 stroke-primary";
    if (activeRegion === regionKey) return "fill-primary/20 stroke-primary";
    return "fill-secondary stroke-border hover:fill-primary/10";
  };

  return (
    <div className="card-medical p-6">
      <div className="flex items-center gap-2 mb-4">
        <User className="w-5 h-5 text-primary" />
        <h2 className="font-display text-xl font-semibold">Body Map</h2>
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        Click a body region to see related symptoms
      </p>

      <div className="flex flex-col md:flex-row gap-4">
        {/* SVG Body */}
        <div className="flex-shrink-0 flex justify-center">
          <svg viewBox="40 10 120 280" className="w-40 h-72">
            {Object.entries(BODY_REGIONS).map(([key, region]) => (
              <path
                key={key}
                d={region.path}
                className={`cursor-pointer transition-colors duration-200 ${getRegionColor(key)}`}
                strokeWidth="1.5"
                onClick={() => setActiveRegion(activeRegion === key ? null : key)}
              />
            ))}
          </svg>
        </div>

        {/* Region symptoms */}
        <div className="flex-1 min-w-0">
          {activeRegion ? (
            <>
              <h3 className="text-sm font-semibold mb-2">
                {BODY_REGIONS[activeRegion].label}
              </h3>
              <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto">
                {regionSymptoms.length > 0 ? (
                  regionSymptoms.map(s => (
                    <button
                      key={s}
                      onClick={() => onToggle(s)}
                      className={`symptom-chip ${selected.includes(s) ? "symptom-chip-active" : ""}`}
                    >
                      {formatSymptomName(s)}
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No matching symptoms in this region</p>
                )}
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground py-8 text-center">
              Click on a body region to explore related symptoms
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BodyMap;
