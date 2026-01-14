import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  AlertCircle, 
  Stethoscope,
  Pill,
  Clock,
  ChevronRight,
  AlertTriangle,
  Info,
  History
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

interface Symptom {
  id: string;
  name: string;
  searchCount: number;
  lastSearched: Date;
}

interface Ailment {
  id: string;
  name: string;
  severity: "low" | "medium" | "high";
  description: string;
  commonSymptoms: string[];
  treatments: string[];
  whenToSeeDoctor: string;
}

const symptomDatabase: Record<string, Ailment[]> = {
  "headache": [
    {
      id: "1",
      name: "Tension Headache",
      severity: "low",
      description: "Most common type of headache caused by muscle tension and stress.",
      commonSymptoms: ["Dull, aching pain", "Pressure around forehead", "Tenderness in scalp and neck"],
      treatments: ["Over-the-counter pain relievers", "Rest in a quiet, dark room", "Apply cold or warm compress", "Stay hydrated"],
      whenToSeeDoctor: "If headaches occur more than 15 days per month or don't improve with treatment"
    },
    {
      id: "2",
      name: "Migraine",
      severity: "medium",
      description: "A neurological condition that can cause intense throbbing pain, usually on one side.",
      commonSymptoms: ["Throbbing pain", "Sensitivity to light and sound", "Nausea", "Visual disturbances"],
      treatments: ["Prescription medications", "Rest in dark room", "Cold compress", "Caffeine in small amounts"],
      whenToSeeDoctor: "If migraines are severe, frequent, or accompanied by fever, stiff neck, or confusion"
    },
  ],
  "fever": [
    {
      id: "3",
      name: "Common Cold",
      severity: "low",
      description: "Viral infection of the upper respiratory tract.",
      commonSymptoms: ["Low-grade fever", "Runny nose", "Sore throat", "Cough"],
      treatments: ["Rest", "Fluids", "Over-the-counter cold medicines", "Honey for cough"],
      whenToSeeDoctor: "If fever exceeds 103°F (39.4°C) or lasts more than 3 days"
    },
    {
      id: "4",
      name: "Influenza (Flu)",
      severity: "medium",
      description: "Contagious respiratory illness caused by influenza viruses.",
      commonSymptoms: ["High fever", "Body aches", "Fatigue", "Chills", "Headache"],
      treatments: ["Antiviral medications (if caught early)", "Rest", "Fluids", "Pain relievers"],
      whenToSeeDoctor: "If you have difficulty breathing, chest pain, or persistent vomiting"
    },
  ],
  "stomach pain": [
    {
      id: "5",
      name: "Indigestion",
      severity: "low",
      description: "Discomfort in the upper abdomen, often after eating.",
      commonSymptoms: ["Bloating", "Nausea", "Burning sensation", "Feeling full quickly"],
      treatments: ["Antacids", "Avoid trigger foods", "Eat slowly", "Reduce stress"],
      whenToSeeDoctor: "If symptoms persist for more than 2 weeks or are accompanied by weight loss"
    },
    {
      id: "6",
      name: "Gastritis",
      severity: "medium",
      description: "Inflammation of the stomach lining.",
      commonSymptoms: ["Burning stomach pain", "Nausea", "Vomiting", "Loss of appetite"],
      treatments: ["Acid-reducing medications", "Antibiotics if H. pylori", "Dietary changes"],
      whenToSeeDoctor: "If you have bloody vomit or stool, or severe abdominal pain"
    },
  ],
  "fatigue": [
    {
      id: "7",
      name: "Sleep Deprivation",
      severity: "low",
      description: "Not getting enough quality sleep over time.",
      commonSymptoms: ["Tiredness", "Difficulty concentrating", "Mood changes", "Reduced immunity"],
      treatments: ["Improve sleep hygiene", "Regular sleep schedule", "Limit screen time", "Exercise"],
      whenToSeeDoctor: "If fatigue persists despite adequate sleep or interferes with daily life"
    },
    {
      id: "8",
      name: "Iron Deficiency Anemia",
      severity: "medium",
      description: "A condition where blood lacks adequate healthy red blood cells.",
      commonSymptoms: ["Extreme fatigue", "Pale skin", "Shortness of breath", "Dizziness"],
      treatments: ["Iron supplements", "Iron-rich diet", "Treat underlying cause"],
      whenToSeeDoctor: "If you experience persistent fatigue, weakness, or pale skin"
    },
  ],
  "cough": [
    {
      id: "9",
      name: "Acute Bronchitis",
      severity: "low",
      description: "Inflammation of the bronchial tubes, usually from a viral infection.",
      commonSymptoms: ["Persistent cough", "Mucus production", "Chest discomfort", "Mild fever"],
      treatments: ["Rest", "Fluids", "Honey", "Humidifier", "OTC cough medicine"],
      whenToSeeDoctor: "If cough lasts more than 3 weeks or produces blood"
    },
  ],
};

const commonSymptoms = [
  "headache", "fever", "cough", "fatigue", "stomach pain", 
  "sore throat", "nausea", "dizziness", "chest pain", "back pain"
];

