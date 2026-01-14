import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Plus, 
  Utensils, 
  Apple,
  Coffee,
  Moon,
  Cookie,
  Search,
  Trash2
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

interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  serving: string;
}

interface MealEntry {
  id: string;
  mealType: string;
  food: FoodItem;
  servings: number;
  loggedAt: Date;
}

const foodDatabase: FoodItem[] = [
  { id: "1", name: "Oatmeal (1 cup)", calories: 150, protein: 5, carbs: 27, fat: 3, fiber: 4, serving: "1 cup" },
  { id: "2", name: "Banana", calories: 105, protein: 1, carbs: 27, fat: 0, fiber: 3, serving: "1 medium" },
  { id: "3", name: "Chicken Breast (grilled)", calories: 165, protein: 31, carbs: 0, fat: 4, fiber: 0, serving: "100g" },
  { id: "4", name: "Brown Rice", calories: 216, protein: 5, carbs: 45, fat: 2, fiber: 4, serving: "1 cup" },
  { id: "5", name: "Egg", calories: 72, protein: 6, carbs: 0, fat: 5, fiber: 0, serving: "1 large" },
  { id: "6", name: "Greek Yogurt", calories: 100, protein: 17, carbs: 6, fat: 1, fiber: 0, serving: "170g" },
  { id: "7", name: "Salmon (baked)", calories: 208, protein: 20, carbs: 0, fat: 13, fiber: 0, serving: "100g" },
  { id: "8", name: "Broccoli", calories: 55, protein: 4, carbs: 11, fat: 1, fiber: 5, serving: "1 cup" },
  { id: "9", name: "Almonds", calories: 164, protein: 6, carbs: 6, fat: 14, fiber: 4, serving: "28g" },
  { id: "10", name: "Apple", calories: 95, protein: 0, carbs: 25, fat: 0, fiber: 4, serving: "1 medium" },
  { id: "11", name: "Avocado", calories: 160, protein: 2, carbs: 9, fat: 15, fiber: 7, serving: "1/2 fruit" },
  { id: "12", name: "Whole Wheat Bread", calories: 81, protein: 4, carbs: 14, fat: 1, fiber: 2, serving: "1 slice" },
];

const mealTypes = [
  { id: "breakfast", label: "Breakfast", icon: <Coffee className="w-5 h-5" /> },
  { id: "lunch", label: "Lunch", icon: <Apple className="w-5 h-5" /> },
  { id: "dinner", label: "Dinner", icon: <Moon className="w-5 h-5" /> },
  { id: "snack", label: "Snack", icon: <Cookie className="w-5 h-5" /> },
];

