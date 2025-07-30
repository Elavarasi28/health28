import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

interface AIProps {
  aiInsights: string[];
}

const compareTabs = ["Today", "Yesterday"];

const todayInsights = [
  "Your sugar spiked after lunch consistently this week.",
  "You sleep longer on weekends.",
  "Heart rate is slightly higher on Fridays.",
  "Step count peaked on Saturday!"
];

const yesterdayInsights = [
  "You skipped your evening walk yesterday.",
  "Water intake was below average.",
  "You went to bed later than usual.",
  "Heart rate was steady throughout the day."
];

const AI: React.FC<AIProps> = () => {
  const [selectedTab, setSelectedTab] = useState("Today");
  const insights = selectedTab === "Today" ? todayInsights : yesterdayInsights;

  return (
    <Card className="mt-6 w-full min-w-0 text-left bg-gray-100 shadow-2xl rounded-2xl hover:-translate-y-1 transition-all duration-200 hover:shadow-2xl" style={{ backgroundImage: 'linear-gradient(135deg,rgb(199, 211, 237) 0px,rgb(184, 197, 223) 8px,rgb(184, 196, 220) 8px,rgb(190, 202, 227) 16px)' }}>
      <CardHeader className="text-left">
        <CardTitle className="text-center text-3xl font-bold">AI Insights</CardTitle>
        {/* Compare Toggle */}
        <div className="flex justify-center mt-4 mb-2">
          <div className="relative flex bg-white rounded-full shadow-inner p-0.5 w-40 h-8">
            {compareTabs.map(tab => (
              <button
                key={tab}
                className={`flex-1 px-2 py-1 rounded-full z-10 font-semibold text-sm transition-colors duration-200 ${selectedTab === tab ? 'text-blue-700' : 'text-gray-500'}`}
                onClick={() => setSelectedTab(tab)}
                style={{ position: 'relative' }}
              >
                {tab}
                {selectedTab === tab && (
                  <motion.div
                    layoutId="compareToggle"
                    className="absolute inset-0 bg-blue-100 rounded-full -z-10"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
    </CardHeader>
      <CardContent className="text-left">
        <AnimatePresence mode="wait">
          <motion.ul
            key={selectedTab}
            className="list-disc pl-6 space-y-1 text-bold text-xl text-left"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {insights.map((insight, i) => (
          <li key={i}>{insight}</li>
        ))}
          </motion.ul>
        </AnimatePresence>
    </CardContent>
  </Card>
);
};

export default AI; 