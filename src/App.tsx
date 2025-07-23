import React, { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useTheme } from "./contexts/ThemeContext";
import { Routes, Route } from "react-router-dom";
import "./App.css";

// Import modular components
import Header from "./layout/Header";
import Sidebar from "./layout/Sidebar";
import DashboardPage from "./pages/DashboardPage";
import MedicationsPage from "./pages/MedicationsPage";
import ChallengesPage from "./pages/ChallengesPage";
import HealthInsightsPage from "./pages/HealthInsightsPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import NotificationsPage from "./pages/NotificationsPage";

// Responsive window width hook
function useWindowWidth() {
  const [width, setWidth] = React.useState(window.innerWidth);
  React.useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return width;
}

type CareTeamMember = {
  name: string;
  role: string;
  img: string;
  badge?: number;
  unread?: boolean;
  messages?: string[];
};

export default function App() {
  // Removed unused destructured elements from useTheme
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [medications, setMedications] = useState([
    { name: "Metformin", qty: "1 pill", dosage: "500 mg", status: "Missed", time: "12:30" },
    { name: "Omega 3", qty: "3 pills", dosage: "800 mg", status: "Taken", time: "08:00" },
    { name: "Levothyroxine", qty: "2 pills", dosage: "50 mg", status: "Upcoming", time: "18:00" },
    { name: "Aspirin", qty: "1 pill", dosage: "100 mg", status: "Taken", time: "09:00" },
    { name: "Atorvastatin", qty: "1 pill", dosage: "20 mg", status: "Upcoming", time: "21:00" },
  ]);
  const [toast, setToast] = useState("");
  const [selectedMember, setSelectedMember] = useState<CareTeamMember | null>(null);
  const [showFitnessModal, setShowFitnessModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({ date: '', time: '', reason: '' });
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [visibleSections, setVisibleSections] = useState({
    fitnessGoals: true,
    glucoseTrends: true,
    careTeam: true,
    medicationSchedule: true,
  });
  const [user, setUser] = useState({
    name: '',
    email: '',
    avatar: '',
  });
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState({ name: user.name, email: user.email });
  const [editAvatar, setEditAvatar] = useState(user.avatar);
  const [showDateModal, setShowDateModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().slice(0, 10);
  });
  const [showCareTeamModal, setShowCareTeamModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '', name: '' });
  const defaultAvatar = 'https://ui-avatars.com/api/?name=User&background=cccccc&color=555555';

  const [careTeam, setCareTeam] = useState([
    {
      name: "Zain Curtis",
      role: "Endocrinologist",
      img: "https://randomuser.me/api/portraits/men/32.jpg",
      badge: 2,
      unread: true,
      messages: [
        "Your next appointment is on Friday at 10am.",
        "Please remember to update your glucose log."
      ]
    },
    { name: "Phillip Workman", role: "Neurologist", img: "https://randomuser.me/api/portraits/men/45.jpg" },
    { name: "Cheyenne Herwitz", role: "Cardiologist", img: "https://randomuser.me/api/portraits/women/65.jpg" },
    { name: "Ava Patel", role: "General Physician", img: "https://randomuser.me/api/portraits/women/68.jpg" },
    { name: "Sophia Lee", role: "Nutritionist", img: "https://randomuser.me/api/portraits/women/50.jpg" },
  ]);

  const width = useWindowWidth();

  // Handle Take button
  const handleTake = (index: number) => {
    setMedications((prev) =>
      prev.map((med, i) =>
        i === index ? { ...med, status: "Taken" } : med
      )
    );
    setToast("Medication marked as taken!");
    setTimeout(() => setToast(""), 2000);
  };

  // Handle Schedule Visit form submit
  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowScheduleModal(false);
    setToast('Visit scheduled successfully!');
    setTimeout(() => setToast(''), 2000);
    setScheduleForm({ date: '', time: '', reason: '' });
  };

  // Handle section toggle
  const handleSectionToggle = (section: keyof typeof visibleSections) => {
    setVisibleSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Update edit form when opening modal
  useEffect(() => {
    if (showProfileModal && user.name) {
      setEditForm({ name: user.name, email: user.email });
      setEditAvatar(user.avatar);
      setEditingProfile(false);
    }
  }, [showProfileModal, user.name, user.email, user.avatar]);

  const handleLogout = () => {
    setUser({ name: '', email: '', avatar: '' });
    setShowProfileModal(false);
    setToast('Logged out successfully!');
    setTimeout(() => setToast(''), 2000);
  };

  return (
    <SidebarProvider>
      <div className="h-screen w-screen overflow-hidden flex flex-col bg-gray-200 dark:bg-[#18181b]">
        {/* Header */}
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          selectedDate={selectedDate}
          setShowCustomizeModal={setShowCustomizeModal}
          setShowDateModal={setShowDateModal}
        />

        <div className="flex flex-1 flex-col md:flex-row overflow-hidden bg-sidebar">
          {/* Sidebar */}
          <Sidebar
            sidebarOpen={sidebarOpen}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            user={user}
            setShowCustomizeModal={setShowCustomizeModal}
            setShowLoginModal={setShowLoginModal}
            setShowProfileModal={setShowProfileModal}
          />

          {/* Main Content */}
          <main className="flex-1 p-2 sm:p-4 md:p-6 overflow-y-auto space-y-2 bg-gray-200 dark:bg-[#18181b]">
            <Routes>
              <Route path="/dashboard" element={
                <DashboardPage
                  user={user}
                  medications={medications}
                  careTeam={careTeam}
                  searchValue={searchValue}
                  visibleSections={visibleSections}
                  setShowFitnessModal={setShowFitnessModal}
                  setShowScheduleModal={setShowScheduleModal}
                  setShowCareTeamModal={setShowCareTeamModal}
                  setSelectedMember={setSelectedMember}
                  handleTake={handleTake}
                  handleSectionToggle={handleSectionToggle}
                  width={width}
                />
              } />
              <Route path="/medications" element={<MedicationsPage />} />
              <Route path="/challenges" element={<ChallengesPage />} />
              <Route path="/health-insights" element={<HealthInsightsPage />} />
              <Route path="/appointments" element={<AppointmentsPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              
              <Route path="*" element={<div className="p-8 text-2xl">Welcome! Please select a section from the sidebar.</div>} />
            </Routes>
          </main>
        </div>

        {/* Toast message */}
        {toast && (
          <div className="fixed bottom-6 right-6 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50 transition">
            {toast}
          </div>
        )}

        {/* Profile Modal */}
        {showProfileModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-card text-card-foreground rounded-lg p-6 shadow-lg min-w-[320px] w-full max-w-xs border">
              <div className="flex flex-col items-center">
                <img
                  src={editingProfile ? editAvatar : user.avatar}
                  alt={user.name}
                  className="w-20 h-20 rounded-full object-cover mb-2"
                />
                {!editingProfile ? (
                  <>
                    <div className="font-bold text-lg mb-1">{user.name || 'Guest'}</div>
                    <div className="text-sm text-muted-foreground mb-4">{user.email || 'Not logged in'}</div>
                    <div className="flex flex-col gap-2 w-full mt-2">
                      {user.name ? (
                        <>
                          <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90" onClick={() => setEditingProfile(true)}>Edit Profile</button>
                          <button className="w-full px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/80" onClick={handleLogout}>Logout</button>
                        </>
                      ) : (
                        <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90" onClick={() => setShowLoginModal(true)}>Login</button>
                      )}
                      <button className="w-full px-4 py-2 bg-muted text-muted-foreground rounded hover:bg-muted/80 mt-2" onClick={() => setShowProfileModal(false)}>Close</button>
                    </div>
                  </>
                ) : (
                  <form
                    className="flex flex-col gap-3 w-full mt-2"
                    onSubmit={e => {
                      e.preventDefault();
                      setUser(u => ({ ...u, name: editForm.name, email: editForm.email, avatar: editAvatar }));
                      setEditingProfile(false);
                      setToast('Profile updated successfully!');
                      setTimeout(() => setToast(''), 2000);
                    }}
                  >
                   <label className="flex flex-col text-sm items-center">
                     <span className="mb-1">Avatar</span>
                     <input
                       type="file"
                       accept="image/*"
                       className="mb-2"
                       onChange={e => {
                         const file = e.target.files && e.target.files[0];
                         if (file) {
                           const reader = new FileReader();
                           reader.onload = ev => {
                             setEditAvatar(ev.target?.result as string);
                           };
                           reader.readAsDataURL(file);
                         }
                       }}
                     />
                   </label>
                    <label className="flex flex-col text-sm">
                      Name
                      <input
                        type="text"
                        className="mt-1 border rounded px-2 py-1 bg-background text-foreground"
                        value={editForm.name}
                        onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                        required
                      />
                    </label>
                    <label className="flex flex-col text-sm">
                      Email
                      <input
                        type="email"
                        className="mt-1 border rounded px-2 py-1 bg-background text-foreground"
                        value={editForm.email}
                        onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))}
                        required
                      />
                    </label>
                    <div className="flex gap-2 mt-2">
                      <button
                        type="button"
                        className="flex-1 px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/80"
                        onClick={() => setEditingProfile(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Customize Dashboard Modal */}
        {showCustomizeModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-card text-card-foreground rounded-lg p-6 shadow-lg min-w-[320px] w-full max-w-xs border">
              <div className="font-bold text-lg mb-2">Customize Dashboard</div>
              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={visibleSections.fitnessGoals} onChange={() => handleSectionToggle('fitnessGoals')} />
                  Fitness Goals
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={visibleSections.glucoseTrends} onChange={() => handleSectionToggle('glucoseTrends')} />
                  Blood Glucose Trends
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={visibleSections.careTeam} onChange={() => handleSectionToggle('careTeam')} />
                  My Care Team
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={visibleSections.medicationSchedule} onChange={() => handleSectionToggle('medicationSchedule')} />
                  Medication Schedule
                </label>
                <div className="flex gap-2 mt-4">
                  <button
                    type="button"
                    className="flex-1 px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/80"
                    onClick={() => setShowCustomizeModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Schedule Visit Modal */}
        {showScheduleModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-card text-card-foreground rounded-lg p-6 shadow-lg min-w-[320px] w-full max-w-xs border">
              <div className="font-bold text-lg mb-2">Schedule a Visit</div>
              <form onSubmit={handleScheduleSubmit} className="flex flex-col gap-3">
                <label className="flex flex-col text-sm">
                  Date
                  <input
                    type="date"
                    className="mt-1 border rounded px-2 py-1 bg-background text-foreground"
                    value={scheduleForm.date}
                    onChange={e => setScheduleForm(f => ({ ...f, date: e.target.value }))}
                    required
                  />
                </label>
                <label className="flex flex-col text-sm">
                  Time
                  <input
                    type="time"
                    className="mt-1 border rounded px-2 py-1 bg-background text-foreground"
                    value={scheduleForm.time}
                    onChange={e => setScheduleForm(f => ({ ...f, time: e.target.value }))}
                    required
                  />
                </label>
                <label className="flex flex-col text-sm">
                  Reason
                  <input
                    type="text"
                    className="mt-1 border rounded px-2 py-1 bg-background text-foreground"
                    placeholder="Reason for visit"
                    value={scheduleForm.reason}
                    onChange={e => setScheduleForm(f => ({ ...f, reason: e.target.value }))}
                    required
                  />
                </label>
                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    className="flex-1 px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/80"
                    onClick={() => setShowScheduleModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                  >
                    Schedule
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Care Team Member Modal */}
        {selectedMember && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-card text-card-foreground rounded-lg p-6 shadow-lg min-w-[300px] border">
              <div className="flex flex-col items-center">
                {selectedMember.img && <img src={selectedMember.img} alt={selectedMember.name || ''} className="w-16 h-16 rounded-full mb-2" />}
                <div className="font-bold text-lg mb-1">{selectedMember.name || ''}</div>
                <div className="text-sm text-gray-500 mb-4">{selectedMember.role || ''}</div>
                {selectedMember.badge && <span className="bg-blue-100 text-blue-600 text-xs rounded-full px-2 py-0.5 mb-2">{selectedMember.badge}</span>}
                {selectedMember.messages && (
                  <div className="w-full mt-2">
                    {selectedMember.messages.map((msg: string, idx: number) => (
                      <div key={idx} className="bg-accent text-accent-foreground rounded px-3 py-2 mb-2 text-sm">
                        {msg}
                      </div>
                    ))}
                  </div>
                )}
                <button
                  className="mt-2 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
                  onClick={() => setSelectedMember(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {showFitnessModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-card text-card-foreground rounded-lg p-6 shadow-lg min-w-[320px] border">
              <div className="font-bold text-lg mb-2">Fitness Progress</div>
              <div className="mb-4">You have completed 4 out of 5 workouts this week! Keep it up!</div>
              <button
                className="mt-2 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
                onClick={() => setShowFitnessModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Date Picker Modal */}
        {showDateModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-card text-card-foreground rounded-lg p-6 shadow-lg min-w-[320px] w-full max-w-xs flex flex-col items-center border">
              <div className="font-bold text-lg mb-2">Select Date</div>
              <input
                type="date"
                className="border rounded px-3 py-2 mb-4 bg-background text-foreground"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                max={new Date().toISOString().slice(0, 10)}
              />
              <div className="flex gap-2 w-full">
                <button
                  className="flex-1 px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/80"
                  onClick={() => setShowDateModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
                  onClick={() => setShowDateModal(false)}
                >
                  Select
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </SidebarProvider>
  );
}
