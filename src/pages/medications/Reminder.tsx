import React from "react";
import { Card } from "@/components/ui/card";

interface ReminderProps {
  reminders: any[];
  medications: any[];
  handleToggleReminder: (reminderId: string) => void;
}

const Reminder: React.FC<ReminderProps> = ({ reminders, medications, handleToggleReminder }) => (
  <div className="space-y-4">
    <h2 className="text-xl font-semibold text-foreground">Medication Reminders</h2>
    <div className="grid gap-4">
      {reminders.map((reminder) => {
        const medication = medications.find((med: any) => med.id === reminder.medicationId);
        return (
          <Card key={reminder.id} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground">{medication?.name}</h3>
                <p className="text-sm text-muted-foreground">{reminder.time}</p>
                <p className="text-xs text-muted-foreground">
                  {reminder.days.join(', ')}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleToggleReminder(reminder.id)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    reminder.isActive ? 'bg-green-500' : 'bg-gray-400'
                  }`}
                />
                <span className="text-sm text-muted-foreground">
                  {reminder.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  </div>
);

export default Reminder; 