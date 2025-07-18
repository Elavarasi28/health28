import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type CareTeamMember = {
  name: string;
  role: string;
  img: string;
  badge?: number;
  unread?: boolean;
  messages?: string[];
};

interface MyCareTeamProps {
  filteredCareTeam: CareTeamMember[];
  setSelectedMember: (member: CareTeamMember | null) => void;
  setShowCareTeamModal: (show: boolean) => void;
}

const MyCareTeam: React.FC<MyCareTeamProps> = ({ filteredCareTeam, setSelectedMember, setShowCareTeamModal }) => (
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
              onClick={() => setSelectedMember(member)}
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
);

export default MyCareTeam; 