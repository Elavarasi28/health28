import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface BloodGlucoseProps {
  glucoseData: any[];
  barSize: number;
  CustomTooltip: React.FC<any>;
  CustomBar: React.FC<any>;
}

const BloodGlucose: React.FC<BloodGlucoseProps> = ({ glucoseData, barSize, CustomTooltip, CustomBar }) => (
  <div className="flex-1 min-w-0 mb-2 lg:mb-0">
    <Card className="w-full h-80 px-2">
      <CardHeader>
        <div className="flex items-center justify-between w-full">
          <CardTitle>Blood Glucose Trends</CardTitle>
          <div className="flex gap-4 text-xs">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500 inline-block" /> Today</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-200 inline-block" /> Yesterday</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-xs font-bold text-foreground mb-2 ml-2">Mg/dL</div>
        <div className="h-56 flex items-center justify-center text-gray-400 w-full">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={glucoseData}
              barGap={8}
              barCategoryGap={30}
              barSize={barSize}
              margin={{ left: 32, right: 16, top: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="time"
                type="number"
                domain={[6, 20]}
                ticks={[6, 8, 10, 12, 14, 16, 18, 20]}
                tick={{ fill: 'currentColor', fontSize: 14 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[20, 120]}
                ticks={[20, 60, 80, 100, 120]}
                tick={{ fill: 'currentColor', fontSize: 14 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={(props) => <CustomTooltip {...props} />} cursor={{ fill: '#f3f4f6', opacity: 0.5 }} />
              <Bar dataKey="today" fill="#ff5722" shape={<CustomBar fill="#ff5722" />} barSize={barSize} />
              <Bar dataKey="yesterday" fill="#b0c4de" shape={<CustomBar fill="#b0c4de" />} barSize={barSize} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default BloodGlucose; 