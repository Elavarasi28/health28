import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface AIProps {
  aiInsights: string[];
}

const AI: React.FC<AIProps> = ({ aiInsights }) => (
  <Card className="mt-6 w-full min-w-0">
    <CardHeader>
      <CardTitle>AI Insights</CardTitle>
    </CardHeader>
    <CardContent>
      <ul className="list-disc pl-6 space-y-1 text-base">
        {aiInsights.map((insight, i) => (
          <li key={i}>{insight}</li>
        ))}
      </ul>
    </CardContent>
  </Card>
);

export default AI; 