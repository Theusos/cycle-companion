import { Flame, Heart } from "lucide-react";

interface HeaderProps {
  userName: string;
  streak: number;
}

export function Header({ userName, streak }: HeaderProps) {
  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  return (
    <header className="px-4 pt-6 pb-4">
      <div className="flex items-center justify-between">
        <div className="animate-fade-in">
          <p className="text-muted-foreground text-sm">{greeting()}</p>
          <h1 className="text-2xl font-display font-semibold text-foreground flex items-center gap-2">
            {userName}
            <Heart className="w-5 h-5 text-primary fill-primary" />
          </h1>
        </div>
        
        {streak > 0 && (
          <div className="flex items-center gap-2 bg-secondary/30 px-4 py-2 rounded-2xl animate-scale-in">
            <Flame className="w-5 h-5 text-secondary" />
            <span className="font-semibold text-secondary-foreground">{streak}</span>
            <span className="text-sm text-muted-foreground">dias</span>
          </div>
        )}
      </div>
    </header>
  );
}
