import { motion } from "framer-motion";
import { 
  Flame, 
  Footprints, 
  Heart, 
  TrendingUp, 
  Utensils, 
  Dumbbell,
  AlertCircle,
  CheckCircle2,
  Clock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4 }
  }
};

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  gradient: string;
  progress?: number;
}

function StatCard({ title, value, subtitle, icon, gradient, progress }: StatCardProps) {
  return (
    <motion.div variants={itemVariants}>
      <Card className="card-hover overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <p className="text-3xl font-bold mt-1">{value}</p>
              <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
              {progress !== undefined && (
                <div className="mt-3">
                  <Progress value={progress} className="h-2" />
                </div>
              )}
            </div>
            <div className={`w-12 h-12 rounded-xl ${gradient} flex items-center justify-center shadow-lg`}>
              {icon}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function Dashboard() {
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? "Good morning" : currentHour < 18 ? "Good afternoon" : "Good evening";

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="space-y-1">
        <h1 className="text-3xl font-bold">{greeting}! 👋</h1>
        <p className="text-muted-foreground">Here's your health overview for today</p>
      </motion.div>

      {/* Health Status Alert */}
      <motion.div variants={itemVariants}>
        <Card className="border-warning/50 bg-warning/10">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-warning" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Health check-in reminder</p>
              <p className="text-sm text-muted-foreground">You haven't updated your health status in 3 days</p>
            </div>
            <button className="px-4 py-2 bg-warning text-warning-foreground rounded-lg font-medium text-sm hover:opacity-90 transition-opacity">
              Update Now
            </button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Calories Burned"
          value="1,842"
          subtitle="420 kcal to goal"
          icon={<Flame className="w-6 h-6 text-calories-foreground" />}
          gradient="gradient-calories"
          progress={75}
        />
        <StatCard
          title="Steps Today"
          value="8,234"
          subtitle="1,766 steps to goal"
          icon={<Footprints className="w-6 h-6 text-energy-foreground" />}
          gradient="gradient-energy"
          progress={82}
        />
        <StatCard
          title="Heart Rate"
          value="72"
          subtitle="bpm - Normal"
          icon={<Heart className="w-6 h-6 text-health-foreground" />}
          gradient="gradient-health"
        />
        <StatCard
          title="Calories Intake"
          value="1,650"
          subtitle="350 kcal remaining"
          icon={<Utensils className="w-6 h-6 text-primary-foreground" />}
          gradient="gradient-health"
          progress={82}
        />
      </div>

      {/* Activity & Meals Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Workouts */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-primary" />
                Today's Workouts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: "Morning Run", duration: "30 min", calories: 320, completed: true },
                { name: "HIIT Session", duration: "20 min", calories: 280, completed: true },
                { name: "Evening Yoga", duration: "15 min", calories: 80, completed: false },
              ].map((workout, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-4 p-3 rounded-xl ${
                    workout.completed ? "bg-success/10" : "bg-secondary"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    workout.completed ? "bg-success/20" : "bg-muted"
                  }`}>
                    {workout.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-success" />
                    ) : (
                      <Clock className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{workout.name}</p>
                    <p className="text-sm text-muted-foreground">{workout.duration}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-calories">{workout.calories}</p>
                    <p className="text-xs text-muted-foreground">kcal</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Today's Meals */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Utensils className="w-5 h-5 text-primary" />
                Today's Meals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: "Breakfast", items: "Oatmeal, Banana, Coffee", calories: 420, protein: 15, carbs: 65, fat: 12 },
                { name: "Lunch", items: "Grilled Chicken Salad", calories: 580, protein: 42, carbs: 25, fat: 28 },
                { name: "Snack", items: "Greek Yogurt, Almonds", calories: 280, protein: 18, carbs: 20, fat: 14 },
              ].map((meal, index) => (
                <div key={index} className="p-3 rounded-xl bg-secondary">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium">{meal.name}</p>
                      <p className="text-sm text-muted-foreground">{meal.items}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{meal.calories}</p>
                      <p className="text-xs text-muted-foreground">kcal</p>
                    </div>
                  </div>
                  <div className="flex gap-4 text-xs">
                    <span className="text-primary">P: {meal.protein}g</span>
                    <span className="text-energy">C: {meal.carbs}g</span>
                    <span className="text-warning">F: {meal.fat}g</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Weekly Trend */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Weekly Activity Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between h-32 gap-2">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => {
                const heights = [60, 85, 45, 90, 75, 55, 40];
                const isToday = index === new Date().getDay() - 1;
                return (
                  <div key={day} className="flex-1 flex flex-col items-center gap-2">
                    <motion.div
                      className={`w-full rounded-t-lg ${isToday ? "gradient-health" : "bg-secondary"}`}
                      initial={{ height: 0 }}
                      animate={{ height: `${heights[index]}%` }}
                      transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
                    />
                    <span className={`text-xs ${isToday ? "text-primary font-semibold" : "text-muted-foreground"}`}>
                      {day}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