export function SymptomChecker() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Ailment[]>([]);
  const [selectedAilment, setSelectedAilment] = useState<Ailment | null>(null);
  const [searchHistory, setSearchHistory] = useState<Symptom[]>([
    { id: "1", name: "headache", searchCount: 3, lastSearched: new Date(Date.now() - 86400000) },
    { id: "2", name: "fatigue", searchCount: 2, lastSearched: new Date(Date.now() - 172800000) },
  ]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const lowerQuery = query.toLowerCase().trim();
    
    if (lowerQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    // Find matching symptoms
    const matchingAilments: Ailment[] = [];
    Object.entries(symptomDatabase).forEach(([symptom, ailments]) => {
      if (symptom.includes(lowerQuery) || lowerQuery.includes(symptom)) {
        matchingAilments.push(...ailments);
      }
    });

    setSearchResults(matchingAilments);

    // Update search history
    if (matchingAilments.length > 0) {
      const existingSymptom = searchHistory.find(s => s.name === lowerQuery);
      if (existingSymptom) {
        setSearchHistory(prev => prev.map(s => 
          s.id === existingSymptom.id 
            ? { ...s, searchCount: s.searchCount + 1, lastSearched: new Date() }
            : s
        ));
      }
    }
  };

  // Check for recurring serious symptoms
  const recurringSymptoms = searchHistory.filter(s => s.searchCount >= 3);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low": return "bg-success/10 text-success border-success/30";
      case "medium": return "bg-warning/10 text-warning border-warning/30";
      case "high": return "bg-destructive/10 text-destructive border-destructive/30";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold">Symptom Checker</h1>
        <p className="text-muted-foreground">Search symptoms to find possible ailments and remedies</p>
      </motion.div>

      {/* Recurring Symptoms Alert */}
      {recurringSymptoms.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card className="border-destructive/50 bg-destructive/10">
            <CardContent className="p-4 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="font-medium text-destructive">Recurring Symptoms Detected</p>
                <p className="text-sm text-muted-foreground mt-1">
                  You've searched for "{recurringSymptoms[0].name}" multiple times. 
                  Consider consulting a healthcare professional if symptoms persist.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Search Box */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Enter your symptoms (e.g., headache, fever, fatigue)..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-12 h-14 text-lg"
              />
            </div>
            
            {/* Common Symptoms */}
            <div className="mt-4">
              <p className="text-sm text-muted-foreground mb-2">Common symptoms:</p>
              <div className="flex flex-wrap gap-2">
                {commonSymptoms.map((symptom) => (
                  <button
                    key={symptom}
                    onClick={() => handleSearch(symptom)}
                    className="px-3 py-1.5 rounded-full bg-secondary text-sm hover:bg-secondary/80 transition-colors capitalize"
                  >
                    {symptom}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Search Results */}
      <AnimatePresence mode="wait">
        {searchResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-semibold">Possible Conditions</h2>
            <div className="grid gap-4">
              {searchResults.map((ailment) => (
                <motion.div
                  key={ailment.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Card 
                    className="card-hover cursor-pointer"
                    onClick={() => setSelectedAilment(selectedAilment?.id === ailment.id ? null : ailment)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Stethoscope className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{ailment.name}</h3>
                            <p className="text-sm text-muted-foreground">{ailment.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getSeverityColor(ailment.severity)}>
                            {ailment.severity} severity
                          </Badge>
                          <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform ${
                            selectedAilment?.id === ailment.id ? "rotate-90" : ""
                          }`} />
                        </div>
                      </div>

                      <AnimatePresence>
                        {selectedAilment?.id === ailment.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-4 pt-4 border-t border-border space-y-4">
                              {/* Common Symptoms */}
                              <div>
                                <h4 className="font-medium flex items-center gap-2 mb-2">
                                  <AlertCircle className="w-4 h-4 text-warning" />
                                  Common Symptoms
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {ailment.commonSymptoms.map((symptom, i) => (
                                    <Badge key={i} variant="secondary">{symptom}</Badge>
                                  ))}
                                </div>
                              </div>

                              {/* Treatments */}
                              <div>
                                <h4 className="font-medium flex items-center gap-2 mb-2">
                                  <Pill className="w-4 h-4 text-primary" />
                                  Suggested Treatments
                                </h4>
                                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                  {ailment.treatments.map((treatment, i) => (
                                    <li key={i}>{treatment}</li>
                                  ))}
                                </ul>
                              </div>

                              {/* When to See Doctor */}
                              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30">
                                <h4 className="font-medium flex items-center gap-2 text-destructive mb-1">
                                  <Clock className="w-4 h-4" />
                                  When to See a Doctor
                                </h4>
                                <p className="text-sm">{ailment.whenToSeeDoctor}</p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search History */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="w-5 h-5 text-primary" />
              Recent Searches
            </CardTitle>
          </CardHeader>
          <CardContent>
            {searchHistory.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">No search history</p>
            ) : (
              <div className="space-y-2">
                {searchHistory.map((symptom) => (
                  <button
                    key={symptom.id}
                    onClick={() => handleSearch(symptom.name)}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Search className="w-4 h-4 text-muted-foreground" />
                      <span className="capitalize">{symptom.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{symptom.searchCount} searches</Badge>
                      {symptom.searchCount >= 3 && (
                        <AlertTriangle className="w-4 h-4 text-warning" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Disclaimer */}
      <motion.div variants={itemVariants}>
        <Card className="bg-muted/50">
          <CardContent className="p-4 flex items-start gap-3">
            <Info className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              <strong>Disclaimer:</strong> This symptom checker is for informational purposes only and should not 
              replace professional medical advice. Always consult a healthcare provider for proper diagnosis and treatment.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
