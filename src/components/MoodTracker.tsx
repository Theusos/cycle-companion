import { useState } from "react";
import { moodOptions } from "@/types/app";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SmilePlus } from "lucide-react";

export function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [energyLevel, setEnergyLevel] = useState<number>(3);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSaveMood = async () => {
    if (!selectedMood || !user) return;
    
    setIsSaving(true);
    const { error } = await supabase
      .from("mood_entries")
      .insert({
        user_id: user.id,
        mood: selectedMood,
        energy_level: energyLevel,
        entry_date: new Date().toISOString().split("T")[0],
      });

    if (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar seu humor.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Humor registrado! 💕",
        description: "Seu humor foi salvo com sucesso.",
      });
      setSelectedMood(null);
    }
    setIsSaving(false);
  };

  return (
    <div className="glass-card rounded-2xl p-5 animate-slide-up" style={{ animationDelay: "0.4s" }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center">
          <SmilePlus className="w-5 h-5 text-pink-500" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Como você está?</h3>
          <p className="text-xs text-muted-foreground">Registre seu humor</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-4">
        {moodOptions.map((mood) => (
          <button
            key={mood.value}
            onClick={() => setSelectedMood(mood.value)}
            className={`p-3 rounded-xl flex flex-col items-center gap-1 transition-all duration-300 ${
              selectedMood === mood.value
                ? "bg-primary/20 ring-2 ring-primary scale-105"
                : "bg-muted/50 hover:bg-muted"
            }`}
          >
            <span className="text-2xl">{mood.emoji}</span>
            <span className="text-xs text-muted-foreground">{mood.label}</span>
          </button>
        ))}
      </div>

      {selectedMood && (
        <div className="space-y-4 animate-fade-in">
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">
              Nível de energia: {energyLevel}/5
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={energyLevel}
              onChange={(e) => setEnergyLevel(Number(e.target.value))}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Baixa</span>
              <span>Alta</span>
            </div>
          </div>

          <button
            onClick={handleSaveMood}
            disabled={isSaving}
            className="w-full py-3 rounded-xl gradient-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isSaving ? "Salvando..." : "Salvar humor"}
          </button>
        </div>
      )}
    </div>
  );
}
