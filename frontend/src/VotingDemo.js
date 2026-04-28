import { motion } from "framer-motion";
import { useState } from "react";

export function VotingDemo() {
  const [selected, setSelected] = useState(null);
  const [voted, setVoted] = useState(false);

  const candidates = ["Party A", "Party B", "Party C"];

  return (
    <div className="mt-8 bg-white/5 backdrop-blur-lg p-5 rounded-2xl shadow-lg w-full glass-card">
      <h2 className="text-xl font-bold mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>🗳️ Try Voting Demo</h2>

      {!voted ? (
        <>
          {candidates.map((c, i) => (
            <motion.button
              key={i}
              onClick={() => setSelected(c)}
              whileTap={{ scale: 0.95 }}
              className={`block w-full p-3 mb-2 rounded-xl transition ${
                selected === c
                  ? "bg-green-500 text-white shadow-lg scale-105"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
              style={{ fontFamily: "'Inter', sans-serif", border: "1px solid rgba(255,255,255,0.1)", textAlign: "left" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>{c}</span>
                {selected === c && <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "white", boxShadow: "0 0 10px white" }}></div>}
              </div>
            </motion.button>
          ))}

          <button
            onClick={() => setVoted(true)}
            disabled={!selected}
            className="mt-4 px-4 py-2 rounded-lg text-white w-full disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, var(--primary), var(--primary-dark))", fontFamily: "'Inter', sans-serif", border: "none", cursor: selected ? "pointer" : "not-allowed", fontWeight: "600" }}
          >
            Cast Vote
          </button>
        </>
      ) : (
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center text-green-400 text-lg font-bold"
          style={{ padding: "2rem 0" }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>✅</div>
          Vote Successfully Cast!
          <div className="text-sm mt-2 text-gray-300 font-normal">
            Thank you for participating 🗳️
          </div>
        </motion.div>
      )}
    </div>
  );
}
