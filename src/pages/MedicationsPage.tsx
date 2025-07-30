import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  History,
  Bell,
  Pill,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

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
      <div className="flex space-x-1 bg-muted p-1 rounded-lg my-4">
        <button
          onClick={() => setActiveTab('today')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'today' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Today's Medications
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'history' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
        >
          <History className="w-4 h-4 mr-2 inline" />
          History
        </button>
        <button
          onClick={() => setActiveTab('reminders')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'reminders' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
        >
          <Bell className="w-4 h-4 mr-2 inline" />
          Reminders
        </button>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'today' && (
          <motion.div
            key="today"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
          >
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
                    <div className="flex flex-col sm:flex-row items-center w-full gap-2 sm:gap-0">
                      {/* Info section */}
                      <div className="flex items-center gap-4 flex-1 min-w-0 w-full">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Pill className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{med.name}</h3>
                          <p className="text-sm text-muted-foreground">{med.dosage} • {med.time}</p>
                          <p className="text-xs text-muted-foreground">{med.instructions}</p>
                        </div>
                      </div>
                      {/* Button group */}
                      <div className="flex flex-row gap-2 justify-end items-center w-full sm:w-56 ml-0 sm:ml-4">
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
          </motion.div>
        )}

        {activeTab === 'history' && (
          <motion.div
            key="history"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
          >
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
          </motion.div>
        )}

        {activeTab === 'reminders' && (
          <motion.div
            key="reminder"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
          >
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
          </motion.div>
        )}
      </AnimatePresence>

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

export default MedicationsPage; 