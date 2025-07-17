import React, { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "./contexts/ThemeContext";
import "./App.css";

// Lucide React icons
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
  Cloud,
  Sun,
  Moon,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit,
  Trash2,
  History,
  Target,
  Award,
  Users,
  TrendingUp,
  Star,
  Zap,
  Heart,
  Activity
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import type { TooltipProps } from 'recharts';
import { BarChart, Bar } from 'recharts';
import { useNavigate, useLocation, Routes, Route } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// CRA

const sidebarIcons = [
  <Home size={20} />, // Dashboard
  <Pill size={20} />, // Medications
  <Trophy size={20} />, // Challenges
  <BarChart2 size={20} />, // Health Insights
  <Calendar size={20} />, // Appointments
  <Bell size={20} />, // Notifications
];

const Logo = () => (
  <div className="font-bold text-xl flex items-center gap-2">
    <span className="bg-orange-500 rounded-full w-6 h-6 inline-block" /> ARMED
  </div>
);

// Add a dynamic UserProfile component that takes user as a prop
const UserProfile = ({ user }: { user: { name: string; email: string; avatar: string } }) => {
  const isGuest = !user.name && !user.email && !user.avatar;
  return (
    <div className="flex items-center gap-3 p-4 rounded-xl bg-sidebar-accent mt-auto">
      <img
        src={isGuest ? 'https://ui-avatars.com/api/?name=Guest&background=cccccc&color=555555' : user.avatar}
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

const sidebarLinks = [
  "Dashboard",
  "Medications",
  "Challenges",
  "Health Insights",
  "Appointments",
  "Notifications",
];

const medications = [
  { name: "Metformin", qty: "1 pill", dosage: "500 mg", status: "Missed", time: "12:30" },
  { name: "Omega 3", qty: "3 pills", dosage: "800 mg", status: "Taken", time: "08:00" },
  { name: "Levothyroxine", qty: "2 pills", dosage: "50 mg", status: "Upcoming", time: "18:00" },
  { name: "Aspirin", qty: "1 pill", dosage: "100 mg", status: "Taken", time: "09:00" },
];

const glucoseData = [
  { time: 8, today: 60, yesterday: 40 },
  { time: 10, today: 120, yesterday: 100 },
  { time: 12, today: 70, yesterday: 80 },
  { time: 14, today: 60, yesterday: 80 },
  { time: 16, today: 110, yesterday: 100 },
  { time: 18, today: 80, yesterday: 70 },
  { time: 20, today: 60, yesterday: 60 },
];

// Custom Tooltip for Recharts
const CustomTooltip = ({ active, payload, label }: TooltipProps<any, any>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-3 border border-gray-200">
        <div className="font-semibold text-gray-800 mb-1">Time: {label}:00</div>
        <div className="flex flex-col gap-1">
          <span className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-orange-500" />
            <span className="text-gray-700">Today: <span className="font-bold">{payload[0].value}</span></span>
          </span>
          <span className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-blue-200" />
            <span className="text-gray-700">Yesterday: <span className="font-bold">{payload[1].value}</span></span>
          </span>
        </div>
      </div>
    );
  }
  return null;
};

// Custom icon renderer for selected points
const CustomIcon = (props: any) => {
  const { cx, cy, payload } = props;
  // Show icon only for certain x values (e.g., 10, 14, 18)
  if ([10, 14, 18].includes(payload.time)) {
    return (
      <g>
        <circle cx={cx} cy={cy - 24} r={14} fill="#e5e7eb" />
        <foreignObject x={cx - 10} y={cy - 34} width={20} height={20}>
          <Cloud size={20} color="#b0c4de" />
        </foreignObject>
      </g>
    );
  }
  return null;
};

// Custom bar shape with cloud icon for selected bars
const CustomBar = (props: any) => {
  const { x, y, width, height, payload, fill } = props;
  const barRadius = width / 2; // fully rounded
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} rx={barRadius} fill={fill} />
      {[10, 14, 18].includes(payload.time) && (
        <g>
          <circle cx={x + width / 2} cy={y - 18} r={14} fill="#e5e7eb" />
          <foreignObject x={x + width / 2 - 10} y={y - 28} width={20} height={20}>
            <Cloud size={20} color="#b0c4de" />
          </foreignObject>
        </g>
      )}
    </g>
  );
};

type CareTeamMember = {
  name: string;
  role: string;
  img: string;
  badge?: number;
  unread?: boolean;
  messages?: string[];
};

type Medication = {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  time: string;
  instructions: string;
  startDate: string;
  endDate?: string;
  isActive: boolean;
};

type MedicationLog = {
  id: string;
  medicationId: string;
  date: string;
  time: string;
  status: 'taken' | 'missed' | 'skipped';
  notes?: string;
};

type MedicationReminder = {
  id: string;
  medicationId: string;
  time: string;
  days: string[];
  isActive: boolean;
};

type Challenge = {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly';
  target: number;
  current: number;
  unit: string;
  icon: React.ReactNode;
  color: string;
  points: number;
  isActive: boolean;
  startDate: string;
  endDate: string;
  participants: number;
  difficulty: 'easy' | 'medium' | 'hard';
};

type Badge = {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  isEarned: boolean;
  earnedDate?: string;
  points: number;
};

type LeaderboardEntry = {
  id: string;
  name: string;
  avatar: string;
  points: number;
  rank: number;
  challengesCompleted: number;
};

