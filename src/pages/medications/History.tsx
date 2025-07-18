import React from "react";
import { Card } from "@/components/ui/card";

interface HistoryProps {
  medicationLogs: any[];
  medications: any[];
  getStatusIcon: (status: string) => React.ReactNode;
  getStatusText: (status: string) => string;
}

const History: React.FC<HistoryProps> = ({ medicationLogs, medications, getStatusIcon, getStatusText }) => (
  <div className="space-y-4">
    <h2 className="text-xl font-semibold text-foreground">Medication History</h2>
    <div className="space-y-2">
      {medicationLogs.slice().reverse().map((log) => {
        const medication = medications.find((med: any) => med.id === log.medicationId);
        return (
          <Card key={log.id} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground">{medication?.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {new Date(log.date).toLocaleDateString()} at {log.time}
                </p>
                {log.notes && <p className="text-xs text-muted-foreground">{log.notes}</p>}
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(log.status)}
                <span className={`text-sm font-medium ${
                  log.status === 'taken' ? 'text-green-600' :
                  log.status === 'missed' ? 'text-red-600' :
                  'text-yellow-600'
                }`}>
                  {getStatusText(log.status)}
                </span>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  </div>
);

export default History; 