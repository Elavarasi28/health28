import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

interface BloodProps {
  glucoseData: any[];
  barSize: number;
}

const Blood: React.FC<BloodProps> = ({ glucoseData, barSize }) => (
  <Card className="h-80 flex flex-col w-full min-w-0 w-full h-80 px-2 shadow-xl hover:-translate-y-1 transition-all duration-200 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800">
    <CardHeader>
      <CardTitle>Blood Glucose</CardTitle>
    </CardHeader>
    <CardContent className="flex-1 flex items-center w-full min-w-0">
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={glucoseData} barSize={barSize}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="today" fill="#ff5722" name="Today" barSize={barSize} />
          <Bar dataKey="yesterday" fill="#b0c4de" name="Yesterday" barSize={barSize} />
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

export default Blood; 