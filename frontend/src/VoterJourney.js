import { motion } from "framer-motion";
import { useState } from "react";

const steps = [
  { label: "Eligibility Check", icon: "how_to_reg", desc: "Ensure you are 18+ and a citizen." },
  { label: "Enrollment", icon: "app_registration", desc: "Fill Form 6 on the Voter Portal." },
  { label: "Locate Booth", icon: "location_on", desc: "Find your assigned polling station." },
  { label: "Identity Proof", icon: "badge", desc: "Keep your EPIC card or ID ready." },
  { label: "Cast Your Vote", icon: "how_to_vote", desc: "Exercise your democratic right." }
];

export function VoterJourney() {
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <div className="glass-card rounded-2xl p-8 border-indigo-500/20 shadow-xl overflow-hidden relative group">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <span className="material-symbols-outlined text-9xl">route</span>
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
            <span className="material-symbols-outlined">explore</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white font-headline">Guided Voter Journey</h2>
            <p className="text-xs text-slate-500 font-label-caps">Your path to the polling booth</p>
          </div>
        </div>

        <div className="space-y-4">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`flex items-start gap-4 p-4 rounded-xl border transition-all duration-500 ${
                i === currentStep 
                ? "bg-indigo-600/20 border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.15)]" 
                : i < currentStep 
                ? "bg-white/5 border-white/5 opacity-60" 
                : "bg-white/5 border-white/5 opacity-30"
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                i === currentStep 
                ? "bg-indigo-600 border-white/20 text-white" 
                : i < currentStep 
                ? "bg-tertiary/20 border-tertiary/30 text-tertiary" 
                : "bg-slate-900 border-white/5 text-slate-500"
              }`}>
                <span className="material-symbols-outlined text-lg">
                  {i < currentStep ? "check" : step.icon}
                </span>
              </div>
              <div className="flex-1">
                <h4 className={`text-sm font-bold ${i === currentStep ? "text-white" : "text-slate-300"}`}>{step.label}</h4>
                <p className="text-[11px] text-slate-500 leading-tight mt-0.5">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
          <p className="text-[10px] font-bold text-slate-500 font-label-caps">
            {currentStep + 1} / {steps.length} Completed
          </p>
          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
              disabled={currentStep === 0}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white disabled:opacity-30 transition-all"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button 
              onClick={() => setCurrentStep(prev => Math.min(steps.length - 1, prev + 1))}
              className="bg-indigo-600 px-6 py-2 rounded-lg font-bold text-white text-xs hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20"
            >
              {currentStep === steps.length - 1 ? "Start Over" : "Continue Journey"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
