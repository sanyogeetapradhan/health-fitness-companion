import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Plus, 
  Flame, 
  Clock, 
  Dumbbell,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Zap
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

interface Exercise {
  id: string;
  name: string;
  duration: number;
  caloriesPerMin: number;
  category: string;
  icon: string;
}

interface WorkoutLog {
  id: string;
  exercise: Exercise;
  duration: number;
  caloriesBurned: number;
  completedAt: Date;
}

const exercises: Exercise[] = [
  { id: "1", name: "Running", duration: 30, caloriesPerMin: 10, category: "Cardio", icon: "🏃" },
  { id: "2", name: "Cycling", duration: 30, caloriesPerMin: 8, category: "Cardio", icon: "🚴" },
  { id: "3", name: "Swimming", duration: 30, caloriesPerMin: 11, category: "Cardio", icon: "🏊" },
  { id: "4", name: "Jump Rope", duration: 15, caloriesPerMin: 12, category: "Cardio", icon: "⏰" },
  { id: "5", name: "Weight Training", duration: 45, caloriesPerMin: 6, category: "Strength", icon: "🏋️" },
  { id: "6", name: "Push-ups", duration: 10, caloriesPerMin: 7, category: "Strength", icon: "💪" },
  { id: "7", name: "Squats", duration: 10, caloriesPerMin: 8, category: "Strength", icon: "🦵" },
  { id: "8", name: "Planks", duration: 5, caloriesPerMin: 4, category: "Core", icon: "🧘" },
  { id: "9", name: "Yoga", duration: 30, caloriesPerMin: 3, category: "Flexibility", icon: "🧘‍♀️" },
  { id: "10", name: "HIIT", duration: 20, caloriesPerMin: 14, category: "Cardio", icon: "⚡" },
  { id: "11", name: "Walking", duration: 30, caloriesPerMin: 4, category: "Cardio", icon: "🚶" },
  { id: "12", name: "Dancing", duration: 30, caloriesPerMin: 7, category: "Cardio", icon: "💃" },
];

export function Workouts() {
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([
    { 
      id: "1", 
      exercise: exercises[0], 
      duration: 30, 
      caloriesBurned: 300, 
      completedAt: new Date() 
    },
    { 
      id: "2", 
      exercise: exercises[9], 
      duration: 20, 
      caloriesBurned: 280, 
      completedAt: new Date() 
    },
  ]);
  
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [customDuration, setCustomDuration] = useState("");
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const totalCaloriesBurned = workoutLogs.reduce((sum, log) => sum + log.caloriesBurned, 0);
  const totalMinutes = workoutLogs.reduce((sum, log) => sum + log.duration, 0);

  const handleLogWorkout = () => {
    if (!selectedExercise) return;
    
    const duration = parseInt(customDuration) || selectedExercise.duration;
    const caloriesBurned = Math.round(duration * selectedExercise.caloriesPerMin);
    
    const newLog: WorkoutLog = {
      id: Date.now().toString(),
      exercise: selectedExercise,
      duration,
      caloriesBurned,
      completedAt: new Date(),
    };
    
    setWorkoutLogs([newLog, ...workoutLogs]);
    setSelectedExercise(null);
    setCustomDuration("");
    setIsDialogOpen(false);
  };

  const categories = [...new Set(exercises.map(e => e.category))];

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
          <h1 className="text-3xl font-bold">Workouts</h1>
          <p className="text-muted-foreground">Track your exercises and calories burned</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-health text-primary-foreground shadow-glow">
              <Plus className="w-4 h-4 mr-2" />
              Log Workout
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Log a Workout</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Exercise Type</Label>
                <Select onValueChange={(value) => setSelectedExercise(exercises.find(e => e.id === value) || null)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an exercise" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <div key={category}>
                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">{category}</div>
                        {exercises.filter(e => e.category === category).map(exercise => (
                          <SelectItem key={exercise.id} value={exercise.id}>
                            {exercise.icon} {exercise.name}
                          </SelectItem>
                        ))}
                      </div>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedExercise && (
                <>
                  <div className="space-y-2">
                    <Label>Duration (minutes)</Label>
                    <Input
                      type="number"
                      placeholder={selectedExercise.duration.toString()}
                      value={customDuration}
                      onChange={(e) => setCustomDuration(e.target.value)}
                    />
                  </div>
                  
                  <div className="p-4 rounded-xl bg-secondary">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Estimated calories burned</span>
                      <span className="text-2xl font-bold text-calories">
                        {Math.round((parseInt(customDuration) || selectedExercise.duration) * selectedExercise.caloriesPerMin)}
                      </span>
                    </div>
                  </div>
                </>
              )}
              
              <Button 
                onClick={handleLogWorkout} 
                className="w-full gradient-health text-primary-foreground"
                disabled={!selectedExercise}
              >
                Log Workout
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div variants={itemVariants}>
          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl gradient-calories flex items-center justify-center">
                  <Flame className="w-6 h-6 text-calories-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Calories Burned</p>
                  <p className="text-2xl font-bold">{totalCaloriesBurned}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl gradient-energy flex items-center justify-center">
                  <Clock className="w-6 h-6 text-energy-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Minutes</p>
                  <p className="text-2xl font-bold">{totalMinutes}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl gradient-health flex items-center justify-center">
                  <Dumbbell className="w-6 h-6 text-health-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Workouts Today</p>
                  <p className="text-2xl font-bold">{workoutLogs.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Timer */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-energy" />
              Quick Timer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center gap-6">
              <div className="text-5xl font-mono font-bold">
                {String(Math.floor(timerSeconds / 60)).padStart(2, "0")}:
                {String(timerSeconds % 60).padStart(2, "0")}
              </div>
              <div className="flex gap-2">
                <Button
                  size="icon"
                  variant={isTimerRunning ? "destructive" : "default"}
                  className={!isTimerRunning ? "gradient-health text-primary-foreground" : ""}
                  onClick={() => {
                    if (isTimerRunning) {
                      setIsTimerRunning(false);
                    } else {
                      setIsTimerRunning(true);
                      const interval = setInterval(() => {
                        setTimerSeconds(prev => {
                          if (!isTimerRunning) {
                            clearInterval(interval);
                            return prev;
                          }
                          return prev + 1;
                        });
                      }, 1000);
                    }
                  }}
                >
                  {isTimerRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => {
                    setIsTimerRunning(false);
                    setTimerSeconds(0);
                  }}
                >
                  <RotateCcw className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Exercise Library */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Exercise Library</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {exercises.map((exercise) => (
                <motion.button
                  key={exercise.id}
                  className="p-4 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors text-left"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSelectedExercise(exercise);
                    setIsDialogOpen(true);
                  }}
                >
                  <div className="text-2xl mb-2">{exercise.icon}</div>
                  <p className="font-medium text-sm">{exercise.name}</p>
                  <p className="text-xs text-muted-foreground">{exercise.caloriesPerMin} cal/min</p>
                </motion.button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Workout History */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Today's Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {workoutLogs.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No workouts logged today</p>
            ) : (
              workoutLogs.map((log) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-success/10"
                >
                  <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center text-2xl">
                    {log.exercise.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{log.exercise.name}</p>
                    <p className="text-sm text-muted-foreground">{log.duration} minutes</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-calories">{log.caloriesBurned}</p>
                    <p className="text-xs text-muted-foreground">calories</p>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-success" />
                </motion.div>
              ))
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
