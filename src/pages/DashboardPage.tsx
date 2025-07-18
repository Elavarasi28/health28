import React, { useState } from "react";
import Welcome from "./dashboard/Welcome";
import Fitness from "./dashboard/Fitness";
import BloodGlucose from "./dashboard/BloodGlucose";
import MyCareTeam from "./dashboard/MyCareTeam";
import MedicationSchedule from "./dashboard/MedicationSchedule";
import { Cloud } from "lucide-react";

// Custom Tooltip for Recharts
const CustomTooltip = ({ active, payload, label }: any) => {
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

const DashboardPage: React.FC = () => {
  const [user, setUser] = useState({ name: '', email: '', avatar: '' });
  const [medications, setMedications] = useState([
    { name: "Metformin", qty: "1 pill", dosage: "500 mg", status: "Missed", time: "12:30" },
    { name: "Omega 3", qty: "3 pills", dosage: "800 mg", status: "Taken", time: "08:00" },
    { name: "Levothyroxine", qty: "2 pills", dosage: "50 mg", status: "Upcoming", time: "18:00" },
    { name: "Aspirin", qty: "1 pill", dosage: "100 mg", status: "Taken", time: "09:00" },
    { name: "Atorvastatin", qty: "1 pill", dosage: "20 mg", status: "Upcoming", time: "21:00" },
  ]);
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
  const [searchValue, setSearchValue] = useState("");
  const [visibleSections, setVisibleSections] = useState({
    fitnessGoals: true,
    glucoseTrends: true,
    careTeam: true,
    medicationSchedule: true,
  });
  const [showFitnessModal, setShowFitnessModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showCareTeamModal, setShowCareTeamModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [scheduleForm, setScheduleForm] = useState({ date: '', time: '', reason: '' });
  const [toast, setToast] = useState("");
  const width = window.innerWidth;

  const glucoseData = [
    { time: 8, today: 60, yesterday: 40 },
    { time: 10, today: 120, yesterday: 100 },
    { time: 12, today: 70, yesterday: 80 },
    { time: 14, today: 60, yesterday: 80 },
    { time: 16, today: 110, yesterday: 100 },
    { time: 18, today: 80, yesterday: 70 },
    { time: 20, today: 60, yesterday: 60 },
  ];

  let barSize = 16;
  if (width < 500) barSize = 8;
  else if (width < 900) barSize = 12;

  const filteredCareTeam = careTeam.filter(
    member =>
      member.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      member.role.toLowerCase().includes(searchValue.toLowerCase())
  );

  const filteredMedications = medications.filter(
    med =>
      med.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleTake = (index: number) => {
    setMedications((prev) =>
      prev.map((med, i) =>
        i === index ? { ...med, status: "Taken" } : med
      )
    );
    setToast("Medication marked as taken!");
    setTimeout(() => setToast(""), 2000);
  };

  const handleSectionToggle = (section: keyof typeof visibleSections) => {
    setVisibleSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <>
      <Welcome user={user} setShowScheduleModal={setShowScheduleModal} />
      {/* Fitness Goals and Blood Glucose Trends */}
      <section className="flex flex-col w-10 lg:flex-row gap-2 mb-2 w-full">
        {visibleSections.fitnessGoals && (
          <Fitness setShowFitnessModal={setShowFitnessModal} />
        )}
        {visibleSections.glucoseTrends && (
          <BloodGlucose glucoseData={glucoseData} barSize={barSize} CustomTooltip={CustomTooltip} CustomBar={CustomBar} />
        )}
      </section>
      {/* My Care Team and Medication Schedule */}
      <section className="flex flex-col lg:flex-row gap-2 w-full">
        {visibleSections.careTeam && (
          <MyCareTeam filteredCareTeam={filteredCareTeam} setSelectedMember={setSelectedMember} setShowCareTeamModal={setShowCareTeamModal} />
        )}
        {visibleSections.medicationSchedule && (
          <MedicationSchedule filteredMedications={filteredMedications} handleTake={handleTake} />
        )}
      </section>
      {/* Toast message */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50 transition">
          {toast}
        </div>
      )}
    </>
  );
};

export default DashboardPage; 