export function Meals() {
  const [meals, setMeals] = useState<MealEntry[]>([
    { id: "1", mealType: "breakfast", food: foodDatabase[0], servings: 1, loggedAt: new Date() },
    { id: "2", mealType: "breakfast", food: foodDatabase[1], servings: 1, loggedAt: new Date() },
    { id: "3", mealType: "lunch", food: foodDatabase[2], servings: 1.5, loggedAt: new Date() },
    { id: "4", mealType: "lunch", food: foodDatabase[3], servings: 1, loggedAt: new Date() },
  ]);
  
  const [selectedMealType, setSelectedMealType] = useState("");
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [servings, setServings] = useState("1");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const dailyGoals = { calories: 2000, protein: 150, carbs: 250, fat: 65, fiber: 30 };
  
  const totals = meals.reduce(
    (acc, meal) => ({
      calories: acc.calories + meal.food.calories * meal.servings,
      protein: acc.protein + meal.food.protein * meal.servings,
      carbs: acc.carbs + meal.food.carbs * meal.servings,
      fat: acc.fat + meal.food.fat * meal.servings,
      fiber: acc.fiber + meal.food.fiber * meal.servings,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
  );

  const handleAddMeal = () => {
    if (!selectedMealType || !selectedFood) return;
    
    const newMeal: MealEntry = {
      id: Date.now().toString(),
      mealType: selectedMealType,
      food: selectedFood,
      servings: parseFloat(servings) || 1,
      loggedAt: new Date(),
    };
    
    setMeals([...meals, newMeal]);
    setSelectedMealType("");
    setSelectedFood(null);
    setServings("1");
    setIsDialogOpen(false);
  };

  const handleDeleteMeal = (id: string) => {
    setMeals(meals.filter(m => m.id !== id));
  };

  const filteredFoods = foodDatabase.filter(food => 
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getMealsByType = (type: string) => meals.filter(m => m.mealType === type);

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
          <h1 className="text-3xl font-bold">Meal Tracker</h1>
          <p className="text-muted-foreground">Log your meals and track nutrition</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-health text-primary-foreground shadow-glow">
              <Plus className="w-4 h-4 mr-2" />
              Add Food
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Log Food</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Meal Type</Label>
                <Select onValueChange={setSelectedMealType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select meal type" />
                  </SelectTrigger>
                  <SelectContent>
                    {mealTypes.map(type => (
                      <SelectItem key={type.id} value={type.id}>
                        <div className="flex items-center gap-2">
                          {type.icon}
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Search Food</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search foods..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="max-h-48 overflow-y-auto space-y-2">
                {filteredFoods.map(food => (
                  <button
                    key={food.id}
                    onClick={() => setSelectedFood(food)}
                    className={`w-full p-3 rounded-xl text-left transition-colors ${
                      selectedFood?.id === food.id 
                        ? "bg-primary/20 border-2 border-primary" 
                        : "bg-secondary hover:bg-secondary/80"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{food.name}</p>
                        <p className="text-xs text-muted-foreground">{food.serving}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{food.calories}</p>
                        <p className="text-xs text-muted-foreground">kcal</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              
              {selectedFood && (
                <>
                  <div className="space-y-2">
                    <Label>Servings</Label>
                    <Input
                      type="number"
                      step="0.5"
                      min="0.5"
                      value={servings}
                      onChange={(e) => setServings(e.target.value)}
                    />
                  </div>
                  
                  <div className="p-4 rounded-xl bg-secondary">
                    <p className="text-sm text-muted-foreground mb-2">Nutritional Info</p>
                    <div className="grid grid-cols-5 gap-2 text-center">
                      <div>
                        <p className="font-bold">{Math.round(selectedFood.calories * parseFloat(servings || "1"))}</p>
                        <p className="text-xs text-muted-foreground">kcal</p>
                      </div>
                      <div>
                        <p className="font-bold text-primary">{Math.round(selectedFood.protein * parseFloat(servings || "1"))}g</p>
                        <p className="text-xs text-muted-foreground">Protein</p>
                      </div>
                      <div>
                        <p className="font-bold text-energy">{Math.round(selectedFood.carbs * parseFloat(servings || "1"))}g</p>
                        <p className="text-xs text-muted-foreground">Carbs</p>
                      </div>
                      <div>
                        <p className="font-bold text-warning">{Math.round(selectedFood.fat * parseFloat(servings || "1"))}g</p>
                        <p className="text-xs text-muted-foreground">Fat</p>
                      </div>
                      <div>
                        <p className="font-bold text-success">{Math.round(selectedFood.fiber * parseFloat(servings || "1"))}g</p>
                        <p className="text-xs text-muted-foreground">Fiber</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
              
              <Button 
                onClick={handleAddMeal} 
                className="w-full gradient-health text-primary-foreground"
                disabled={!selectedMealType || !selectedFood}
              >
                Add to Log
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Daily Progress */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Utensils className="w-5 h-5 text-primary" />
              Daily Nutrition
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {[
                { label: "Calories", value: totals.calories, goal: dailyGoals.calories, unit: "kcal", color: "bg-calories" },
                { label: "Protein", value: totals.protein, goal: dailyGoals.protein, unit: "g", color: "bg-primary" },
                { label: "Carbs", value: totals.carbs, goal: dailyGoals.carbs, unit: "g", color: "bg-energy" },
                { label: "Fat", value: totals.fat, goal: dailyGoals.fat, unit: "g", color: "bg-warning" },
                { label: "Fiber", value: totals.fiber, goal: dailyGoals.fiber, unit: "g", color: "bg-success" },
              ].map((nutrient) => (
                <div key={nutrient.label} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{nutrient.label}</span>
                    <span className="text-sm font-medium">
                      {Math.round(nutrient.value)}/{nutrient.goal}{nutrient.unit}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${nutrient.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((nutrient.value / nutrient.goal) * 100, 100)}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Meals by Type */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mealTypes.map((mealType) => {
          const mealEntries = getMealsByType(mealType.id);
          const mealCalories = mealEntries.reduce((sum, m) => sum + m.food.calories * m.servings, 0);
          
          return (
            <motion.div key={mealType.id} variants={itemVariants}>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {mealType.icon}
                      {mealType.label}
                    </div>
                    <span className="text-sm font-normal text-muted-foreground">
                      {Math.round(mealCalories)} kcal
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {mealEntries.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4 text-sm">No items logged</p>
                  ) : (
                    mealEntries.map((entry) => (
                      <div
                        key={entry.id}
                        className="flex items-center gap-3 p-3 rounded-xl bg-secondary group"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-sm">{entry.food.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {entry.servings !== 1 && `${entry.servings}x `}{entry.food.serving}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-sm">{Math.round(entry.food.calories * entry.servings)}</p>
                          <p className="text-xs text-muted-foreground">kcal</p>
                        </div>
                        <button
                          onClick={() => handleDeleteMeal(entry.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
