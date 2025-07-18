import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Routes, Route } from "react-router-dom";
import "./App.css";

import Header from "./layout/Header";
import Sidebar from "./layout/Sidebar";
import DashboardPage from "./pages/DashboardPage";
import MedicationsPage from "./pages/MedicationsPage";
import ChallengesPage from "./pages/ChallengesPage";
import HealthInsightsPage from "./pages/HealthInsightsPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import NotificationsPage from "./pages/NotificationsPage";

export default function App() {
  // Only layout and routing logic here
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");

  return (
    <SidebarProvider>
      <div className="h-screen w-screen overflow-hidden flex flex-col bg-gray-200 dark:bg-[#18181b]">
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          selectedDate={new Date().toISOString().slice(0, 10)}
          setShowCustomizeModal={() => {}}
          setShowDateModal={() => {}}
        />
        <div className="flex flex-1 flex-col md:flex-row overflow-hidden bg-sidebar">
          <Sidebar
            sidebarOpen={sidebarOpen}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            user={{ name: '', email: '', avatar: '' }}
            setShowCustomizeModal={() => {}}
            setShowLoginModal={() => {}}
            setShowProfileModal={() => {}}
          />
          <main className="flex-1 p-2 sm:p-4 md:p-6 overflow-y-auto space-y-2 bg-gray-200 dark:bg-[#18181b]">
            <Routes>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/medications" element={<MedicationsPage />} />
              <Route path="/challenges" element={<ChallengesPage />} />
              <Route path="/health-insights" element={<HealthInsightsPage />} />
              <Route path="/appointments" element={<AppointmentsPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="*" element={<div className="p-8 text-2xl">Welcome! Please select a section from the sidebar.</div>} />
            </Routes>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