const MedicationsPage = () => {
  const [medications, setMedications] = useState<Medication[]>([
    {
      id: '1',
      name: 'Metformin',
      dosage: '500mg',
      frequency: 'Twice daily',
      time: '08:00, 20:00',
      instructions: 'Take with food',
      startDate: '2024-01-15',
      isActive: true
    },
    {
      id: '2',
      name: 'Omega 3',
      dosage: '1000mg',
      frequency: 'Once daily',
      time: '09:00',
      instructions: 'Take with breakfast',
      startDate: '2024-01-10',
      isActive: true
    },
    {
      id: '3',
      name: 'Levothyroxine',
      dosage: '50mcg',
      frequency: 'Once daily',
      time: '07:00',
      instructions: 'Take on empty stomach',
      startDate: '2024-01-01',
      isActive: true
    }
  ]);

  const [medicationLogs, setMedicationLogs] = useState<MedicationLog[]>([
    {
      id: '1',
      medicationId: '1',
      date: '2024-01-20',
      time: '08:00',
      status: 'taken',
      notes: 'Taken with breakfast'
    },
    {
      id: '2',
      medicationId: '1',
      date: '2024-01-20',
      time: '20:00',
      status: 'missed'
    },
    {
      id: '3',
      medicationId: '2',
      date: '2024-01-20',
      time: '09:00',
      status: 'taken'
    }
  ]);

  const [reminders, setReminders] = useState<MedicationReminder[]>([
    {
      id: '1',
      medicationId: '1',
      time: '08:00',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      isActive: true
    },
    {
      id: '2',
      medicationId: '1',
      time: '20:00',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      isActive: true
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showRemindersModal, setShowRemindersModal] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
  const [activeTab, setActiveTab] = useState<'today' | 'history' | 'add' | 'reminders'>('today');
  const [newMedication, setNewMedication] = useState({
    name: '',
    dosage: '',
    frequency: 'Once daily',
    time: '',
    instructions: ''
  });
  const [toast, setToast] = useState('');

  const today = new Date().toISOString().slice(0, 10);
  const todayLogs = medicationLogs.filter(log => log.date === today);

  const getTodayMedications = () => {
    return medications.filter(med => med.isActive).map(med => {
      const times = med.time.split(', ');
      const todayLogsForMed = todayLogs.filter(log => log.medicationId === med.id);
      
      return times.map(time => ({
        ...med,
        time,
        status: todayLogsForMed.find(log => log.time === time)?.status || 'pending'
      }));
    }).flat();
  };

  const handleTakeMedication = (medicationId: string, time: string) => {
    const newLog: MedicationLog = {
      id: Date.now().toString(),
      medicationId,
      date: today,
      time,
      status: 'taken',
      notes: 'Taken on time'
    };
    setMedicationLogs(prev => [...prev, newLog]);
  };

  const handleSkipMedication = (medicationId: string, time: string) => {
    const newLog: MedicationLog = {
      id: Date.now().toString(),
      medicationId,
      date: today,
      time,
      status: 'skipped',
      notes: 'Skipped by user'
    };
    setMedicationLogs(prev => [...prev, newLog]);
    setToast('Medication marked as skipped');
    setTimeout(() => setToast(''), 3000);
  };

  const handleMissedMedication = (medicationId: string, time: string) => {
    const newLog: MedicationLog = {
      id: Date.now().toString(),
      medicationId,
      date: today,
      time,
      status: 'missed',
      notes: 'Missed dose'
    };
    setMedicationLogs(prev => [...prev, newLog]);
    setToast('Medication marked as missed');
    setTimeout(() => setToast(''), 3000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'taken':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'missed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'skipped':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'taken':
        return 'Taken';
      case 'missed':
        return 'Missed';
      case 'skipped':
        return 'Skipped';
      default:
        return 'Pending';
    }
  };

  const handleAddMedication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedication.name || !newMedication.dosage || !newMedication.time) {
      setToast('Please fill in all required fields');
      setTimeout(() => setToast(''), 3000);
      return;
    }

    const medication: Medication = {
      id: Date.now().toString(),
      name: newMedication.name,
      dosage: newMedication.dosage,
      frequency: newMedication.frequency,
      time: newMedication.time,
      instructions: newMedication.instructions,
      startDate: new Date().toISOString().slice(0, 10),
      isActive: true
    };

    setMedications(prev => [...prev, medication]);
    setNewMedication({
      name: '',
      dosage: '',
      frequency: 'Once daily',
      time: '',
      instructions: ''
    });
    setShowAddModal(false);
    setToast('Medication added successfully!');
    setTimeout(() => setToast(''), 3000);
  };

  const handleToggleReminder = (reminderId: string) => {
    setReminders(prev => prev.map(reminder => 
      reminder.id === reminderId 
        ? { ...reminder, isActive: !reminder.isActive }
        : reminder
    ));
  };

  return (
    <div className="space-y-6 ">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-card text-card-foreground rounded-xl p-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Medications</h1>
          <p className="text-muted-foreground">Track daily medicines and dosage</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} variant="default" className="w-full mt-4 sm:w-auto sm:mt-0">
          <Plus className="w-4 h-4 mr-2" />
          Add Medication
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('today')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'today' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Today's Medications
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'history' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <History className="w-4 h-4 mr-2 inline" />
          History
        </button>
        <button
          onClick={() => setActiveTab('reminders')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'reminders' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Bell className="w-4 h-4 mr-2 inline" />
          Reminders
        </button>
      </div>

      {/* Content */}
      {activeTab === 'today' && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Today's Medications</h2>
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Pill className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Today</p>
                  <p className="text-xl font-bold text-foreground">{getTodayMedications().length}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Taken</p>
                  <p className="text-xl font-bold text-green-600">
                    {getTodayMedications().filter(med => med.status === 'taken').length}
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-red-100 rounded-lg">
                  <XCircle className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Missed</p>
                  <p className="text-xl font-bold text-red-600">
                    {getTodayMedications().filter(med => med.status === 'missed').length}
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="w-4 h-4 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-xl font-bold text-yellow-600">
                    {getTodayMedications().filter(med => med.status === 'pending').length}
                  </p>
                </div>
              </div>
            </Card>
          </div>
          <div className="grid gap-4">
            {getTodayMedications().map((med, index) => (
              <Card key={`${med.id}-${med.time}`} className="p-4">
                <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-2">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Pill className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{med.name}</h3>
                      <p className="text-sm text-muted-foreground">{med.dosage} • {med.time}</p>
                      <p className="text-xs text-muted-foreground">{med.instructions}</p>
                    </div>
                  </div>
                  <div className="flex flex-row sm:flex-row gap-2 w-full sm:w-auto justify-center sm:justify-start mt-2 sm:mt-0 mx-auto">
                    {med.status === 'pending' && (
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          onClick={() => handleTakeMedication(med.id, med.time)}
                          className="bg-green-500 hover:bg-green-600 text-white"
                        >
                          Take
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSkipMedication(med.id, med.time)}
                        >
                          Skip
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMissedMedication(med.id, med.time)}
                          className="text-red-600 border-red-600 hover:bg-red-50"
                        >
                          Missed
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Medication History</h2>
          <div className="space-y-2">
            {medicationLogs.slice().reverse().map((log) => {
              const medication = medications.find(med => med.id === log.medicationId);
              return (
                <Card key={log.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">{medication?.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(log.date).toLocaleDateString()} at {log.time}
                      </p>
                      {log.notes && <p className="text-xs text-muted-foreground">{log.notes}</p>}
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(log.status)}
                      <span className={`text-sm font-medium ${
                        log.status === 'taken' ? 'text-green-600' :
                        log.status === 'missed' ? 'text-red-600' :
                        'text-yellow-600'
                      }`}>
                        {getStatusText(log.status)}
                      </span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'reminders' && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Medication Reminders</h2>
          <div className="grid gap-4">
            {reminders.map((reminder) => {
              const medication = medications.find(med => med.id === reminder.medicationId);
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
      )}

      {/* Add Medication Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-card text-card-foreground rounded-lg p-6 shadow-lg min-w-[400px] w-full max-w-md border">
            <h2 className="text-xl font-bold mb-4">Add New Medication</h2>
            <form onSubmit={handleAddMedication} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Medication Name *</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2 bg-background text-foreground"
                  placeholder="e.g., Metformin"
                  value={newMedication.name}
                  onChange={(e) => setNewMedication(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Dosage *</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2 bg-background text-foreground"
                  placeholder="e.g., 500mg"
                  value={newMedication.dosage}
                  onChange={(e) => setNewMedication(prev => ({ ...prev, dosage: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Frequency</label>
                <select 
                  className="w-full border rounded px-3 py-2 bg-background text-foreground"
                  value={newMedication.frequency}
                  onChange={(e) => setNewMedication(prev => ({ ...prev, frequency: e.target.value }))}
                >
                  <option>Once daily</option>
                  <option>Twice daily</option>
                  <option>Three times daily</option>
                  <option>As needed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Time(s) *</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2 bg-background text-foreground"
                  placeholder="e.g., 08:00, 20:00"
                  value={newMedication.time}
                  onChange={(e) => setNewMedication(prev => ({ ...prev, time: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Instructions</label>
                <textarea
                  className="w-full border rounded px-3 py-2 bg-background text-foreground"
                  placeholder="e.g., Take with food"
                  rows={3}
                  value={newMedication.instructions}
                  onChange={(e) => setNewMedication(prev => ({ ...prev, instructions: e.target.value }))}
                />
              </div>
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Add Medication
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50 transition">
          {toast}
        </div>
      )}
    </div>
  );
};

const ChallengesPage = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: '1',
      title: 'Daily Steps Goal',
      description: 'Walk 5,000 steps today to stay active',
      type: 'daily',
      target: 5000,
      current: 3200,
      unit: 'steps',
      icon: <Activity size={24} />,
      color: 'bg-blue-500',
      points: 50,
      isActive: true,
      startDate: '2024-01-20',
      endDate: '2024-01-20',
      participants: 1247,
      difficulty: 'easy'
    },
    {
      id: '2',
      title: 'Weekly Workout Streak',
      description: 'Complete 5 workouts this week',
      type: 'weekly',
      target: 5,
      current: 3,
      unit: 'workouts',
      icon: <Zap size={24} />,
      color: 'bg-green-500',
      points: 200,
      isActive: true,
      startDate: '2024-01-15',
      endDate: '2024-01-21',
      participants: 892,
      difficulty: 'medium'
    },
    {
      id: '3',
      title: 'Hydration Master',
      description: 'Drink 8 glasses of water daily',
      type: 'daily',
      target: 8,
      current: 6,
      unit: 'glasses',
      icon: <Heart size={24} />,
      color: 'bg-cyan-500',
      points: 30,
      isActive: true,
      startDate: '2024-01-20',
      endDate: '2024-01-20',
      participants: 2156,
      difficulty: 'easy'
    },
    {
      id: '4',
      title: 'Sleep Well Challenge',
      description: 'Get 8 hours of sleep for 7 days',
      type: 'weekly',
      target: 7,
      current: 4,
      unit: 'days',
      icon: <Star size={24} />,
      color: 'bg-purple-500',
      points: 150,
      isActive: true,
      startDate: '2024-01-15',
      endDate: '2024-01-21',
      participants: 567,
      difficulty: 'hard'
    }
  ]);

  const [badges, setBadges] = useState<Badge[]>([
    {
      id: '1',
      name: 'First Steps',
      description: 'Complete your first daily challenge',
      icon: <Trophy size={20} />,
      color: 'text-yellow-500',
      isEarned: true,
      earnedDate: '2024-01-15',
      points: 100
    },
    {
      id: '2',
      name: 'Week Warrior',
      description: 'Complete 5 weekly challenges',
      icon: <Award size={20} />,
      color: 'text-blue-500',
      isEarned: true,
      earnedDate: '2024-01-18',
      points: 250
    },
    {
      id: '3',
      name: 'Hydration Hero',
      description: 'Drink 8 glasses of water for 7 consecutive days',
      icon: <Heart size={20} />,
      color: 'text-cyan-500',
      isEarned: false,
      points: 300
    },
    {
      id: '4',
      name: 'Fitness Master',
      description: 'Complete 20 challenges total',
      icon: <Target size={20} />,
      color: 'text-green-500',
      isEarned: false,
      points: 500
    }
  ]);

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      points: 2840,
      rank: 1,
      challengesCompleted: 23
    },
    {
      id: '2',
      name: 'Mike Chen',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      points: 2650,
      rank: 2,
      challengesCompleted: 21
    },
    {
      id: '3',
      name: 'Emma Davis',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      points: 2420,
      rank: 3,
      challengesCompleted: 19
    },
    {
      id: '4',
      name: 'Alex Thompson',
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
      points: 2180,
      rank: 4,
      challengesCompleted: 17
    },
    {
      id: '5',
      name: 'Lisa Wang',
      avatar: 'https://randomuser.me/api/portraits/women/50.jpg',
      points: 1950,
      rank: 5,
      challengesCompleted: 15
    }
  ]);

  const [activeTab, setActiveTab] = useState<'challenges' | 'badges' | 'leaderboard'>('challenges');
  const [userPoints, setUserPoints] = useState(1250);
  const [toast, setToast] = useState('');

  const handleJoinChallenge = (challengeId: string) => {
    setChallenges(prev => prev.map(challenge => 
      challenge.id === challengeId 
        ? { ...challenge, isActive: true, participants: challenge.participants + 1 }
        : challenge
    ));
    setToast('Challenge joined successfully!');
    setTimeout(() => setToast(''), 3000);
  };

  const handleLeaveChallenge = (challengeId: string) => {
    setChallenges(prev => prev.map(challenge => 
      challenge.id === challengeId 
        ? { ...challenge, isActive: false, participants: Math.max(0, challenge.participants - 1) }
        : challenge
    ));
    setToast('Challenge left successfully!');
    setTimeout(() => setToast(''), 3000);
  };

  const handleUpdateProgress = (challengeId: string, newProgress: number) => {
    setChallenges(prev => prev.map(challenge => 
      challenge.id === challengeId 
        ? { ...challenge, current: Math.min(challenge.target, newProgress) }
        : challenge
    ));
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min(100, (current / target) * 100);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'daily': return 'text-blue-600 bg-blue-100';
      case 'weekly': return 'text-purple-600 bg-purple-100';
      case 'monthly': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Challenges</h1>
          <p className="text-muted-foreground">Engage with fun health-related goals</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">{userPoints}</div>
            <div className="text-sm text-muted-foreground">Total Points</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">
              {challenges.filter(c => c.isActive).length}
            </div>
            <div className="text-sm text-muted-foreground">Active</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('challenges')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'challenges' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Target className="w-4 h-4 mr-2 inline" />
          Challenges
        </button>
        <button
          onClick={() => setActiveTab('badges')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'badges' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Award className="w-4 h-4 mr-2 inline" />
          Badges
        </button>
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'leaderboard' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Users className="w-4 h-4 mr-2 inline" />
          Leaderboard
        </button>
      </div>

      {/* Content */}
      {activeTab === 'challenges' && (
        <div className="space-y-6">
          <div className="grid gap-6">
            {challenges.map((challenge) => (
              <div className="w-full min-w-0">
                <Card key={challenge.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className={`p-3 rounded-lg ${challenge.color} text-white`}>
                        {challenge.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-foreground">{challenge.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(challenge.type)}`}>
                            {challenge.type}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                            {challenge.difficulty}
                          </span>
                        </div>
                        <p className="text-muted-foreground mb-3">{challenge.description}</p>
                        
                        {/* Progress Bar */}
                        <div className="mb-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="text-foreground font-medium">
                              {challenge.current} / {challenge.target} {challenge.unit}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${challenge.color.replace('bg-', 'bg-')}`}
                              style={{ width: `${getProgressPercentage(challenge.current, challenge.target)}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Award className="w-4 h-4" />
                              {challenge.points} pts
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {challenge.participants}
                            </span>
                          </div>
                          
                          {challenge.isActive ? (
                            <div className="flex flex-row gap-2 w-full sm:w-auto justify-center sm:justify-end mt-2 sm:mt-0 mx-auto flex-wrap">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleLeaveChallenge(challenge.id)}
                                className="text-red-600 border-red-600 hover:bg-red-50"
                              >
                                Leave
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleUpdateProgress(challenge.id, challenge.current + 1)}
                                disabled={challenge.current >= challenge.target}
                              >
                                Update Progress
                              </Button>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => handleJoinChallenge(challenge.id)}
                            >
                              Join Challenge
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'badges' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {badges.map((badge) => (
              <Card key={badge.id} className={`p-6 text-center transition-all duration-300 ${
                badge.isEarned ? 'ring-2 ring-green-200 bg-green-50/50' : 'opacity-75'
              }`}>
                <div className={`mx-auto mb-4 p-3 rounded-full w-16 h-16 flex items-center justify-center ${
                  badge.isEarned ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  <div className={badge.color}>
                    {badge.icon}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{badge.name}</h3>
                <p className="text-muted-foreground mb-3">{badge.description}</p>
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Award className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium">{badge.points} points</span>
                </div>
                {badge.isEarned ? (
                  <div className="text-green-600 text-sm font-medium">
                    ✓ Earned {badge.earnedDate && `on ${new Date(badge.earnedDate).toLocaleDateString()}`}
                  </div>
                ) : (
                  <div className="text-muted-foreground text-sm">
                    Not earned yet
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'leaderboard' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Top Performers</h2>
            <div className="space-y-3">
              {leaderboard.map((entry, index) => (
                <div key={entry.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                      {entry.rank}
                    </div>
                    <img src={entry.avatar} alt={entry.name} className="w-10 h-10 rounded-full" />
                    <div>
                      <div className="font-medium text-foreground">{entry.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {entry.challengesCompleted} challenges completed
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-foreground">{entry.points} pts</div>
                    <div className="text-sm text-muted-foreground">Rank #{entry.rank}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Toast notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50 transition">
          {toast}
        </div>
      )}
    </div>
  );
};

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

// HealthInsights component
function HealthInsights() {
  const width = useWindowWidth();
  let barSize = 16;
  if (width < 500) barSize = 8;
  else if (width < 900) barSize = 12;
  const lineStroke = width < 600 ? 1 : width < 900 ? 2 : 3;
  const [compare, setCompare] = React.useState("today");
  const [dateRange, setDateRange] = React.useState({ from: "", to: "" });

  const glucoseData = [
    { label: "6am", today: 90, yesterday: 85 },
    { label: "8am", today: 110, yesterday: 100 },
    { label: "10am", today: 130, yesterday: 120 },
    { label: "12pm", today: 150, yesterday: 140 },
    { label: "2pm", today: 120, yesterday: 110 },
    { label: "4pm", today: 100, yesterday: 95 },
    { label: "6pm", today: 105, yesterday: 100 },
  ];
  const heartRateData = [
    { label: "Mon", avg: 76 },
    { label: "Tue", avg: 80 },
    { label: "Wed", avg: 78 },
    { label: "Thu", avg: 74 },
    { label: "Fri", avg: 82 },
    { label: "Sat", avg: 79 },
    { label: "Sun", avg: 77 },
  ];
  const sleepData = [
    { label: "Mon", hours: 7.2 },
    { label: "Tue", hours: 6.8 },
    { label: "Wed", hours: 8.1 },
    { label: "Thu", hours: 7.5 },
    { label: "Fri", hours: 7.9 },
    { label: "Sat", hours: 8.3 },
    { label: "Sun", hours: 7.7 },
  ];
  const stepsData = [
    { label: "Mon", steps: 6500 },
    { label: "Tue", steps: 7200 },
    { label: "Wed", steps: 8000 },
    { label: "Thu", steps: 9000 },
    { label: "Fri", steps: 7500 },
    { label: "Sat", steps: 10000 },
    { label: "Sun", steps: 8500 },
  ];
  const aiInsights = [
    "Your sugar spiked after lunch consistently this week.",
    "You sleep longer on weekends.",
    "Heart rate is slightly higher on Fridays.",
    "Step count peaked on Saturday!"
  ];

  return (
    <div className="p-4 space-y-6 max-w-7xl mx-auto w-full max-w-full min-w-0 overflow-x-hidden">
      <h1 className="text-2xl font-bold mb-2">Health Insights</h1>
      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-2 w-full max-w-full min-w-0 overflow-x-hidden">
        <Tabs value={compare} onValueChange={setCompare} className="w-full md:w-auto">
          <TabsList>
            <TabsTrigger value="today">Today vs Yesterday</TabsTrigger>
            <TabsTrigger value="week">Last 7 Days</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-sm">From</span>
          <input type="date" value={dateRange.from} onChange={e => setDateRange({ ...dateRange, from: e.target.value })} className="h-8 w-32 border rounded px-2" />
          <span className="text-sm">To</span>
          <input type="date" value={dateRange.to} onChange={e => setDateRange({ ...dateRange, to: e.target.value })} className="h-8 w-32 border rounded px-2" />
        </div>
      </div>
      {/* Graphs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-full min-w-0 overflow-x-hidden">
        {/* Glucose */}
        <Card className="h-80 flex flex-col w-full min-w-0">
          <CardHeader>
            <CardTitle>Blood Glucose</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex items-center w-full min-w-0">
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={glucoseData} barSize={barSize}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="today" fill="#ff5722" name="Today" barSize={barSize} />
                <Bar dataKey="yesterday" fill="#b0c4de" name="Yesterday" barSize={barSize} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        {/* Heart Rate */}
        <Card className="h-80 flex flex-col w-full min-w-0">
          <CardHeader>
            <CardTitle>Heart Rate</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex items-center w-full min-w-0">
            <ResponsiveContainer width="100%" height="90%">
              <LineChart data={heartRateData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="avg" stroke="#4f8cff" name="Avg BPM" strokeWidth={lineStroke} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        {/* Sleep */}
        <Card className="h-80 flex flex-col w-full min-w-0">
          <CardHeader>
            <CardTitle>Sleep</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex items-center w-full min-w-0">
            <ResponsiveContainer width="100%" height="90%">
              <LineChart data={sleepData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="hours" stroke="#7c3aed" name="Hours" strokeWidth={lineStroke} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        {/* Steps */}
        <Card className="h-80 flex flex-col w-full min-w-0">
          <CardHeader>
            <CardTitle>Steps</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex items-center w-full min-w-0">
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={stepsData} barSize={barSize}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="steps" fill="#22c55e" name="Steps" barSize={barSize} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      {/* AI Insights */}
      <Card className="mt-6 w-full min-w-0">
        <CardHeader>
          <CardTitle>AI Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-6 space-y-1 text-base">
            {aiInsights.map((insight, i) => (
              <li key={i}>{insight}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

function AppointmentsPage() {
  const [appointments, setAppointments] = React.useState([
    { id: 1, doctor: "Dr. Smith", date: "2024-07-25", time: "10:00", telehealth: true, status: "upcoming" },
    { id: 2, doctor: "Dr. Lee", date: "2024-07-20", time: "15:30", telehealth: false, status: "upcoming" },
    { id: 3, doctor: "Dr. Patel", date: "2024-06-10", time: "09:00", telehealth: true, status: "completed" },
    { id: 4, doctor: "Dr. Smith", date: "2024-05-15", time: "11:00", telehealth: false, status: "cancelled" },
  ]);
  const [form, setForm] = React.useState({ doctor: "", date: "", time: "", telehealth: false });
  const [showForm, setShowForm] = React.useState(false);
  const [apptRescheduleId, setApptRescheduleId] = React.useState<number | null>(null);

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
  };

  const handleCancel = (id: number) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: "cancelled" } : a));
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
  };

  const handleJoin = (id: number) => {
    alert("Joining video call for appointment " + id);
  };

  const upcoming = appointments.filter(a => a.status === "upcoming");
  const history = appointments.filter(a => a.status !== "upcoming");

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Appointments</h1>
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded shadow hover:bg-primary/90" onClick={() => { setShowForm(true); setApptRescheduleId(null); }}>Book New Appointment</button>
      </div>
      {/* Upcoming Appointments */}
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
      {/* Appointment History */}
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
      {/* Book/Reschedule Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
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
        </div>
      )}
    </div>
  );
}

function NotificationsPage() {
  type NotificationType = "Medication" | "Appointments" | "Challenge" | "System";
  type Notification = {
    id: number;
    type: NotificationType;
    title: string;
    desc: string;
    read: boolean;
    time: string;
  };
  const [notifications, setNotifications] = React.useState<Notification[]>([
    { id: 1, type: "Medication", title: "Take Metformin", desc: "It's time to take your 8am dose.", read: false, time: "08:00" },
    { id: 2, type: "Appointments", title: "Upcoming Appointment", desc: "You have an appointment with Dr. Smith tomorrow at 10:00.", read: false, time: "Yesterday" },
    { id: 3, type: "Challenge", title: "Daily Steps Challenge", desc: "You are 500 steps away from your daily goal!", read: true, time: "Today" },
    { id: 4, type: "System", title: "Profile Updated", desc: "Your profile was updated successfully.", read: true, time: "2 days ago" },
    { id: 5, type: "Medication", title: "Missed Dose", desc: "You missed your 8pm medication yesterday.", read: false, time: "Yesterday" },
    { id: 6, type: "Appointments", title: "Appointment Cancelled", desc: "Your appointment with Dr. Lee was cancelled.", read: true, time: "3 days ago" },
  ]);
  const [notifFilter, setNotifFilter] = React.useState<string>("All");
  const [settings, setSettings] = React.useState<{ [key: string]: boolean }>({ Medication: true, Appointments: true, Challenge: true, System: true });

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
}

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showHeaderContent, setShowHeaderContent] = useState(true);
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
  const navigate = useNavigate();
  const location = useLocation();
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
  // Add state for showing the Care Team modal
  const [showCareTeamModal, setShowCareTeamModal] = useState(false);
  // Add state for showing the login modal
  const [showLoginModal, setShowLoginModal] = useState(false);
  // Add state for login form fields
  const [loginForm, setLoginForm] = useState({ email: '', password: '', name: '' });
  const defaultAvatar = 'https://ui-avatars.com/api/?name=User&background=cccccc&color=555555';

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

  const filteredCareTeam = careTeam.filter(
    member =>
      member.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      member.role.toLowerCase().includes(searchValue.toLowerCase())
  );

  const filteredMedications = medications.filter(
    med =>
      med.name.toLowerCase().includes(searchValue.toLowerCase())
  );

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

  const width = useWindowWidth();
  let barSize = 16;
  if (width < 500) barSize = 8;
  else if (width < 900) barSize = 12;

  return (
    <SidebarProvider>
              <div className="h-screen w-screen overflow-hidden flex flex-col bg-sidebar">
        {/* Header */}
        <header className="flex items-center justify-between px-4 pb-2 md:px-8 py-4 bg-sidebar sticky top-0 z-20">
          <div className="flex items-center gap-4 md:gap-8">
            <button
              className="md:hidden mr-2"
              onClick={() => setSidebarOpen((v) => !v)}
              aria-label="Open sidebar"
            >
              <span className="text-2xl">☰</span>
            </button>
            <Logo />
            {/* 1. Search bar with icon inside and clear button */}
            {/* Replace the search bar in the header with the following: */}
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

        <div className="flex flex-1 flex-col md:flex-row overflow-hidden bg-sidebar">
          {/* Sidebar */}
          <aside
            className={`
              fixed md:static z-30 top-0 left-0 h-full md:h-auto bg-sidebar p-6 w-64
              flex flex-col transition-transform duration-200
              ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
            `}
          >
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
                <div className="relative ">
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
                
                <span className="text-sm text-muted-foreground flex items-center gap-1 mt-2">``
                  <CalendarDays size={16} /> Today
                </span>
              </div>
            </nav>
            <div onClick={() => {
              if (!user.name) {
                setShowLoginModal(true);
              } else {
                setShowProfileModal(true);
              }
            }} className="cursor-pointer">
              <UserProfile user={user} />
            </div>
          </aside>

          {sidebarOpen && <div className="fixed inset-0 bg-black/30 z-20 md:hidden" onClick={() => setSidebarOpen(false)} />}

          {/* Main Content */}
          <main className="flex-1 p-2 sm:p-4 md:p-6 overflow-y-auto space-y-2 bg-sidebar">
            <Routes>
              <Route path="/dashboard" element={
                <>
                  {/* Dashboard content (header row, chart, care team, medication schedule) */}
                  {/* Header row (Welcome, Silvia! + stats + button) */}
                  <section className="w-full mb-4">
                    <div className="flex flex-col sm:flex-row flex-wrap items-center sm:items-stretch justify-between w-full gap-2 bg-transparent min-h-0 py-2 overflow-x-hidden">
                      {/* Greeting */}
                      <h1 className="text-2xl md:text-3xl font-bold flex-1 text-foreground whitespace-nowrap">Welcome, {user.name || 'Guest'}!</h1>
                      {/* Stats and Button */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-1 justify-end w-full min-w-0">
                        {/* Glucose lvl */}
                        <div className="flex flex-col items-center px-2 sm:px-4">
                          <span className="text-xs text-muted-foreground mb-1">Glucose lvl</span>
                          <span className="text-2xl font-bold text-foreground">102 <span className="text-base font-normal">mg/dL</span></span>
                        </div>
                        {/* Divider */}
                        <div className="hidden sm:block h-8 w-px bg-border mx-4" />
                        {/* Water intake */}
                        <div className="flex flex-col items-center px-2 sm:px-4">
                          <span className="text-xs text-muted-foreground mb-1">Water intake</span>
                          <span className="text-2xl font-bold text-foreground">2.2 <span className="text-base font-normal">Liters</span></span>
                        </div>
                        {/* Divider */}
                        <div className="hidden sm:block h-8 w-px bg-transparent mx-1" />
                        {/* Schedule Visit Button */}
                        <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-6 py-2 text-base font-semibold whitespace-nowrap shadow-md w-full sm:w-auto mt-2 sm:mt-0" onClick={() => setShowScheduleModal(true)}>
                          Schedule Visit +
                        </Button>
                      </div>
                    </div>
                  </section>

                  {/* Fitness Goals and Blood Glucose Trends */}
                  <section className="flex flex-col w-10 lg:flex-row gap-2 mb-2 w-full">
                    {visibleSections.fitnessGoals && (
                      <div className="flex-1 min-w-0 mb-2 lg:mb-0">
                        <Card className="w-full h-80 bg-gradient-to-br from-[#0a1a3a] to-[#1a2a5a] text-white cursor-pointer" onClick={() => setShowFitnessModal(true)}>
                          <CardHeader className="flex justify-between items-center">
                            <CardTitle>Fitness Goals</CardTitle>
                            <Button variant="link" className="text-xs p-0 text-white">See all</Button>
                          </CardHeader>
                          <CardContent className="flex flex-col items-center justify-center h-full">
                            {/* You can replace this SVG with your own chart/graphic if needed */}
                            <svg width="180" height="90" viewBox="0 0 180 90" fill="none">
                              <path d="M0 70 Q 45 10 90 70 T 180 70" stroke="#4f8cff" strokeWidth="2" fill="none" />
                            </svg>
                            <div className="text-5xl font-bold mt-2">80%</div>
                            
                            <Button className="mt-4 w-full bg-white/10 text-white rounded-full">Complete 5 Workouts <span className="ml-2">4/5</span></Button>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                    {visibleSections.glucoseTrends && (
                      <div className="flex-1 min-w-0 mb-2 lg:mb-0">
                        <Card className="w-full h-80 px-2">
                          <CardHeader>
                            <div className="flex items-center justify-between w-full">
                              <CardTitle>Blood Glucose Trends</CardTitle>
                              <div className="flex gap-4 text-xs">
                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500 inline-block" /> Today</span>
                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-200 inline-block" /> Yesterday</span>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="text-xs font-bold text-foreground mb-2 ml-2">Mg/dL</div>
                            <div className="h-56 flex items-center justify-center text-gray-400 w-full">
                              <ResponsiveContainer width="100%" height={220}>
                                <BarChart
                                  data={glucoseData}
                                  barGap={8}
                                  barCategoryGap={30}
                                  barSize={barSize}
                                  margin={{ left: 32, right: 16, top: 0, bottom: 0 }}
                                >
                                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                  <XAxis
                                    dataKey="time"
                                    type="number"
                                    domain={[6, 20]}
                                    ticks={[6, 8, 10, 12, 14, 16, 18, 20]}
                                    tick={{ fill: 'currentColor', fontSize: 14 }}
                                    axisLine={false}
                                    tickLine={false}
                                  />
                                  <YAxis
                                    domain={[20, 120]}
                                    ticks={[20, 60, 80, 100, 120]}
                                    tick={{ fill: 'currentColor', fontSize: 14 }}
                                    axisLine={false}
                                    tickLine={false}
                                  />
                                  <Tooltip content={(props) => <CustomTooltip {...props} />} cursor={{ fill: '#f3f4f6', opacity: 0.5 }} />
                                  <Bar dataKey="today" fill="#ff5722" shape={<CustomBar fill="#ff5722" />} barSize={barSize} />
                                  <Bar dataKey="yesterday" fill="#b0c4de" shape={<CustomBar fill="#b0c4de" />} barSize={barSize} />
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </section>

                  {/* My Care Team and Medication Schedule */}
                  <section className="flex flex-col lg:flex-row gap-2 w-full">
                    {visibleSections.careTeam && (
                      <div className="flex-1 min-w-0 mb-2 lg:mb-0 h-full">
                        <Card className="w-full h-full min-h-[420px] flex flex-col">
                          <CardHeader className="flex justify-between">
                            <CardTitle>My Care Team</CardTitle>
                            <Button variant="link" className="text-xs p-0" onClick={() => setShowCareTeamModal(true)}>See all</Button>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-4">
                              {filteredCareTeam.map((member) => (
                                <li
                                  key={member.name}
                                  className="flex items-center gap-3 cursor-pointer hover:bg-accent rounded transition"
                                  onClick={() => {
                                    setSelectedMember(member);
                                    if (member.name === "Zain Curtis" && member.unread) {
                                      setCareTeam(prev =>
                                        prev.map(m =>
                                          m.name === "Zain Curtis"
                                            ? { name: m.name, role: m.role, img: m.img }
                                            : m
                                        )
                                      );
                                    }
                                  }}
                                >
                                  <img src={member.img} alt={member.name} className="w-8 h-8 sm:w-9 sm:h-9 rounded-full" />
                                  <div className="flex-1">
                                    <div className="font-medium text-sm sm:text-base">{member.name}</div>
                                    <div className="text-xs text-gray-500">{member.role}</div>
                                  </div>
                                  {member.badge && member.unread && (
                                    <span className="bg-blue-100 text-blue-600 text-xs rounded-full px-2 py-0.5">{member.badge}</span>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                    {visibleSections.medicationSchedule && (
                      <div className="flex-1 min-w-0 mb-2 lg:mb-0 h-full">
                        <Card className="w-full h-full min-h-[420px] flex flex-col">
                          <CardHeader className="flex flex-col sm:flex-row sm:justify-between">
                            <div className="flex items-center justify-between w-full">
                              <CardTitle>Medication Schedule</CardTitle>
                            </div>
                            <Button variant="link" className="text-xs p-0 self-end sm:self-auto">Any status</Button>
                          </CardHeader>
                          <CardContent>
                            <div className="w-full overflow-x-auto">
                              <table className="min-w-[400px] w-full text-xs sm:text-sm">
                                <thead>
                                  <tr className="text-muted-foreground">
                                    <th className="text-left sticky-col">Medication</th>
                                    <th>Qty</th>
                                    <th>Dosage</th>
                                    <th>Status</th>
                                    <th>Time</th>
                                    <th className="text-center">Action</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {filteredMedications.map((med, idx) => (
                                    <tr key={med.name} className="border-t align-middle hover:bg-accent transition-colors">
                                      <td className="py-3 sticky-col">{med.name}</td>
                                      <td className="py-3">{med.qty}</td>
                                      <td className="py-3">{med.dosage}</td>
                                      <td className="py-3">
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                                          med.status === "Missed" ? "bg-red-100 text-red-600" :
                                          med.status === "Taken" ? "bg-green-100 text-green-600" :
                                          "bg-yellow-100 text-yellow-700"
                                        }`}>{med.status}</span>
                                      </td>
                                      <td className="py-3">{med.time}</td>
                                      <td className="py-3 text-center">
                                        {med.status === "Taken" ? (
                                          <Button size="sm" className="rounded-full bg-gray-300 text-gray-500 cursor-not-allowed" disabled>
                                            Taken
                                          </Button>
                                        ) : (
                                          <Button
                                            size="sm"
                                            className="rounded-full cursor-pointer"
                                            onClick={() => handleTake(idx)}
                                          >
                                            Take
                                          </Button>
                                        )}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </section>
                </>
              } />
              <Route path="/medications" element={<MedicationsPage />} />
              <Route path="/challenges" element={<ChallengesPage />} />
              <Route path="/health-insights" element={<HealthInsights />} />
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
                  className="flex-1 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                  onClick={() => setShowDateModal(false)}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
        {showCareTeamModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-card text-card-foreground rounded-lg p-6 shadow-lg min-w-[320px] w-full max-w-md border">
              <div className="font-bold text-lg mb-4">All Care Team Members</div>
              <ul className="space-y-4 mb-4">
                {careTeam.map((member) => (
                  <li key={member.name} className="flex items-center gap-3">
                    <img src={member.img} alt={member.name} className="w-10 h-10 rounded-full" />
                    <div>
                      <div className="font-medium">{member.name}</div>
                      <div className="text-xs text-gray-500">{member.role}</div>
                    </div>
                  </li>
                ))}
              </ul>
              <button className="w-full px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/80" onClick={() => setShowCareTeamModal(false)}>Close</button>
            </div>
          </div>
        )}
        {showLoginModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-card text-card-foreground rounded-lg p-6 shadow-lg min-w-[320px] w-full max-w-xs flex flex-col items-center border">
              <div className="font-bold text-lg mb-4">Login Required</div>
              <form
                className="w-full flex flex-col gap-3 mb-2"
                onSubmit={e => {
                  e.preventDefault();
                  setUser({ name: loginForm.name, email: loginForm.email, avatar: defaultAvatar });
                  setShowLoginModal(false);
                  setShowProfileModal(false);
                  setLoginForm({ email: '', password: '', name: '' });
                  setToast('Login successful!');
                  setTimeout(() => setToast(''), 2000);
                }}
              >
                <input
                  type="text"
                  placeholder="Profile Name"
                  className="border rounded px-3 py-2 bg-background text-foreground"
                  value={loginForm.name}
                  onChange={e => setLoginForm(f => ({ ...f, name: e.target.value }))}
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="border rounded px-3 py-2 bg-background text-foreground"
                  value={loginForm.email}
                  onChange={e => setLoginForm(f => ({ ...f, email: e.target.value }))}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="border rounded px-2 py-1 bg-background text-foreground"
                  value={loginForm.password}
                  onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))}
                  required
                />
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
                >
                  Login
                </button>
              </form>
              <button
                className="w-full px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/80"
                onClick={() => setShowLoginModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </SidebarProvider>
  );
}
