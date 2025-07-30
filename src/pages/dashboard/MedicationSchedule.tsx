import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";

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
  statusFilter: string;
  onStatusChange: (status: string) => void;
}

const MedicationSchedule: React.FC<MedicationScheduleProps> = ({ filteredMedications, handleTake, statusFilter, onStatusChange }) => (
  <div className="flex-1 min-w-0 mb-2 lg:mb-0 h-full">
    <Card className="w-full h-full min-h-[420px] flex flex-col shadow-2xl hover:-translate-y-1 transition-all duration-200 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800">
      <CardHeader className="flex flex-col sm:flex-row sm:justify-between">
        <div className="flex items-center justify-between w-full">
          <CardTitle>Medication Schedule</CardTitle>
        </div>
        <select
          value={statusFilter}
          onChange={e => onStatusChange(e.target.value)}
          className="text-xs p-0 self-end sm:self-auto bg-transparent outline-none border-none cursor-pointer"
        >
          <option value="any">Any status</option>
          <option value="Missed">Missed</option>
          <option value="Taken">Taken</option>
          <option value="Upcoming">Upcoming</option>
        </select>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-x-auto">
          <table className="min-w-full w-full text-xs sm:text-sm table-fixed">
            <colgroup>
              <col className="w-1/4" />
              <col className="w-1/6" />
              <col className="w-1/6" />
              <col className="w-1/6" />
              <col className="w-1/6" />
              <col className="w-1/6" />
            </colgroup>
            <thead>
              <tr className="text-muted-foreground">
                <th className="text-left sticky left-0 bg-white dark:bg-zinc-900 z-10">Medication</th>
                <th className="text-left pl-2">Qty</th>
                <th className="text-left pl-2">Dosage</th>
                <th className="text-left hidden sm:table-cell pl-2">Status</th>
                <th className="text-left pl-2">Time</th>
                <th className="text-left pl-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredMedications.map((med, idx) => {
                // Find the indexes of the second and third upcoming
                const upcomingIndexes = filteredMedications
                  .map((m, i) => m.status === "Upcoming" ? i : -1)
                  .filter(i => i !== -1);
                const isSecondOrThirdUpcoming = (upcomingIndexes[1] === idx || upcomingIndexes[2] === idx);
                return (
                  <motion.tr
                    key={med.name}
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="border-t align-middle hover:bg-accent transition-colors"
                  >
                    <td className="py-3 sticky left-0 bg-white dark:bg-zinc-900 z-10 text-left">{med.name}</td>
                    <td className="py-3 pl-2 text-left">{med.qty}</td>
                    <td className="py-3 pl-2 text-left">{med.dosage}</td>
                    <td className="py-3 pl-2 text-left hidden sm:table-cell">
                      <span className={`text-xs px-2 py-0.5 pl-2 rounded-full ${
                        med.status === "Missed" ? "bg-red-100 text-red-600" :
                        med.status === "Taken" ? "bg-green-100 text-green-600" :
                        "bg-yellow-100 text-yellow-700 "
                      }`}>{med.status}</span>
                    </td>
                    <td className="py-3 text-left">
                      <div className="flex flex-col gap-1">
                        {isSecondOrThirdUpcoming ? (
                          med.status === "Upcoming"
                            ? <span className="flex items-center justify-center"><Clock size={16} className="text-yellow-700" /></span>
                            : <span>{med.time}</span>
                        ) : (
                          <>
                            {med.status === "Upcoming" && (
                              <span className="flex items-center justify-center"><Clock size={16} className="text-yellow-700" /></span>
                              
                            )}
                            {med.status !== "Upcoming" && <span className="pl-2">{med.time}</span>}
                          </>
                        )}
                      </div>
                    </td>
                    <td className="py-3 text-left pl-2">
                      {med.status === "Taken" ? (
                        <Button size="sm" className="rounded-full bg-gray-300 text-gray-500 cursor-not-allowed pl-2" disabled>
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
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default MedicationSchedule; 