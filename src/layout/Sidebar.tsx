import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "../contexts/ThemeContext";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Pill,
  Trophy,
  BarChart2,
  Calendar,
  Bell,
  Search,
  LayoutDashboard,
  CalendarDays,
  Sun,
  Moon,
} from "lucide-react";

const sidebarIcons = [
  <Home size={20} />, // Dashboard
  <Pill size={20} />, // Medications
  <Trophy size={20} />, // Challenges
  <BarChart2 size={20} />, // Health Insights
  <Calendar size={20} />, // Appointments
  <Bell size={20} />, // Notifications
];

const sidebarLinks = [
  "Dashboard",
  "Medications",
  "Challenges",
  "Health Insights",
  "Appointments",
  "Notifications",
];

// Add a dynamic UserProfile component that takes user as a prop
const UserProfile = ({
  user,
  setShowLoginModal,
  setShowProfileModal,
}: {
  user: { name: string; email: string; avatar: string },
  setShowLoginModal: (show: boolean) => void,
  setShowProfileModal: (show: boolean) => void,
}) => {
  const isGuest = !user.name && !user.email && !user.avatar;
  return (
    <div
      className="flex items-center gap-3 p-4 rounded-xl bg-sidebar-accent mt-auto cursor-pointer hover:shadow"
      onClick={() => isGuest ? setShowLoginModal(true) : setShowProfileModal(true)}
      title={isGuest ? "Login" : "Profile"}
      tabIndex={0}
      role="button"
      aria-label={isGuest ? "Login" : "Profile"}
      onKeyDown={e => { if (e.key === "Enter" || e.key === " ") (isGuest ? setShowLoginModal(true) : setShowProfileModal(true)); }}
    >
      <img
        src={isGuest ? 'https://ui-avatars.com/api/?name=Guest&background=cccccc&color=555555' : user.avatar || `https://ui-avatars.com/api/?name=${user.name}`}
        alt={isGuest ? 'Guest' : user.name}
        className="w-10 h-10 rounded-full object-cover"
      />
      <div className="text-left">
        <div className="font-semibold text-sm text-sidebar-foreground">{isGuest ? 'Guest' : user.name}</div>
        <div className="text-xs text-muted-foreground">{isGuest ? 'Not logged in' : user.email}</div>
      </div>
    </div>
  );
};

interface SidebarProps {
  sidebarOpen: boolean;
  searchValue: string;
  setSearchValue: (value: string) => void;
  user: { name: string; email: string; avatar: string };
  setShowCustomizeModal: (show: boolean) => void;
  setShowLoginModal: (show: boolean) => void;
  setShowProfileModal: (show: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  sidebarOpen,
  setSidebarOpen,
  searchValue,
  setSearchValue,
  user,
  setShowCustomizeModal,
  setShowLoginModal,
  setShowProfileModal,
}) => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSidebarClose = () => {
    setSidebarOpen?.(false);
  };

  return (
    <>
      <aside
        className={`
          fixed md:static z-30 top-0 left-0 h-full md:h-auto bg-gray-200 dark:bg-[#18181b] p-6 w-64
          flex flex-col transition-transform duration-1000
           ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
        `}
      >
        <div className="relative h-full flex flex-col">
          {/* Close button at the very top right */}
          <button
            className="  atop-0 right-1 pt-0  text-2xl text-black block sm:hidden z-100"
            onClick={handleSidebarClose}
            aria-label="Close sidebar"
          >
            &times;
          </button>
          {/* Sidebar content below */}
          <nav className="flex-1 overflow-auto">
            <ul className="space-y-2 md:space-y-4">
              {sidebarLinks.map((link, i) => {
                const path = "/" + link.toLowerCase().replace(/ /g, "-");
                const isActive = location.pathname === path;
                return (
                  <li key={link}>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start text-base font-medium text-sidebar-foreground hover:bg-sidebar-accent flex items-center gap-3 cursor-pointer ${isActive ? "bg-sidebar-accent" : ""}`}
                      onClick={() => navigate(path)}
                    >
                      <span className="text-lg">{sidebarIcons[i]}</span>
                      {link}
                    </Button>
                  </li>
                );
              })}
            </ul>
            {/* Header buttons on small screen */}
            <div className="mt-6 flex flex-col gap-2 md:hidden ">
              <div className="relative">
                {/* Cancel/Close button - only visible on small screens */}
                <Input placeholder="Search 'Glucose'..." className="w-full pl-10" />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              </div>
              {location.pathname === '/dashboard' && (
                <Button variant="ghost" className="justify-start flex items-center gap-2" onClick={() => setShowCustomizeModal(true)}>
                  <LayoutDashboard size={18} />
                  Customize Dashboard
                </Button>
              )}
              <Button
                variant="ghost"
                className="justify-start flex items-center gap-2"
                onClick={toggleTheme}
              >
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
              </Button>
              
              <span className="text-sm text-muted-foreground flex items-center gap-1 mt-2">
                <CalendarDays size={16} /> Today
              </span>
            </div>
          </nav>
          {/* Profile/User card at the bottom */}
          <div className="mt-auto mb-4">
            <UserProfile
              user={user}
              setShowLoginModal={setShowLoginModal}
              setShowProfileModal={setShowProfileModal}
            />
          </div>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed top-0 right-0 bottom-0 left-[sidebar-width] bg-black/40 flex items-center justify-center z-50" onClick={() => setSidebarOpen?.(false)} />}
    </>
  );
};

export default Sidebar; 