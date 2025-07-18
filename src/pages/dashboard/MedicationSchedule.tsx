import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Medication {
  name: string;
  qty: string;
  dosage: string;
  status: string;
  time: string;
}

interface MedicationScheduleProps {
  filteredMedications: Medication[];
  handleTake: (index: number) => void;
}

const MedicationSchedule: React.FC<MedicationScheduleProps> = ({ filteredMedications, handleTake }) => (
  <div className="flex-1 min-w-0 mb-2 lg:mb-0 h-full">
    <Card className="w-full h-full min-h-[420px] flex flex-col">
      <CardHeader className="flex flex-col sm:flex-row sm:justify-between">
        <div className="flex items-center justify-between w-full">
          <CardTitle>Medication Schedule</CardTitle>
        </div>
        <Button variant="link" className="text-xs p-0 self-end sm:self-auto">Any status</Button>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-x-auto">
          <table className="min-w-[400px] w-full text-xs sm:text-sm">
            <thead>
              <tr className="text-muted-foreground">
                <th className="text-left sticky-col">Medication</th>
                <th>Qty</th>
                <th>Dosage</th>
                <th>Status</th>
                <th>Time</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredMedications.map((med, idx) => (
                <tr key={med.name} className="border-t align-middle hover:bg-accent transition-colors">
                  <td className="py-3 sticky-col">{med.name}</td>
                  <td className="py-3">{med.qty}</td>
                  <td className="py-3">{med.dosage}</td>
                  <td className="py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      med.status === "Missed" ? "bg-red-100 text-red-600" :
                      med.status === "Taken" ? "bg-green-100 text-green-600" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>{med.status}</span>
                  </td>
                  <td className="py-3">{med.time}</td>
                  <td className="py-3 text-center">
                    {med.status === "Taken" ? (
                      <Button size="sm" className="rounded-full bg-gray-300 text-gray-500 cursor-not-allowed" disabled>
                        Taken
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        className="rounded-full cursor-pointer"
                        onClick={() => handleTake(idx)}
                      >
                        Take
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default MedicationSchedule; 