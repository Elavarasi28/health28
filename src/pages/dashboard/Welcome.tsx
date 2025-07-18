import React from "react";
import { Button } from "@/components/ui/button";

interface WelcomeProps {
  user: { name: string };
  setShowScheduleModal: (show: boolean) => void;
}

const Welcome: React.FC<WelcomeProps> = ({ user, setShowScheduleModal }) => (
  <section className="w-full mb-4">
    <div className="flex flex-col sm:flex-row flex-wrap items-center sm:items-stretch justify-between w-full gap-2 bg-transparent min-h-0 py-2 overflow-x-hidden">
      {/* Greeting */}
      <h1 className="text-2xl md:text-3xl font-bold flex-1 text-foreground whitespace-nowrap">Welcome, {user.name || 'Guest'}!</h1>
      {/* Stats and Button */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-1 justify-end w-full min-w-0">
        {/* Glucose lvl */}
        <div className="flex flex-col items-center px-2 sm:px-4">
          <span className="text-xs text-muted-foreground mb-1">Glucose lvl</span>
          <span className="text-2xl font-bold text-foreground">102 <span className="text-base font-normal">mg/dL</span></span>
        </div>
        {/* Divider */}
        <div className="hidden sm:block h-8 w-px bg-border mx-4" />
        {/* Water intake */}
        <div className="flex flex-col items-center px-2 sm:px-4">
          <span className="text-xs text-muted-foreground mb-1">Water intake</span>
          <span className="text-2xl font-bold text-foreground">2.2 <span className="text-base font-normal">Liters</span></span>
        </div>
        {/* Divider */}
        <div className="hidden sm:block h-8 w-px bg-transparent mx-1" />
        {/* Schedule Visit Button */}
        <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-6 py-2 text-base font-semibold whitespace-nowrap shadow-md w-full sm:w-auto mt-2 sm:mt-0" onClick={() => setShowScheduleModal(true)}>
          Schedule Visit +
        </Button>
      </div>
    </div>
  </section>
);

export default Welcome; 