import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Dashboard } from "@/components/Dashboard";
import { Workouts } from "@/components/Workouts";
import { Meals } from "@/components/Meals";
import { Health } from "@/components/Health";
import { SymptomChecker } from "@/components/SymptomChecker";
import { AICoach } from "@/components/AICoach";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "workouts":
        return <Workouts />;
      case "meals":
        return <Meals />;
      case "health":
        return <Health />;
      case "symptoms":
        return <SymptomChecker />;
      case "chat":
        return <AICoach />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* Main Content */}
      <main className="md:ml-20 lg:ml-64 pb-24 md:pb-8">
        <div className="container max-w-6xl px-4 py-6 md:py-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Index;
