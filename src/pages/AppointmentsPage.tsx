import React, { useState } from "react";
import Book from "./appointments/Book";
import Upcoming from "./appointments/Upcoming";
import AppointmentHistory from "./appointments/AppointmentHistory";
import { AnimatePresence, motion } from "framer-motion";

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([
    { id: 1, doctor: "Dr. Smith", date: "2024-07-25", time: "10:00", telehealth: true, status: "upcoming" },
    { id: 2, doctor: "Dr. Lee", date: "2024-07-20", time: "15:30", telehealth: false, status: "upcoming" },
    { id: 3, doctor: "Dr. Patel", date: "2024-06-10", time: "09:00", telehealth: true, status: "completed" },
    { id: 4, doctor: "Dr. Smith", date: "2024-05-15", time: "11:00", telehealth: false, status: "cancelled" },
    { id: 5, doctor: "Dr. Smith", date: "2024-05-15", time: "11:00", telehealth: false, status: "cancelled" },
  ]);
  const [form, setForm] = useState({ doctor: "", date: "", time: "", telehealth: false });
  const [showForm, setShowForm] = useState(false);
  const [apptRescheduleId, setApptRescheduleId] = useState<number | null>(null);
  const [toast, setToast] = useState("");

  const doctors = ["Dr. Smith", "Dr. Lee", "Dr. Patel", "Dr. Gomez"];

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    setAppointments(prev => [
      ...prev,
      {
        id: Date.now(),
        doctor: form.doctor,
        date: form.date,
        time: form.time,
        telehealth: form.telehealth,
        status: "upcoming"
      }
    ]);
    setForm({ doctor: "", date: "", time: "", telehealth: false });
    setShowForm(false);
    setToast("Appointment booked successfully!");
    setTimeout(() => setToast(""), 2000);
  };

  const handleCancel = (id: number) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: "cancelled" } : a));
    setToast("Appointment cancelled.");
    setTimeout(() => setToast(""), 2000);
  };

  const handleReschedule = (id: number) => {
    setApptRescheduleId(id);
    const appt = appointments.find(a => a.id === id);
    setForm({ doctor: appt!.doctor, date: appt!.date, time: appt!.time, telehealth: appt!.telehealth });
    setShowForm(true);
  };

  const handleRescheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAppointments(prev => prev.map(a =>
      a.id === apptRescheduleId
        ? { ...a, doctor: form.doctor, date: form.date, time: form.time, telehealth: form.telehealth }
        : a
    ));
    setForm({ doctor: "", date: "", time: "", telehealth: false });
    setShowForm(false);
    setApptRescheduleId(null);
    setToast("Appointment rescheduled.");
    setTimeout(() => setToast(""), 2000);
  };

  const handleJoin = (id: number) => {
    alert("Joining video call for appointment " + id);
  };

  const upcoming = appointments.filter(a => a.status === "upcoming");
  const history = appointments.filter(a => a.status !== "upcoming");

  return (
    <div className="p-4 w-full max-w-6xl mx-auto space-y-6">
      <Book setShowForm={setShowForm} setApptRescheduleId={setApptRescheduleId} />
      <Upcoming
        upcoming={upcoming}
        handleJoin={handleJoin}
        handleReschedule={handleReschedule}
        handleCancel={handleCancel}
      />
      <AppointmentHistory history={history} />
      {/* Book/Reschedule Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          >
            <form onSubmit={apptRescheduleId ? handleRescheduleSubmit : handleBook} className="bg-card text-card-foreground rounded-lg p-6 shadow-lg min-w-[320px] w-full max-w-xs border space-y-4">
              <h2 className="font-bold text-lg mb-2">{apptRescheduleId ? "Reschedule Appointment" : "Book New Appointment"}</h2>
              <label className="flex flex-col text-sm">
                Doctor
                <select className="mt-1 border rounded px-2 py-1 bg-background text-foreground" value={form.doctor} onChange={e => setForm(f => ({ ...f, doctor: e.target.value }))} required>
                  <option value="" disabled>Select doctor</option>
                  {doctors.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </label>
              <label className="flex flex-col text-sm">
                Date
                <input type="date" className="mt-1 border rounded px-2 py-1 bg-background text-foreground" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required />
              </label>
              <label className="flex flex-col text-sm">
                Time
                <input type="time" className="mt-1 border rounded px-2 py-1 bg-background text-foreground" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} required />
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.telehealth} onChange={e => setForm(f => ({ ...f, telehealth: e.target.checked }))} />
                Telehealth (Video Call)
              </label>
              <div className="flex gap-2 mt-2">
                <button type="button" className="flex-1 px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/80" onClick={() => { setShowForm(false); setApptRescheduleId(null); }}>Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90">{apptRescheduleId ? "Save" : "Book"}</button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Toast notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.4 }}
            className="fixed bottom-6 right-6 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AppointmentsPage; 