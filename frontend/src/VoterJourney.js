import { motion } from "framer-motion";
import { useState } from "react";

const steps = [
  "Check Eligibility",
  "Register to Vote",
  "Find Polling Booth",
  "Voting Day",
  "You're Ready!"
];

export function VoterJourney() {
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <div className="mt-8 bg-white/5 backdrop-blur-lg p-5 rounded-2xl shadow-lg w-full glass-card">
      <h2 className="text-xl font-bold mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>🧭 First-Time Voter Journey</h2>

      {steps.map((step, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: 50 }}
          animate={{
            opacity: 1,
            x: 0,
            scale: i === currentStep ? 1.05 : 1
          }}
          transition={{ delay: i * 0.15 }}
          className={`p-3 rounded-xl mb-3 transition-all ${i === currentStep
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-white/10 text-gray-300"
            }`}
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {i < currentStep ? "✅ " : i === currentStep ? "👉 " : "🔒 "}
          {step}
        </motion.div>
      ))}

      <button
        onClick={() => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))}
        className="mt-3 px-4 py-2 rounded-lg text-white w-full hover:scale-105 transition"
        style={{ background: "linear-gradient(135deg, var(--primary), var(--primary-dark))", fontFamily: "'Inter', sans-serif", border: "none", cursor: "pointer", fontWeight: "600" }}
      >
        {currentStep === steps.length - 1 ? "Completed 🎉" : "Next Step →"}
      </button>
    </div>
  );
}
