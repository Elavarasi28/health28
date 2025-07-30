import React, { useState } from "react";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";

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
  const [toast, setToast] = useState("");

  const playNotificationSound = () => {
    try {
      new Audio('/public/preview.mp3').play();
    } catch (e) {}
  };

  const filtered = notifications.filter(n =>
    (notifFilter === "All" || n.type === notifFilter) && settings[n.type]
  );

  const handleToggleRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: !n.read } : n));
  };

  const sampleTitles = [
    "System Update",
    "Welcome to ARMED!",
    "Profile Changed",
    "Security Alert",
    "New Feature Released",
    "Backup Completed"
  ];
  const sampleDescs = [
    "Your system was updated successfully.",
    "Thank you for joining our platform!",
    "Your profile information has been changed.",
    "A new login was detected from a different device.",
    "Check out the latest features in your dashboard.",
    "Your data backup finished without issues."
  ];

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setToast("All notifications marked as read!");
    // Add a sample notification
    setTimeout(() => {
      const randomTitle = sampleTitles[Math.floor(Math.random() * sampleTitles.length)];
      const randomDesc = sampleDescs[Math.floor(Math.random() * sampleDescs.length)];
      setNotifications(prev => [
        {
          id: Date.now(),
          type: "System",
          title: randomTitle,
          desc: randomDesc,
          read: false,
          time: "Just now"
        },
        ...prev
      ]);
      setToast("New notification received!");
      playNotificationSound();
      setTimeout(() => setToast(""), 2000);
    }, 1000);
    setTimeout(() => setToast(""), 2000);
  };

  const handleSettingChange = (type: string) => {
    setSettings(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const types: NotificationType[] = ["Medication", "Appointments", "Challenge", "System"];
  const typeIcons: { [key in NotificationType]: string } = {
    Medication: "💊",
    Appointments: "📅",
    Challenge: "🏃",
    System: "⚙️"
  };

  return (
    <div className="p-4 w-full max-w-6xl mx-auto space-y-6">
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
      <div className="bg-card rounded-lg shadow p-2 w-full">
        {filtered.length === 0 ? (
          <div className="text-muted-foreground">No notifications.</div>
        ) : (
          <ul className="divide-y">
            <AnimatePresence mode="popLayout">
              {filtered.map(n => (
                <motion.li
                  key={n.id}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.3 }}
                  layout
                  className="flex w-full items-stretch justify-between py-3 gap-2 rounded-lg transition-all border border-transparent hover:border-primary/40 hover:shadow-md hover:bg-gray-100 bg-white dark:bg-card px-4"
                >
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{typeIcons[n.type]}</span>
                      <span className={`inline-block w-2 h-2 rounded-full ${n.read ? "bg-gray-400" : "bg-orange-500"}`}></span>
                      <span className="font-semibold text-base truncate text-left">{n.title}</span>
                      <span className="ml-2 text-xs text-muted-foreground">[{n.type}]</span>
                    </div>
                    <div className="text-sm text-muted-foreground truncate text-left">{n.desc}</div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{n.time}</span>
                    <button
                      className={`text-lg px-2 py-1 rounded-full border-none bg-transparent hover:bg-orange-100 hover:scale-110 transition-transform duration-150 ${n.read ? "text-gray-400" : "text-orange-500"}`}
                      onClick={() => handleToggleRead(n.id)}
                      title={n.read ? "Mark as Unread" : "Mark as Read"}
                    >
                      {n.read ? "🔕" : "🔔"}
                    </button>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
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

export default NotificationsPage; 