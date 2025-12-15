import { useState, useEffect } from "react";
import { ChecklistItem, defaultChecklist } from "@/types/app";
import { Check, ListChecks } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface ChecklistCardProps {
  initialChecks?: ChecklistItem[];
}

export function ChecklistCard({ initialChecks = defaultChecklist }: ChecklistCardProps) {
  const [items, setItems] = useState<ChecklistItem[]>(initialChecks);
  const { user } = useAuth();
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (user) {
      loadChecklist();
    }
  }, [user]);

  const loadChecklist = async () => {
    if (!user) return;

    const { data } = await supabase
      .from("daily_checklist")
      .select("items")
      .eq("user_id", user.id)
      .eq("entry_date", today)
      .maybeSingle();

    if (data?.items && Array.isArray(data.items)) {
      setItems(data.items as unknown as ChecklistItem[]);
    }
  };

  const toggleItem = async (id: string) => {
    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setItems(updatedItems);

    if (user) {
      const { data: existing } = await supabase
        .from("daily_checklist")
        .select("id")
        .eq("user_id", user.id)
        .eq("entry_date", today)
        .maybeSingle();

      if (existing) {
        await supabase
          .from("daily_checklist")
          .update({ items: JSON.parse(JSON.stringify(updatedItems)) })
          .eq("id", existing.id);
      } else {
        await supabase
          .from("daily_checklist")
          .insert({
            user_id: user.id,
            items: JSON.parse(JSON.stringify(updatedItems)),
            entry_date: today,
          });
      }
    }
  };

  const completedCount = items.filter((item) => item.checked).length;
  const progress = (completedCount / items.length) * 100;

  return (
    <div className="glass-card rounded-2xl p-5 animate-slide-up" style={{ animationDelay: "0.2s" }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
            <ListChecks className="w-5 h-5 text-accent-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Checklist do dia</h3>
            <p className="text-xs text-muted-foreground">
              {completedCount}/{items.length} completos
            </p>
          </div>
        </div>
        <div className="text-2xl font-bold text-primary">{Math.round(progress)}%</div>
      </div>

      <div className="h-2 bg-muted rounded-full overflow-hidden mb-4">
        <div
          className="h-full gradient-primary rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => toggleItem(item.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                item.checked
                  ? "bg-primary/10 text-foreground"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                  item.checked
                    ? "bg-primary text-primary-foreground"
                    : "border-2 border-border"
                }`}
              >
                {item.checked && <Check className="w-4 h-4" />}
              </div>
              <span className={`text-sm ${item.checked ? "line-through opacity-70" : ""}`}>
                {item.label}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
