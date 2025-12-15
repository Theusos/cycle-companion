import { Phase, phaseData } from "@/types/app";

interface PhaseCardProps {
  cycleDay: number;
  currentPhase: Phase;
}

export function PhaseCard({ cycleDay, currentPhase }: PhaseCardProps) {
  const phase = phaseData[currentPhase];
  
  return (
    <div className={`${phase.gradient} rounded-3xl p-6 text-white shadow-glow animate-slide-up`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className="text-4xl mb-2 block">{phase.emoji}</span>
          <h2 className="text-xl font-display font-semibold">{phase.name}</h2>
          <p className="text-white/80 text-sm mt-1">{phase.description}</p>
        </div>
        <div className="text-right">
          <div className="text-5xl font-bold">{cycleDay}</div>
          <div className="text-white/70 text-sm">dia do ciclo</div>
        </div>
      </div>
      
      <div className="flex gap-2 mt-4 flex-wrap">
        {["Menstrual", "Folicular", "Ovulação", "Lútea"].map((phaseName, idx) => {
          const phaseKey = ["menstrual", "follicular", "ovulation", "luteal"][idx];
          const isActive = currentPhase === phaseKey;
          return (
            <div
              key={phaseName}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                isActive
                  ? "bg-white/30 text-white"
                  : "bg-white/10 text-white/60"
              }`}
            >
              {phaseName}
            </div>
          );
        })}
      </div>
    </div>
  );
}
