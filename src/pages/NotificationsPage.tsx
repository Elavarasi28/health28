import React, { useState } from "react";

const NotificationsPage = () => {
  type NotificationType = "Medication" | "Appointments" | "Challenge" | "System";
  type Notification = {
    id: number;
    type: NotificationType;
    title: string;
    desc: string;
    read: boolean;
    time: string;
  };
  
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, type: "Medication", title: "Take Metformin", desc: "It's time to take your 8am dose.", read: false, time: "08:00" },
    { id: 2, type: "Appointments", title: "Upcoming Appointment", desc: "You have an appointment with Dr. Smith tomorrow at 10:00.", read: false, time: "Yesterday" },
    { id: 3, type: "Challenge", title: "Daily Steps Challenge", desc: "You are 500 steps away from your daily goal!", read: true, time: "Today" },
    { id: 4, type: "System", title: "Profile Updated", desc: "Your profile was updated successfully.", read: true, time: "2 days ago" },
    { id: 5, type: "Medication", title: "Missed Dose", desc: "You missed your 8pm medication yesterday.", read: false, time: "Yesterday" },
    { id: 6, type: "Appointments", title: "Appointment Cancelled", desc: "Your appointment with Dr. Lee was cancelled.", read: true, time: "3 days ago" },
  ]);
  const [notifFilter, setNotifFilter] = useState<string>("All");
  const [settings, setSettings] = useState<{ [key: string]: boolean }>({ Medication: true, Appointments: true, Challenge: true, System: true });

  const filtered = notifications.filter(n =>
    (notifFilter === "All" || n.type === notifFilter) && settings[n.type]
  );

  const handleToggleRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: !n.read } : n));
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleSettingChange = (type: string) => {
    setSettings(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const types: NotificationType[] = ["Medication", "Appointments", "Challenge", "System"];

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded shadow hover:bg-primary/90" onClick={handleMarkAllRead}>Mark all as read</button>
      </div>
      {/* Filters */}
      <div className="flex gap-2 flex-wrap mb-2">
        {["All", ...types].map(t => (
          <button
            key={t}
            className={`px-3 py-1 rounded-full text-sm border ${notifFilter === t ? "bg-primary text-primary-foreground border-primary" : "bg-muted text-muted-foreground border-muted"}`}
            onClick={() => setNotifFilter(t)}
          >
            {t}
          </button>
        ))}
      </div>
      {/* Notification List */}
      <div className="bg-card rounded-lg shadow p-4">
        {filtered.length === 0 ? <div className="text-muted-foreground">No notifications.</div> : (
          <ul className="divide-y">
            {filtered.map(n => (
              <li key={n.id} className="flex flex-col sm:flex-row sm:items-center justify-between py-3 gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`inline-block w-2 h-2 rounded-full ${n.read ? "bg-gray-400" : "bg-orange-500"}`}></span>
                    <span className="font-semibold text-base truncate">{n.title}</span>
                    <span className="ml-2 text-xs text-muted-foreground">[{n.type}]</span>
                  </div>
                  <div className="text-sm text-muted-foreground truncate">{n.desc}</div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{n.time}</span>
                  <button className={`text-xs px-2 py-1 rounded ${n.read ? "bg-muted text-muted-foreground" : "bg-orange-100 text-orange-700"}`} onClick={() => handleToggleRead(n.id)}>
                    {n.read ? "Mark Unread" : "Mark Read"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* Notification Settings */}
      <div className="bg-card rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-2">Notification Settings</h2>
        <div className="flex flex-col gap-2">
          {types.map(type => (
            <label key={type} className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={settings[type]} onChange={() => handleSettingChange(type)} />
              Enable {type} notifications
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage; 