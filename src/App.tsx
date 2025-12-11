import { useState, useEffect } from 'react';
import { Onboarding } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';
import { HealthTimeline } from './components/HealthTimeline';
import { Achievements } from './components/Achievements';
import { CopingMechanisms } from './components/CopingMechanisms';
import { Settings } from './components/Settings';
import { Calendar } from './components/Calendar';
import { Stats } from './components/Stats';
import { Home, Heart, Trophy, Lightbulb, Settings as SettingsIcon, CalendarDays, BarChart3 } from 'lucide-react';

export interface UserProfile {
  quitDate: string;
  dailyCigarettes: number;
  costPerPack: number;
  cigarettesPerPack: number;
  myWhy: string;
  setupComplete: boolean;
}

export interface CigaretteLog {
  id: string;
  timestamp: number;
  location?: string;
  cravingStrength?: number;
}

export interface CravingConquest {
  id: string;
  timestamp: number;
  points: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: number;
}

export default function App() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [currentView, setCurrentView] = useState<'dashboard' | 'calendar' | 'stats' | 'health' | 'achievements' | 'coping' | 'settings'>('dashboard');
  const [cigaretteLogs, setCigaretteLogs] = useState<CigaretteLog[]>([]);
  const [cravingConquests, setCravingConquests] = useState<CravingConquest[]>([]);
  const [quitPoints, setQuitPoints] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [achievements, setAchievements] = useState<Achievement[]>([
    { id: '1', name: '48 Hours Cleared', description: '48 hours smoke-free', icon: '🌅', unlocked: false },
    { id: '2', name: 'First Week Victory', description: '7 days smoke-free', icon: '🎯', unlocked: false },
    { id: '3', name: 'Conquered the Morning Crave', description: 'Conquered 10 cravings', icon: '☕', unlocked: false },
    { id: '4', name: '$100 Club', description: 'Saved $100', icon: '💰', unlocked: false },
    { id: '5', name: 'Halfway There', description: '15 days smoke-free', icon: '🌟', unlocked: false },
    { id: '6', name: 'Month Master', description: '30 days smoke-free', icon: '🏆', unlocked: false },
    { id: '7', name: 'Craving Crusher', description: 'Conquered 50 cravings', icon: '💪', unlocked: false },
    { id: '8', name: 'Smoke-Free Champion', description: '90 days smoke-free', icon: '👑', unlocked: false },
  ]);

  // Load data from localStorage
  useEffect(() => {
    const savedProfile = localStorage.getItem('quieresfumar_profile');
    const savedLogs = localStorage.getItem('quieresfumar_logs');
    const savedConquests = localStorage.getItem('quieresfumar_conquests');
    const savedPoints = localStorage.getItem('quieresfumar_points');
    const savedAchievements = localStorage.getItem('quieresfumar_achievements');
    const savedDarkMode = localStorage.getItem('quieresfumar_darkmode');
    if (savedProfile) setUserProfile(JSON.parse(savedProfile));
    if (savedLogs) setCigaretteLogs(JSON.parse(savedLogs));
    if (savedConquests) setCravingConquests(JSON.parse(savedConquests));
    if (savedPoints) setQuitPoints(JSON.parse(savedPoints));
    if (savedAchievements) setAchievements(JSON.parse(savedAchievements));
    if (savedDarkMode) {
      const isDark = JSON.parse(savedDarkMode);
      setDarkMode(isDark);
      if (isDark) {
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    if (userProfile) {
      localStorage.setItem('quieresfumar_profile', JSON.stringify(userProfile));
    }
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('quieresfumar_logs', JSON.stringify(cigaretteLogs));
  }, [cigaretteLogs]);

  useEffect(() => {
    localStorage.setItem('quieresfumar_conquests', JSON.stringify(cravingConquests));
  }, [cravingConquests]);

  useEffect(() => {
    localStorage.setItem('quieresfumar_points', JSON.stringify(quitPoints));
  }, [quitPoints]);

  useEffect(() => {
    localStorage.setItem('quieresfumar_achievements', JSON.stringify(achievements));
  }, [achievements]);

  useEffect(() => {
    localStorage.setItem('quieresfumar_darkmode', JSON.stringify(darkMode));
  }, [darkMode]);

  const handleSetupComplete = (profile: UserProfile) => {
    setUserProfile(profile);
  };

  const addCigaretteLog = (log: Omit<CigaretteLog, 'id'>) => {
    const newLog = { ...log, id: Date.now().toString() };
    setCigaretteLogs([...cigaretteLogs, newLog]);
  };

  const addCravingConquest = () => {
    const points = 10;
    const newConquest = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      points,
    };
    setCravingConquests([...cravingConquests, newConquest]);
    setQuitPoints(quitPoints + points);
    checkAndUnlockAchievements();
  };

  const checkAndUnlockAchievements = () => {
    if (!userProfile) return;

    const quitDate = new Date(userProfile.quitDate).getTime();
    const now = Date.now();
    const daysSinceQuit = Math.floor((now - quitDate) / (1000 * 60 * 60 * 24));
    const hoursSinceQuit = Math.floor((now - quitDate) / (1000 * 60 * 60));
    
    // Calculate money saved
    const costPerCigarette = userProfile.costPerPack / userProfile.cigarettesPerPack;
    const expectedCigarettes = userProfile.dailyCigarettes * (daysSinceQuit + 1);
    const cigarettesSmoked = cigaretteLogs.length;
    const cigarettesAvoided = Math.max(0, expectedCigarettes - cigarettesSmoked);
    const moneySaved = cigarettesAvoided * costPerCigarette;

    const lastCigarette = cigaretteLogs.length > 0 
      ? Math.max(...cigaretteLogs.map(log => log.timestamp))
      : quitDate;
    const hoursSinceLastCigarette = Math.floor((now - lastCigarette) / (1000 * 60 * 60));

    const updatedAchievements = achievements.map(achievement => {
      if (achievement.unlocked) return achievement;

      if (achievement.id === '1' && hoursSinceLastCigarette >= 48) {
        return { ...achievement, unlocked: true, unlockedAt: now };
      }
      if (achievement.id === '2' && hoursSinceLastCigarette >= 168) {
        return { ...achievement, unlocked: true, unlockedAt: now };
      }
      if (achievement.id === '3' && cravingConquests.length >= 10) {
        return { ...achievement, unlocked: true, unlockedAt: now };
      }
      if (achievement.id === '4' && moneySaved >= 100) {
        return { ...achievement, unlocked: true, unlockedAt: now };
      }
      if (achievement.id === '5' && daysSinceQuit >= 15 && cigaretteLogs.length === 0) {
        return { ...achievement, unlocked: true, unlockedAt: now };
      }
      if (achievement.id === '6' && daysSinceQuit >= 30 && cigaretteLogs.length === 0) {
        return { ...achievement, unlocked: true, unlockedAt: now };
      }
      if (achievement.id === '7' && cravingConquests.length >= 50) {
        return { ...achievement, unlocked: true, unlockedAt: now };
      }
      if (achievement.id === '8' && daysSinceQuit >= 90 && cigaretteLogs.length === 0) {
        return { ...achievement, unlocked: true, unlockedAt: now };
      }
      return achievement;
    });

    setAchievements(updatedAchievements);
  };

  useEffect(() => {
    if (userProfile) {
      checkAndUnlockAchievements();
    }
  }, [cigaretteLogs, cravingConquests, userProfile]);

  if (!userProfile || !userProfile.setupComplete) {
    return <Onboarding onComplete={handleSetupComplete} />;
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-b from-blue-50 to-green-50'} pb-20`}>
      {currentView === 'dashboard' && (
        <Dashboard
          userProfile={userProfile}
          cigaretteLogs={cigaretteLogs}
          cravingConquests={cravingConquests}
          quitPoints={quitPoints}
          onAddCigaretteLog={addCigaretteLog}
          onAddCravingConquest={addCravingConquest}
        />
      )}
      {currentView === 'calendar' && (
        <Calendar
          userProfile={userProfile}
          cigaretteLogs={cigaretteLogs}
        />
      )}
      {currentView === 'stats' && (
        <Stats
          userProfile={userProfile}
          cigaretteLogs={cigaretteLogs}
          cravingConquests={cravingConquests}
          quitPoints={quitPoints}
        />
      )}
      {currentView === 'health' && (
        <HealthTimeline
          userProfile={userProfile}
          cigaretteLogs={cigaretteLogs}
        />
      )}
      {currentView === 'achievements' && (
        <Achievements
          achievements={achievements}
          quitPoints={quitPoints}
        />
      )}
      {currentView === 'coping' && (
        <CopingMechanisms userProfile={userProfile} />
      )}
      {currentView === 'settings' && (
        <Settings
          userProfile={userProfile}
          onUpdateProfile={setUserProfile}
          onResetApp={() => {
            localStorage.clear();
            window.location.reload();
          }}
          onToggleDarkMode={setDarkMode}
        />
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 shadow-lg">
        <div className="flex justify-around items-center max-w-md mx-auto">
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
              currentView === 'dashboard' ? 'text-blue-600' : 'text-gray-500'
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs">Home</span>
          </button>
          <button
            onClick={() => setCurrentView('calendar')}
            className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
              currentView === 'calendar' ? 'text-blue-600' : 'text-gray-500'
            }`}
          >
            <CalendarDays className="w-6 h-6" />
            <span className="text-xs">Calendar</span>
          </button>
          <button
            onClick={() => setCurrentView('stats')}
            className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
              currentView === 'stats' ? 'text-blue-600' : 'text-gray-500'
            }`}
          >
            <BarChart3 className="w-6 h-6" />
            <span className="text-xs">Stats</span>
          </button>
          <button
            onClick={() => setCurrentView('health')}
            className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
              currentView === 'health' ? 'text-blue-600' : 'text-gray-500'
            }`}
          >
            <Heart className="w-6 h-6" />
            <span className="text-xs">Health</span>
          </button>
          <button
            onClick={() => setCurrentView('achievements')}
            className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
              currentView === 'achievements' ? 'text-blue-600' : 'text-gray-500'
            }`}
          >
            <Trophy className="w-6 h-6" />
            <span className="text-xs">Badges</span>
          </button>
          <button
            onClick={() => setCurrentView('coping')}
            className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
              currentView === 'coping' ? 'text-blue-600' : 'text-gray-500'
            }`}
          >
            <Lightbulb className="w-6 h-6" />
            <span className="text-xs">Coping</span>
          </button>
          <button
            onClick={() => setCurrentView('settings')}
            className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
              currentView === 'settings' ? 'text-blue-600' : 'text-gray-500'
            }`}
          >
            <SettingsIcon className="w-6 h-6" />
            <span className="text-xs">Settings</span>
          </button>
        </div>
      </nav>
    </div>
  );
}