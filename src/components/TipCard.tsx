import { Phase, phaseData } from "@/types/app";
import { Lightbulb } from "lucide-react";

interface TipCardProps {
  currentPhase: Phase;
}

export function TipCard({ currentPhase }: TipCardProps) {
  const phase = phaseData[currentPhase];
  
  return (
    <div className="glass-card rounded-2xl p-5 animate-slide-up" style={{ animationDelay: "0.1s" }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Lightbulb className="w-5 h-5 text-primary" />
        </div>
        <h3 className="font-semibold text-foreground">Dicas para hoje</h3>
      </div>
      
      <ul className="space-y-3">
        {phase.tips.map((tip, idx) => (
          <li key={idx} className="flex items-start gap-3 text-sm text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
            {tip}
          </li>
        ))}
      </ul>

      <div className="mt-5 pt-4 border-t border-border">
        <h4 className="text-sm font-medium text-foreground mb-2">🍽️ Alimentação recomendada:</h4>
        <div className="flex flex-wrap gap-2">
          {phase.foods.slice(0, 3).map((food, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-secondary/30 text-secondary-foreground text-xs rounded-full"
            >
              {food.split(":")[0]}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
