import React, { useState } from "react";
import Goals from "./challenges/Goals";
import ChallengeTab from "./challenges/Challenge";
import BadgesTab from "./challenges/Badges";
import LeaderboardTab from "./challenges/Leaderboard";
import { Target, Award, Users, Activity, Zap, Heart, Star, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

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
      <Goals userPoints={userPoints} activeCount={challenges.filter(c => c.isActive).length} />
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
        <ChallengeTab
          challenges={challenges}
          handleJoinChallenge={handleJoinChallenge}
          handleLeaveChallenge={handleLeaveChallenge}
          handleUpdateProgress={handleUpdateProgress}
          getProgressPercentage={getProgressPercentage}
          getDifficultyColor={getDifficultyColor}
          getTypeColor={getTypeColor}
        />
      )}
      {activeTab === 'badges' && (
        <BadgesTab badges={badges} />
      )}
      {activeTab === 'leaderboard' && (
        <LeaderboardTab leaderboard={leaderboard} />
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

export default ChallengesPage; 