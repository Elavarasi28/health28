import React from "react";

interface GoalsProps {
  userPoints: number;
  activeCount: number;
}

const Goals: React.FC<GoalsProps> = ({ userPoints, activeCount }) => (
  <div className="flex items-center justify-between">
    <div>
      <h1 className="text-3xl font-bold text-foreground">Challenges</h1>
      <p className="text-muted-foreground">Engage with fun health-related goals</p>
    </div>
    <div className="flex items-center gap-4">
      <div className="text-center">
        <div className="text-2xl font-bold text-foreground">{userPoints}</div>
        <div className="text-sm text-muted-foreground">Total Points</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-foreground">{activeCount}</div>
        <div className="text-sm text-muted-foreground">Active</div>
      </div>
    </div>
  </div>
);

export default Goals; 