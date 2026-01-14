import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Heart, 
  Activity, 
  Droplets, 
  Moon,
  Scale,
  Thermometer,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Plus
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

interface HealthMetric {
  id: string;
  type: string;
  value: number;
  unit: string;
  loggedAt: Date;
}

interface HealthCheckIn {
  id: string;
  date: Date;
  weight: number;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  heartRate: number;
  sleepHours: number;
  waterIntake: number;
  energyLevel: number;
  mood: number;
}

export function Health() {
  const [checkIns, setCheckIns] = useState<HealthCheckIn[]>([
    {
      id: "1",
      date: new Date(Date.now() - 86400000 * 3),
      weight: 72.5,
      bloodPressureSystolic: 120,
      bloodPressureDiastolic: 80,
      heartRate: 68,
      sleepHours: 7.5,
      waterIntake: 2.5,
      energyLevel: 7,
      mood: 8,
    },
  ]);
  
  const [showReminder, setShowReminder] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Form state
  const [weight, setWeight] = useState("");
  const [bpSystolic, setBpSystolic] = useState("");
  const [bpDiastolic, setBpDiastolic] = useState("");
  const [heartRate, setHeartRate] = useState("");
  const [sleepHours, setSleepHours] = useState("");
  const [waterIntake, setWaterIntake] = useState("");
  const [energyLevel, setEnergyLevel] = useState([7]);
  const [mood, setMood] = useState([7]);

  // Check if reminder should show (no check-in in last 2 days)
  useEffect(() => {
    if (checkIns.length === 0) {
      setShowReminder(true);
      return;
    }
    
    const lastCheckIn = checkIns[0];
    const daysSinceLastCheckIn = Math.floor(
      (Date.now() - lastCheckIn.date.getTime()) / (1000 * 60 * 60 * 24)
    );
    setShowReminder(daysSinceLastCheckIn >= 2);
  }, [checkIns]);

  const handleSubmitCheckIn = () => {
    const newCheckIn: HealthCheckIn = {
      id: Date.now().toString(),
      date: new Date(),
      weight: parseFloat(weight) || 0,
      bloodPressureSystolic: parseInt(bpSystolic) || 0,
      bloodPressureDiastolic: parseInt(bpDiastolic) || 0,
      heartRate: parseInt(heartRate) || 0,
      sleepHours: parseFloat(sleepHours) || 0,
      waterIntake: parseFloat(waterIntake) || 0,
      energyLevel: energyLevel[0],
      mood: mood[0],
    };
    
    setCheckIns([newCheckIn, ...checkIns]);
    setIsDialogOpen(false);
    setShowReminder(false);
    
    // Reset form
    setWeight("");
    setBpSystolic("");
    setBpDiastolic("");
    setHeartRate("");
    setSleepHours("");
    setWaterIntake("");
    setEnergyLevel([7]);
    setMood([7]);
  };

  const latestCheckIn = checkIns[0];

  const healthMetrics = latestCheckIn ? [
    { 
      label: "Weight", 
      value: `${latestCheckIn.weight} kg`, 
      icon: <Scale className="w-5 h-5" />,
      status: "normal"
    },
    { 
      label: "Blood Pressure", 
      value: `${latestCheckIn.bloodPressureSystolic}/${latestCheckIn.bloodPressureDiastolic}`, 
      icon: <Activity className="w-5 h-5" />,
      status: latestCheckIn.bloodPressureSystolic > 140 ? "warning" : "normal"
    },
    { 
      label: "Heart Rate", 
      value: `${latestCheckIn.heartRate} bpm`, 
      icon: <Heart className="w-5 h-5" />,
      status: "normal"
    },
    { 
      label: "Sleep", 
      value: `${latestCheckIn.sleepHours} hours`, 
      icon: <Moon className="w-5 h-5" />,
      status: latestCheckIn.sleepHours < 6 ? "warning" : "normal"
    },
    { 
      label: "Water Intake", 
      value: `${latestCheckIn.waterIntake} L`, 
      icon: <Droplets className="w-5 h-5" />,
      status: latestCheckIn.waterIntake < 2 ? "warning" : "normal"
    },
    { 
      label: "Energy Level", 
      value: `${latestCheckIn.energyLevel}/10`, 
      icon: <Thermometer className="w-5 h-5" />,
      status: latestCheckIn.energyLevel < 5 ? "warning" : "normal"
    },
  ] : [];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Health Status</h1>
          <p className="text-muted-foreground">Track and monitor your health metrics</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-health text-primary-foreground shadow-glow">
              <Plus className="w-4 h-4 mr-2" />
              Check In
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Health Check-In</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Weight (kg)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="72.5"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Heart Rate (bpm)</Label>
                  <Input
                    type="number"
                    placeholder="72"
                    value={heartRate}
                    onChange={(e) => setHeartRate(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Blood Pressure</Label>
                <div className="flex gap-2 items-center">
                  <Input
                    type="number"
                    placeholder="120"
                    value={bpSystolic}
                    onChange={(e) => setBpSystolic(e.target.value)}
                  />
                  <span className="text-muted-foreground">/</span>
                  <Input
                    type="number"
                    placeholder="80"
                    value={bpDiastolic}
                    onChange={(e) => setBpDiastolic(e.target.value)}
                  />
                  <span className="text-sm text-muted-foreground">mmHg</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Sleep (hours)</Label>
                  <Input
                    type="number"
                    step="0.5"
                    placeholder="7.5"
                    value={sleepHours}
                    onChange={(e) => setSleepHours(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Water Intake (L)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="2.5"
                    value={waterIntake}
                    onChange={(e) => setWaterIntake(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <Label>Energy Level: {energyLevel[0]}/10</Label>
                <Slider
                  value={energyLevel}
                  onValueChange={setEnergyLevel}
                  max={10}
                  min={1}
                  step={1}
                />
              </div>
              
              <div className="space-y-3">
                <Label>Mood: {mood[0]}/10</Label>
                <Slider
                  value={mood}
                  onValueChange={setMood}
                  max={10}
                  min={1}
                  step={1}
                />
              </div>
              
              <Button 
                onClick={handleSubmitCheckIn} 
                className="w-full gradient-health text-primary-foreground"
              >
                Save Check-In
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Reminder Alert */}
      {showReminder && (
        <motion.div variants={itemVariants}>
          <Card className="border-warning/50 bg-warning/10">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-warning" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Time for a health check-in!</p>
                <p className="text-sm text-muted-foreground">
                  {checkIns.length === 0 
                    ? "Start tracking your health today" 
                    : "It's been a while since your last update"}
                </p>
              </div>
              <Button 
                onClick={() => setIsDialogOpen(true)}
                className="bg-warning text-warning-foreground hover:bg-warning/90"
              >
                Update Now
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Health Metrics Grid */}
      {latestCheckIn && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {healthMetrics.map((metric, index) => (
            <motion.div key={metric.label} variants={itemVariants}>
              <Card className={`card-hover ${metric.status === "warning" ? "border-warning/50" : ""}`}>
                <CardContent className="p-4">
                  <div className={`w-10 h-10 rounded-xl mb-3 flex items-center justify-center ${
                    metric.status === "warning" ? "bg-warning/20 text-warning" : "bg-primary/10 text-primary"
                  }`}>
                    {metric.icon}
                  </div>
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                  <p className="text-xl font-bold">{metric.value}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Health History */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Check-In History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {checkIns.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No check-ins recorded yet</p>
            ) : (
              <div className="space-y-3">
                {checkIns.map((checkIn) => (
                  <div
                    key={checkIn.id}
                    className="flex items-center gap-4 p-4 rounded-xl bg-secondary"
                  >
                    <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-success" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">
                        {checkIn.date.toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                      <div className="flex flex-wrap gap-3 mt-1 text-sm text-muted-foreground">
                        <span>Weight: {checkIn.weight}kg</span>
                        <span>BP: {checkIn.bloodPressureSystolic}/{checkIn.bloodPressureDiastolic}</span>
                        <span>HR: {checkIn.heartRate}bpm</span>
                        <span>Sleep: {checkIn.sleepHours}h</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <span className="text-sm">Energy:</span>
                        <span className="font-semibold text-primary">{checkIn.energyLevel}/10</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-sm">Mood:</span>
                        <span className="font-semibold text-energy">{checkIn.mood}/10</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Tips Card */}
      <motion.div variants={itemVariants}>
        <Card className="gradient-health text-primary-foreground">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-2">💡 Health Tip of the Day</h3>
            <p className="opacity-90">
              Staying hydrated is crucial for maintaining energy levels and cognitive function. 
              Aim for at least 2 liters of water daily, and increase intake during exercise or hot weather.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
