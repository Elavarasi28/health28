import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface FitnessProps {
  setShowFitnessModal: (show: boolean) => void;
}

const Fitness: React.FC<FitnessProps> = ({ setShowFitnessModal }) => (
  <div className="flex-1 min-w-0 mb-2 lg:mb-0">
    <Card className="w-full h-80 bg-gradient-to-br from-[#0a1a3a] to-[#1a2a5a] text-white cursor-pointer" onClick={() => setShowFitnessModal(true)}>
      <CardHeader className="flex justify-between items-center">
        <CardTitle>Fitness Goals</CardTitle>
        <Button variant="link" className="text-xs p-0 text-white">See all</Button>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center h-full">
        <svg width="180" height="90" viewBox="0 0 180 90" fill="none">
          <path d="M0 70 Q 45 10 90 70 T 180 70" stroke="#4f8cff" strokeWidth="2" fill="none" />
        </svg>
        <div className="text-5xl font-bold mt-2">80%</div>
        <Button className="mt-4 w-full bg-white/10 text-white rounded-full">Complete 5 Workouts <span className="ml-2">4/5</span></Button>
      </CardContent>
    </Card>
  </div>
);

export default Fitness; 