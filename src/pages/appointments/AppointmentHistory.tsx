import React from "react";

interface Appointment {
  id: number;
  doctor: string;
  date: string;
  time: string;
  telehealth: boolean;
  status: string;
}

interface AppointmentHistoryProps {
  history: Appointment[];
}

const AppointmentHistory: React.FC<AppointmentHistoryProps> = ({ history }) => (
  <div className="bg-card rounded-lg shadow p-4">
    <h2 className="text-lg font-semibold mb-2">Appointment History</h2>
    {history.length === 0 ? <div className="text-muted-foreground">No past appointments.</div> : (
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2 pr-4 sticky-col">Doctor</th>
              <th className="py-2 pr-4 sticky-col">Date</th>
              <th className="py-2 pr-4 sticky-col">Time</th>
              <th className="py-2 pr-4 sticky-col">Telehealth</th>
              <th className="py-2 pr-4 sticky-col">Status</th>
            </tr>
          </thead>
          <tbody>
            {history.map(a => (
              <tr key={a.id} className="border-b last:border-0">
                <td className="py-2 pr-4 sticky-col font-medium">{a.doctor}</td>
                <td className="py-2 pr-4 sticky-col">{a.date}</td>
                <td className="py-2 pr-4 sticky-col">{a.time}</td>
                <td className="py-2 pr-4 sticky-col">{a.telehealth ? <span className="text-green-600 font-semibold">Yes</span> : "No"}</td>
                <td className="py-2 pr-4 sticky-col capitalize">{a.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

export default AppointmentHistory; 