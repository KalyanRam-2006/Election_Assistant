import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const candidates = [
  { id: 1, name: "CANDIDATE ALPHA", party: "INDEPENDENT", icon: "lightbulb" },
  { id: 2, name: "LEADER BRAVO", party: "PROGRESSIVE FRONT", icon: "rocket_launch" },
  { id: 3, name: "MEMBER CHARLIE", party: "UNITY COALITION", icon: "psychology" },
  { id: 4, name: "THE GREEN PARTY", party: "ENVIRONMENTALISTS", icon: "eco" },
  { id: 5, name: "DEFENSE PARTY", party: "NATIONAL SECURITY", icon: "security" },
  { id: 16, name: "NOTA", party: "NONE OF THE ABOVE", icon: "cancel" },
];

export function VotingDemo() {
  const [selectedId, setSelectedId] = useState(null);
  const [isVoting, setIsVoting] = useState(false);
  const [showVVPAT, setShowVVPAT] = useState(false);
  const [votedCandidate, setVotedCandidate] = useState(null);

  const handleVote = (candidate) => {
    if (isVoting) return;
    setIsVoting(true);
    setSelectedId(candidate.id);
    
    // Simulate EVM Beep and VVPAT printing
    setTimeout(() => {
      setVotedCandidate(candidate);
      setShowVVPAT(true);
      
      // VVPAT slip stays for 7 seconds (as per real EVM)
      setTimeout(() => {
        setShowVVPAT(false);
        setIsVoting(false);
        setSelectedId(null);
        alert("Vote recorded successfully. The VVPAT slip has dropped into the collection box.");
      }, 7000);
    }, 1000);
  };

  return (
    <div className="space-y-12 py-8" id="evm">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold text-white font-headline">Mock EVM Simulation</h2>
        <p className="text-slate-400 max-w-2xl mx-auto">Experience the digital voting process. Select a candidate on the Ballot Unit and verify your vote on the VVPAT unit.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-6xl mx-auto">
        
        {/* VVPAT Unit */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card rounded-3xl p-8 border-indigo-500/20 shadow-2xl relative overflow-hidden bg-slate-900/40">
            <div className="absolute top-4 right-4 text-[9px] font-bold text-slate-600 tracking-widest font-label-caps">VVPAT-702X</div>
            
            <div className="flex flex-col items-center gap-8">
              <div className="text-center">
                <p className="text-[10px] font-bold text-indigo-400 font-label-caps tracking-[0.2em] mb-1">VVPAT UNIT</p>
                <p className="text-xs text-slate-500">Voter Verifiable Paper Audit Trail</p>
              </div>

              {/* VVPAT Viewing Window */}
              <div className="w-full aspect-[3/4] bg-slate-950 rounded-2xl border-4 border-slate-800 shadow-inner p-6 flex flex-col items-center justify-start overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
                
                <AnimatePresence>
                  {showVVPAT && votedCandidate && (
                    <motion.div 
                      initial={{ y: -300 }}
                      animate={{ y: 20 }}
                      exit={{ y: 500 }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="w-full bg-white aspect-[3/4] p-6 text-slate-900 shadow-2xl flex flex-col items-center justify-between"
                      style={{ backgroundImage: "radial-gradient(#e2e8f0 1px, transparent 1px)", backgroundSize: "4px 4px" }}
                    >
                      <div className="w-full flex justify-between items-center border-b border-slate-200 pb-2">
                        <span className="text-[8px] font-bold uppercase">Election 2024</span>
                        <span className="text-[8px] font-mono">#VOTE_{votedCandidate.id}</span>
                      </div>
                      
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 flex items-center justify-center bg-slate-100 rounded-lg text-slate-800">
                          <span className="material-symbols-outlined text-4xl">{votedCandidate.icon}</span>
                        </div>
                        <div className="text-center">
                          <h5 className="text-sm font-black leading-tight uppercase">{votedCandidate.name}</h5>
                          <p className="text-[10px] text-slate-500 font-bold mt-1">{votedCandidate.party}</p>
                        </div>
                      </div>

                      <div className="w-full border-t border-slate-200 pt-2 text-center">
                        <span className="text-[7px] font-mono opacity-50">VERIFIED_CAST_LOG_7702</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {!showVVPAT && (
                  <div className="flex flex-col items-center justify-center h-full text-slate-800 opacity-20">
                    <span className="material-symbols-outlined text-6xl">print</span>
                    <p className="text-[10px] font-bold mt-2">WAITING FOR VOTE</p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full shadow-[0_0_10px_rgba(79,219,200,0.5)] transition-colors duration-500 ${isVoting ? "bg-amber-500 shadow-amber-500/50" : "bg-tertiary shadow-tertiary/50"}`}></div>
                <span className="text-[10px] font-bold text-slate-400 font-label-caps">{isVoting ? "PROCESSING..." : "READY"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ballot Unit */}
        <div className="lg:col-span-8">
          <div className="bg-slate-800 border-[12px] border-slate-700 rounded-[48px] p-6 shadow-2xl shadow-black relative">
            <div className="bg-slate-900/50 rounded-3xl px-8 py-6 mb-6 flex justify-between items-center border-b border-white/5">
              <div>
                <p className="text-[10px] font-bold text-indigo-400 font-label-caps tracking-[0.3em] mb-1">ELECTION COMMISSION</p>
                <h3 className="text-xl font-bold text-white font-headline uppercase">Ballot Unit - BU-5001</h3>
              </div>
              <div className="flex gap-4">
                <div className="text-center px-4 py-2 bg-slate-950/80 rounded-xl border border-white/5">
                  <p className="text-[8px] font-bold text-slate-500 uppercase">Power</p>
                  <div className="w-3 h-3 rounded-full bg-green-500 mx-auto mt-1 shadow-[0_0_10px_rgba(34,197,94,0.6)]"></div>
                </div>
                <div className="text-center px-4 py-2 bg-slate-950/80 rounded-xl border border-white/5">
                  <p className="text-[8px] font-bold text-slate-500 uppercase">Busy</p>
                  <div className={`w-3 h-3 rounded-full mx-auto mt-1 transition-all duration-300 ${isVoting ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.6)]" : "bg-red-950 border border-white/5"}`}></div>
                </div>
              </div>
            </div>

            <div className="space-y-1 bg-slate-200 rounded-2xl overflow-hidden border-4 border-slate-900 shadow-inner">
              {candidates.map((candidate) => (
                <div 
                  key={candidate.id} 
                  className={`flex items-center transition-colors border-b border-slate-300 last:border-0 ${
                    selectedId === candidate.id ? "bg-indigo-50" : "bg-white"
                  }`}
                >
                  <div className={`w-14 h-16 flex items-center justify-center font-black text-xl border-r border-slate-200 ${
                    selectedId === candidate.id ? "bg-indigo-100 text-indigo-600" : "bg-slate-100 text-slate-800"
                  }`}>
                    {candidate.id}
                  </div>
                  <div className="flex-1 px-8 flex items-center gap-8">
                    <div className="w-10 h-10 flex items-center justify-center text-slate-900">
                      <span className="material-symbols-outlined text-3xl">{candidate.icon}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-slate-900 font-bold text-sm tracking-tight uppercase">{candidate.name}</span>
                      <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{candidate.party}</span>
                    </div>
                  </div>
                  <div className="w-28 h-16 flex items-center justify-center bg-slate-50 border-l border-slate-200 relative">
                    {selectedId === candidate.id && (
                      <div className="absolute inset-0 bg-red-500/10 flex items-center justify-center z-10 pointer-events-none">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-600 shadow-[0_0_15px_red] animate-pulse"></div>
                      </div>
                    )}
                    <button 
                      onClick={() => handleVote(candidate)}
                      disabled={isVoting}
                      className={`w-12 h-12 rounded-lg transition-all flex items-center justify-center shadow-lg active:scale-95 ${
                        isVoting && selectedId !== candidate.id ? "opacity-30 grayscale" : "hover:scale-105"
                      } ${
                        selectedId === candidate.id ? "bg-blue-900 shadow-inner" : "bg-blue-700"
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-full border-2 transition-opacity ${
                        selectedId === candidate.id ? "border-white/40" : "border-white/20"
                      }`}></div>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-between items-center px-4">
              <div className="text-[9px] font-mono text-slate-600">SER: EVM-X-990-2024</div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-600 text-sm">verified_user</span>
                <span className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.2em]">Encrypted Session</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
