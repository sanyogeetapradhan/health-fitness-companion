import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, 
  Dumbbell, 
  Utensils, 
  Heart, 
  Search, 
  MessageCircle,
  Menu,
  X,
  Activity
} from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: <Home className="w-5 h-5" /> },
  { id: "workouts", label: "Workouts", icon: <Dumbbell className="w-5 h-5" /> },
  { id: "meals", label: "Meals", icon: <Utensils className="w-5 h-5" /> },
  { id: "health", label: "Health", icon: <Heart className="w-5 h-5" /> },
  { id: "symptoms", label: "Symptoms", icon: <Search className="w-5 h-5" /> },
  { id: "chat", label: "AI Coach", icon: <MessageCircle className="w-5 h-5" /> },
];

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex fixed left-0 top-0 h-full w-20 lg:w-64 bg-card border-r border-border flex-col z-50">
        <div className="p-4 lg:p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-health flex items-center justify-center shadow-glow">
              <Activity className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="hidden lg:block text-xl font-bold text-foreground">VitalTrack</span>
          </div>
        </div>

        <div className="flex-1 px-3 py-4 space-y-2">
          {navItems.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                activeTab === item.id
                  ? "gradient-health text-primary-foreground shadow-glow"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {item.icon}
              <span className="hidden lg:block font-medium">{item.label}</span>
            </motion.button>
          ))}
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border z-50 px-2 py-2">
        <div className="flex items-center justify-around">
          {navItems.slice(0, 5).map((item) => (
            <motion.button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
                activeTab === item.id
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
              whileTap={{ scale: 0.9 }}
            >
              {item.icon}
              <span className="text-xs font-medium">{item.label}</span>
            </motion.button>
          ))}
          <motion.button
            onClick={() => setIsMobileMenuOpen(true)}
            className="flex flex-col items-center gap-1 px-3 py-2 text-muted-foreground"
            whileTap={{ scale: 0.9 }}
          >
            <Menu className="w-5 h-5" />
            <span className="text-xs font-medium">More</span>
          </motion.button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 bg-foreground/50 z-50"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="absolute right-0 top-0 h-full w-64 bg-card p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute top-4 right-4 p-2 text-muted-foreground"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="mt-12 space-y-2">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onTabChange(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      activeTab === item.id
                        ? "gradient-health text-primary-foreground"
                        : "text-muted-foreground hover:bg-secondary"
                    }`}
                  >
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
