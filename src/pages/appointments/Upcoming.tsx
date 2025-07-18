import React from "react";

interface Appointment {
  id: number;
  doctor: string;
  date: string;
  time: string;
  telehealth: boolean;
  status: string;
}

interface UpcomingProps {
  upcoming: Appointment[];
  handleJoin: (id: number) => void;
  handleReschedule: (id: number) => void;
  handleCancel: (id: number) => void;
}

const Upcoming: React.FC<UpcomingProps> = ({ upcoming, handleJoin, handleReschedule, handleCancel }) => (
  <div className="bg-card rounded-lg shadow p-4">
    <h2 className="text-lg font-semibold mb-2">Upcoming Appointments</h2>
    {upcoming.length === 0 ? <div className="text-muted-foreground">No upcoming appointments.</div> : (
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2 pr-4 sticky-col">Doctor</th>
              <th className="py-2 pr-4 sticky-col">Date</th>
              <th className="py-2 pr-4 sticky-col">Time</th>
              <th className="py-2 pr-4 sticky-col">Telehealth</th>
              <th className="py-2 pr-4 sticky-col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {upcoming.map(a => (
              <tr key={a.id} className="border-b last:border-0">
                <td className="py-2 pr-4 sticky-col font-medium">{a.doctor}</td>
                <td className="py-2 pr-4 sticky-col">{a.date}</td>
                <td className="py-2 pr-4 sticky-col">{a.time}</td>
                <td className="py-2 pr-4 sticky-col">{a.telehealth ? <span className="text-green-600 font-semibold">Yes</span> : "No"}</td>
                <td className="py-2 pr-4 sticky-col flex flex-wrap gap-2">
                  {a.telehealth && <button className="bg-blue-500 text-white px-2 py-1 rounded text-xs" onClick={() => handleJoin(a.id)}>Join Video Call</button>}
                  <button className="bg-yellow-500 text-white px-2 py-1 rounded text-xs" onClick={() => handleReschedule(a.id)}>Reschedule</button>
                  <button className="bg-red-500 text-white px-2 py-1 rounded text-xs" onClick={() => handleCancel(a.id)}>Cancel</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

export default Upcoming; 