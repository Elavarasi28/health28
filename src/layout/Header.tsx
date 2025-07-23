import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "../contexts/ThemeContext";
import { useLocation } from "react-router-dom";
import {
  Search,
  LayoutDashboard,
  CalendarDays,
  Sun,
  Moon,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const Logo = () => (
  <div className="font-bold text-xl flex items-center gap-2">
    <span className="bg-orange-500 rounded-full w-6 h-6 inline-block" /> ARMED
  </div>
);

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  searchValue: string;
  setSearchValue: (value: string) => void;
  selectedDate: string;
  setShowCustomizeModal: (show: boolean) => void;
  setShowDateModal: (show: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({
  sidebarOpen,
  setSidebarOpen,
  searchValue,
  setSearchValue,
  selectedDate,
  setShowCustomizeModal,
  setShowDateModal,
}) => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [dashboardView, setDashboardView] = useState<"today" | "week" | "custom">("today");

  return (
    <header className="flex items-center justify-between px-4 pb-2 md:px-8 py-4 bg-gray-200 dark:bg-[#18181b] sticky top-0 z-20">
      <div className="flex items-center gap-4 md:gap-8">
        <button
          className="md:hidden mr-2"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Open sidebar"
        >
          <span className="text-2xl">☰</span>
        </button>
        <Logo />
        {/* Search bar with icon inside and clear button */}
        <div className="hidden sm:block relative ml-8 md:ml-16 w-60 md:w-80">
          <Input
            type="text"
            placeholder="Try searching 'Omega 3' ..."
            className="w-full pl-10 pr-8 h-10 text-base rounded-lg border border-gray-500 focus:ring-2 focus:ring-orange-200"
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
          {searchValue && (
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => setSearchValue("")}
              aria-label="Clear search"
              type="button"
            >
              &#10005;
            </button>
          )}
        </div>
      </div>
      <div className="hidden md:flex items-center gap-6">
        {location.pathname === '/dashboard' && (
          <Button variant="ghost" className="flex items-center gap-2" onClick={() => setShowCustomizeModal(true)}>
            <LayoutDashboard size={18} />
            Customize Dashboard
          </Button>
        )}
        <button
          className="text-sm text-muted-foreground flex items-center gap-1 px-2 py-1 rounded hover:bg-accent transition"
          onClick={() => setShowDateModal(true)}
        >
          <CalendarDays size={16} />
          {selectedDate === new Date().toISOString().slice(0, 10) ? 'Today' : selectedDate}
        </button>
        <Button
          variant="ghost"
          size="icon"
          className="flex items-center justify-center"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </Button>
      </div>
    </header>
  );
};

export default Header; 