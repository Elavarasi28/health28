import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface FitnessProps {
  setShowFitnessModal: (show: boolean) => void;
}

const Fitness: React.FC<FitnessProps> = ({ setShowFitnessModal }) => {
  // Animation state
  const [progress, setProgress] = useState(0);
  const target = 80; // Target percent
  const totalLength = 251; // Circumference for r=40

  const [showModal, setShowModal] = useState(false);
  const [completed, setCompleted] = useState(4); // or your real data

  useEffect(() => {
    let current = 0;
    const step = () => {
      if (current < target) {
        current += 1;
        setProgress(current);
        setTimeout(step, 12); // Animation speed
      }
    };
    step();
    // eslint-disable-next-line
  }, []);
  
  return (
    <div className="flex-1 min-w-0 mb-2 lg:mb-0">
      <motion.div
             initial={{ scale: 0.8, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             transition={{ duration: 0.6 }}>

      <Card
        className="w-full h-80 bg-gradient-to-br from-[#0a1a3a] to-[#1a2a5a] text-white cursor-pointer shadow-2xl hover:-translate-y-1 transition-all duration-200 border border-gray-200 dark:border-zinc-800"
        onClick={() => setShowFitnessModal(true)}
      >
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Fitness Goals</CardTitle>
          <Button
            variant="link"
            className="text-xs p-0 text-white"
            onClick={e => {
              e.stopPropagation();
              setShowModal(true);
            }}
          >
            See all
          </Button>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-full">
          <div className="relative w-32 h-32">
            <div className="absolute inset-0 rounded-full bg-blue-400 blur-2xl opacity-10 animate-ping"></div>

            {/* Spinning segmented glow ring */}
            <svg
              className="animate-spin-slow absolute top-0 left-0 w-full h-full"
              viewBox="0 0 100 100"
            >
              <defs>
                <radialGradient id="glow" r="80%" cx="50%" cy="50%">
                  <stop offset="0%" stopColor="#4f8cff" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#4f8cff" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="url(#glow)"
                strokeWidth="10"
                fill="none"
                strokeDasharray="10 10"
                strokeLinecap="round"
              />
            </svg>

            {/* Background and animated progress ring */}
            <svg
              className="absolute top-0 left-0 w-full h-full"
              viewBox="0 0 100 100"
            >
              <defs>
                {/* Neon Glow Filter */}
                <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#00eaff" />
                  <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#00eaff" />
                </filter>
              </defs>
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#1e293b"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#00eaff"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${(progress / 100) * totalLength} ${totalLength}`}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
                style={{ transition: "stroke-dasharray 0.2s linear" }}
                filter="url(#neon-glow)"
              />
            </svg>

            {/* Animated percentage */}
            <div
              className="absolute inset-0 flex items-center justify-center text-white text-xl font-bold"
              style={{
                textShadow: "0 0 8pxrgb(216, 252, 255), 0 0 16px #00eaff, 0 0 32px #00eaff"
              }}
            >
              {progress}%
            </div>
          </div>

          <Button
            className="mt-6 w-full bg-white/10 text-white rounded-full"
            onClick={e => {
              e.stopPropagation();
              if (completed < 5) {
                setCompleted(completed + 1);
                alert("Workout marked as complete!"); // Replace with toast if you have one
              }
            }}
          >
            Complete 5 Workouts <span className="ml-2">{completed}/5</span>
          </Button>
        </CardContent>
      </Card>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full text-black">
            <h2 className="text-lg font-bold mb-4">All Fitness Goals</h2>
            <p>Here you can show more detailed fitness stats, history, or a list of all goals.</p>
            <button
              className="mt-6 px-4 py-2 bg-blue-500 text-white rounded"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </motion.div>
  </div>
);
};

export default Fitness;
