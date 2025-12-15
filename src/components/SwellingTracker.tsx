import { useState } from "react";
import { swellingAreas } from "@/types/app";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Waves } from "lucide-react";

export function SwellingTracker() {
  const [level, setLevel] = useState<number>(0);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const toggleArea = (areaId: string) => {
    setSelectedAreas((prev) =>
      prev.includes(areaId)
        ? prev.filter((id) => id !== areaId)
        : [...prev, areaId]
    );
  };

  const handleSave = async () => {
    if (level === 0 || !user) return;

    setIsSaving(true);
    const { error } = await supabase
      .from("swelling_entries")
      .insert({
        user_id: user.id,
        level,
        areas: selectedAreas,
        entry_date: new Date().toISOString().split("T")[0],
      });

    if (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o registro.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Registrado! 💕",
        description: "Inchaço salvo com sucesso.",
      });
      setLevel(0);
      setSelectedAreas([]);
    }
    setIsSaving(false);
  };

  return (
    <div className="glass-card rounded-2xl p-5 animate-slide-up" style={{ animationDelay: "0.5s" }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
          <Waves className="w-5 h-5 text-purple-500" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Inchaço</h3>
          <p className="text-xs text-muted-foreground">Registre como você se sente</p>
        </div>
      </div>

      <div className="mb-4">
        <label className="text-sm text-muted-foreground mb-2 block">
          Nível de inchaço: {level}/5
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              onClick={() => setLevel(num)}
              className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                level === num
                  ? "gradient-luteal text-white"
                  : "bg-muted text-muted-foreground hover:bg-border"
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      {level > 0 && (
        <div className="animate-fade-in">
          <label className="text-sm text-muted-foreground mb-2 block">
            Áreas afetadas:
          </label>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {swellingAreas.map((area) => (
              <button
                key={area.id}
                onClick={() => toggleArea(area.id)}
                className={`py-2 px-3 rounded-xl text-sm transition-all ${
                  selectedAreas.includes(area.id)
                    ? "bg-accent text-accent-foreground"
                    : "bg-muted text-muted-foreground hover:bg-border"
                }`}
              >
                {area.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full py-3 rounded-xl gradient-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isSaving ? "Salvando..." : "Salvar registro"}
          </button>
        </div>
      )}
    </div>
  );
}
