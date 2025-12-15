import { useState, useEffect } from "react";
import { Droplets, Plus, Minus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export function HydrationCard() {
  const [glasses, setGlasses] = useState(0);
  const { user } = useAuth();
  const today = new Date().toISOString().split("T")[0];
  const goal = 8;

  useEffect(() => {
    if (user) {
      loadHydration();
    }
  }, [user]);

  const loadHydration = async () => {
    if (!user) return;

    const { data } = await supabase
      .from("hydration_entries")
      .select("glasses")
      .eq("user_id", user.id)
      .eq("entry_date", today)
      .maybeSingle();

    if (data) {
      setGlasses(data.glasses);
    }
  };

  const updateGlasses = async (newValue: number) => {
    const clampedValue = Math.max(0, Math.min(12, newValue));
    setGlasses(clampedValue);

    if (user) {
      await supabase
        .from("hydration_entries")
        .upsert({
          user_id: user.id,
          glasses: clampedValue,
          entry_date: today,
        }, { onConflict: "user_id,entry_date" });
    }
  };

  const progress = Math.min((glasses / goal) * 100, 100);

  return (
    <div className="glass-card rounded-2xl p-5 animate-slide-up" style={{ animationDelay: "0.3s" }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
          <Droplets className="w-5 h-5 text-blue-500" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Hidratação</h3>
          <p className="text-xs text-muted-foreground">Meta: {goal} copos</p>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 my-4">
        <button
          onClick={() => updateGlasses(glasses - 1)}
          className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-border transition-colors"
        >
          <Minus className="w-5 h-5" />
        </button>
        
        <div className="text-center">
          <div className="text-4xl font-bold text-foreground">{glasses}</div>
          <div className="text-sm text-muted-foreground">copos</div>
        </div>
        
        <button
          onClick={() => updateGlasses(glasses + 1)}
          className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="h-3 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {glasses >= goal && (
        <p className="text-center text-sm text-blue-600 font-medium mt-3">
          🎉 Meta atingida!
        </p>
      )}
    </div>
  );
}
