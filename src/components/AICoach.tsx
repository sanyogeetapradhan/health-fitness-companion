import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  Bot, 
  User, 
  Sparkles,
  Apple,
  Dumbbell,
  Heart,
  Loader2
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const quickPrompts = [
  { label: "Healthy breakfast ideas", icon: <Apple className="w-4 h-4" /> },
  { label: "Exercises for beginners", icon: <Dumbbell className="w-4 h-4" /> },
  { label: "How to improve sleep", icon: <Heart className="w-4 h-4" /> },
  { label: "Low-calorie dinner recipes", icon: <Sparkles className="w-4 h-4" /> },
];

// Simulated AI responses for demo
const aiResponses: Record<string, string> = {
  "healthy breakfast": `Great question! Here are some healthy breakfast ideas:

🥣 **Overnight Oats** - Mix oats with Greek yogurt, chia seeds, and berries. Prep the night before for a quick morning meal.

🥑 **Avocado Toast** - Whole grain bread topped with mashed avocado, a poached egg, and a sprinkle of seeds.

🍌 **Smoothie Bowl** - Blend frozen banana, spinach, and almond milk. Top with granola and fresh fruit.

**Pro tip:** Aim for a balance of protein (15-20g), complex carbs, and healthy fats to keep you energized until lunch!`,

  "exercises for beginners": `Here's a beginner-friendly workout routine:

**Warm-up (5 min):**
- March in place
- Arm circles
- Gentle stretches

**Main Workout (20 min):**
1. 🦵 **Bodyweight Squats** - 3 sets of 10
2. 💪 **Wall Push-ups** - 3 sets of 8
3. 🧘 **Plank** - Hold 20-30 seconds, 3 times
4. 🚶 **Walking Lunges** - 2 sets of 10 each leg
5. 🦵 **Glute Bridges** - 3 sets of 12

**Cool-down (5 min):**
- Gentle stretching
- Deep breathing

Start 2-3 times per week and gradually increase intensity!`,

  "improve sleep": `Here are evidence-based tips for better sleep:

🌙 **Sleep Hygiene Basics:**
1. **Consistent Schedule** - Same bedtime/wake time daily, even weekends
2. **Dark Room** - Use blackout curtains or sleep mask
3. **Cool Temperature** - Keep room at 65-68°F (18-20°C)
4. **No Screens** - Avoid blue light 1 hour before bed

🍵 **Evening Routine:**
- Light dinner 3 hours before bed
- Herbal tea (chamomile, valerian)
- Warm bath or shower
- Light stretching or meditation

⚠️ **Avoid:**
- Caffeine after 2 PM
- Alcohol close to bedtime
- Large meals late at night
- Intense exercise within 3 hours of sleep`,

  "low-calorie dinner": `Here are delicious low-calorie dinner ideas (under 500 cal):

🥗 **Grilled Chicken Salad** (~350 cal)
- Grilled chicken breast, mixed greens, cherry tomatoes, cucumber, light vinaigrette

🐟 **Baked Salmon with Vegetables** (~450 cal)
- Salmon fillet with roasted broccoli, asparagus, and lemon

🍝 **Zucchini Noodles with Marinara** (~280 cal)
- Spiralized zucchini with homemade tomato sauce and lean turkey meatballs

🥣 **Cauliflower Rice Stir-fry** (~320 cal)
- Riced cauliflower with mixed vegetables, tofu or shrimp, soy sauce

**Tips:** Use herbs and spices instead of heavy sauces, and fill half your plate with non-starchy vegetables!`,

  "default": `I'm your AI Health Coach! I can help you with:

🍎 **Nutrition Advice** - Healthy meal planning, balanced diets, calorie-conscious recipes

💪 **Exercise Guidance** - Workout routines, exercise form, fitness goals

😴 **Wellness Tips** - Sleep improvement, stress management, hydration

🏥 **General Health** - Healthy habits, lifestyle improvements

What would you like to know more about?`
};

export function AICoach() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hi! I'm your AI Health Coach 🏋️‍♂️ I can help you with dietary advice, exercise suggestions, and general wellness tips. What would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes("breakfast") || lowerMessage.includes("morning meal")) {
      return aiResponses["healthy breakfast"];
    }
    if (lowerMessage.includes("exercise") || lowerMessage.includes("workout") || lowerMessage.includes("beginner")) {
      return aiResponses["exercises for beginners"];
    }
    if (lowerMessage.includes("sleep") || lowerMessage.includes("insomnia") || lowerMessage.includes("rest")) {
      return aiResponses["improve sleep"];
    }
    if (lowerMessage.includes("dinner") || lowerMessage.includes("low-calorie") || lowerMessage.includes("recipe")) {
      return aiResponses["low-calorie dinner"];
    }
    
    return aiResponses["default"];
  };

  const handleSend = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getAIResponse(text),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-6rem)]"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-4">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Bot className="w-8 h-8 text-primary" />
          AI Health Coach
        </h1>
        <p className="text-muted-foreground">Get personalized dietary advice and exercise suggestions</p>
      </motion.div>

      {/* Chat Area */}
      <motion.div variants={itemVariants} className="flex-1 overflow-hidden">
        <Card className="h-full flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === "assistant" 
                      ? "gradient-health text-primary-foreground" 
                      : "bg-secondary"
                  }`}>
                    {message.role === "assistant" ? (
                      <Bot className="w-5 h-5" />
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                  </div>
                  <div className={`max-w-[80%] rounded-2xl p-4 ${
                    message.role === "assistant"
                      ? "bg-secondary"
                      : "gradient-health text-primary-foreground"
                  }`}>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                    <p className={`text-xs mt-2 ${
                      message.role === "assistant" ? "text-muted-foreground" : "text-primary-foreground/70"
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3"
              >
                <div className="w-8 h-8 rounded-full gradient-health flex items-center justify-center">
                  <Bot className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="bg-secondary rounded-2xl p-4">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    <span className="text-sm text-muted-foreground">Thinking...</span>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          {messages.length === 1 && (
            <div className="px-4 pb-2">
              <p className="text-sm text-muted-foreground mb-2">Quick questions:</p>
              <div className="flex flex-wrap gap-2">
                {quickPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handleSend(prompt.label)}
                    className="flex items-center gap-2 px-3 py-2 rounded-full bg-secondary text-sm hover:bg-secondary/80 transition-colors"
                  >
                    {prompt.icon}
                    {prompt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <CardContent className="p-4 border-t border-border">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about diet, exercise, or health..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button 
                type="submit" 
                size="icon"
                className="gradient-health text-primary-foreground shadow-glow"
                disabled={!input.trim() || isLoading}
              >
                <Send className="w-5 h-5" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
