import { useState, useEffect } from 'react';
import { UserProfile, CigaretteLog, CravingConquest } from '../App';
import { Flame, DollarSign, Ban, Sparkles, AlertCircle, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { QuickLogModal } from './QuickLogModal';
import { CravingConquestModal } from './CravingConquestModal';
import { MyWhyCard } from './MyWhyCard';

interface DashboardProps {
  userProfile: UserProfile;
  cigaretteLogs: CigaretteLog[];
  cravingConquests: CravingConquest[];
  quitPoints: number;
  onAddCigaretteLog: (log: Omit<CigaretteLog, 'id'>) => void;
  onAddCravingConquest: () => void;
}

export function Dashboard({
  userProfile,
  cigaretteLogs,
  cravingConquests,
  quitPoints,
  onAddCigaretteLog,
  onAddCravingConquest,
}: DashboardProps) {
  const [showQuickLog, setShowQuickLog] = useState(false);
  const [showCravingModal, setShowCravingModal] = useState(false);
  const [showMyWhy, setShowMyWhy] = useState(false);
  const [showSlipUpMessage, setShowSlipUpMessage] = useState(false);

  const calculateStats = () => {
    const quitDate = new Date(userProfile.quitDate).getTime();
    const now = Date.now();
    const daysSinceQuit = Math.floor((now - quitDate) / (1000 * 60 * 60 * 24));
    
    // Calculate streak (days without cigarettes)
    const lastCigarette = cigaretteLogs.length > 0 
      ? Math.max(...cigaretteLogs.map(log => log.timestamp))
      : quitDate;
    const daysSinceLastCigarette = Math.floor((now - lastCigarette) / (1000 * 60 * 60 * 24));
    const hoursSinceLastCigarette = Math.floor((now - lastCigarette) / (1000 * 60 * 60));
    
    // Calculate cigarettes avoided
    const costPerCigarette = userProfile.costPerPack / userProfile.cigarettesPerPack;
    const expectedCigarettes = userProfile.dailyCigarettes * (daysSinceQuit + 1);
    const cigarettesSmoked = cigaretteLogs.length;
    const cigarettesAvoided = Math.max(0, expectedCigarettes - cigarettesSmoked);
    
    // Calculate money saved
    const moneySaved = cigarettesAvoided * costPerCigarette;
    
    // Determine level based on days smoke-free
    let level = 'Beginner';
    let levelProgress = 0;
    if (daysSinceLastCigarette >= 90) {
      level = 'Champion';
      levelProgress = 100;
    } else if (daysSinceLastCigarette >= 30) {
      level = 'Expert';
      levelProgress = ((daysSinceLastCigarette - 30) / 60) * 100;
    } else if (daysSinceLastCigarette >= 7) {
      level = 'Tracker';
      levelProgress = ((daysSinceLastCigarette - 7) / 23) * 100;
    } else if (daysSinceLastCigarette >= 1) {
      level = 'Apprentice';
      levelProgress = ((daysSinceLastCigarette - 1) / 6) * 100;
    } else {
      level = 'Novice';
      levelProgress = (hoursSinceLastCigarette / 24) * 100;
    }

    return {
      daysSinceQuit,
      daysSinceLastCigarette,
      hoursSinceLastCigarette,
      cigarettesAvoided,
      moneySaved,
      level,
      levelProgress,
    };
  };

  const stats = calculateStats();

  const handleSlipUp = (log: Omit<CigaretteLog, 'id'>) => {
    onAddCigaretteLog(log);
    setShowQuickLog(false);
    setShowSlipUpMessage(true);
    setTimeout(() => setShowSlipUpMessage(false), 5000);
  };

  const formatTime = (hours: number) => {
    if (hours < 24) {
      return `${hours} hour${hours !== 1 ? 's' : ''}`;
    }
    const days = Math.floor(hours / 24);
    return `${days} day${days !== 1 ? 's' : ''}`;
  };

  return (
    <div className="min-h-screen p-4 pb-24">
      <div className="max-w-md mx-auto space-y-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2 pt-4"
        >
          <h1 className="text-blue-900">Quieres fumar?</h1>
          <div className="flex items-center justify-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm inline-flex">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            <span className="text-gray-700">{quitPoints} Points</span>
            <span className="text-gray-400">•</span>
            <span className="text-blue-600">{stats.level}</span>
          </div>
        </motion.div>

        {/* Slip-Up Message */}
        <AnimatePresence>
          {showSlipUpMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4"
            >
              <p className="text-blue-900 text-center">
                The journey continues. Every moment is a new chance to succeed. 
                Focus on the next smoke-free hour. You've got this! 💪
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Streak Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-orange-400 to-red-500 rounded-3xl p-6 text-white shadow-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Flame className="w-8 h-8" />
              <span className="text-xl">Smoke-Free Streak</span>
            </div>
          </div>
          <div className="text-center">
            <div className="text-6xl mb-2">{stats.daysSinceLastCigarette}</div>
            <div className="text-xl opacity-90">Day{stats.daysSinceLastCigarette !== 1 ? 's' : ''}</div>
            <div className="text-sm opacity-75 mt-2">
              ({formatTime(stats.hoursSinceLastCigarette)} total)
            </div>
          </div>
          
          {/* Level Progress */}
          <div className="mt-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Level: {stats.level}</span>
              <span>{Math.round(stats.levelProgress)}%</span>
            </div>
            <div className="w-full bg-white/30 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stats.levelProgress}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-white rounded-full"
              />
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-5 shadow-lg"
          >
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-6 h-6 text-green-600" />
              <span className="text-gray-600">Saved</span>
            </div>
            <div className="text-3xl text-green-600">₹{stats.moneySaved.toFixed(2)}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-5 shadow-lg"
          >
            <div className="flex items-center gap-2 mb-2">
              <Ban className="w-6 h-6 text-blue-600" />
              <span className="text-gray-600">Avoided</span>
            </div>
            <div className="text-3xl text-blue-600">{stats.cigarettesAvoided}</div>
            <div className="text-sm text-gray-500">cigarettes</div>
          </motion.div>
        </div>

        {/* My Why Quick Access */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => setShowMyWhy(true)}
          className="w-full bg-gradient-to-r from-pink-400 to-purple-500 text-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart className="w-6 h-6" />
              <div className="text-left">
                <div className="text-sm opacity-90">My Why</div>
                <div className="text-lg">Remember Your Motivation</div>
              </div>
            </div>
            <AlertCircle className="w-6 h-6" />
          </div>
        </motion.button>

        {/* Daily Goal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-5 shadow-lg"
        >
          <h3 className="text-gray-900 mb-3">Today's Goal</h3>
          <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
            <p className="text-blue-900">Stay smoke-free today! 🎯</p>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 gap-4"
        >
          <button
            onClick={() => setShowCravingModal(true)}
            className="bg-gradient-to-br from-green-400 to-emerald-500 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all active:scale-95"
          >
            <div className="flex flex-col items-center gap-2">
              <Sparkles className="w-8 h-8" />
              <span>Beat a Craving!</span>
              <span className="text-sm opacity-90">+10 points</span>
            </div>
          </button>

          <button
            onClick={() => setShowQuickLog(true)}
            className="bg-gradient-to-br from-gray-400 to-gray-500 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all active:scale-95"
          >
            <div className="flex flex-col items-center gap-2">
              <AlertCircle className="w-8 h-8" />
              <span>Log Slip-Up</span>
              <span className="text-sm opacity-90">It's okay</span>
            </div>
          </button>
        </motion.div>

        {/* Recent Activity */}
        {cravingConquests.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl p-5 shadow-lg"
          >
            <h3 className="text-gray-900 mb-3">Recent Victories</h3>
            <div className="space-y-2">
              {cravingConquests.slice(-3).reverse().map((conquest) => (
                <div
                  key={conquest.id}
                  className="flex items-center justify-between bg-green-50 rounded-xl p-3"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">Craving conquered!</span>
                  </div>
                  <span className="text-green-600">+{conquest.points} pts</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Modals */}
      <QuickLogModal
        isOpen={showQuickLog}
        onClose={() => setShowQuickLog(false)}
        onSubmit={handleSlipUp}
      />

      <CravingConquestModal
        isOpen={showCravingModal}
        onClose={() => setShowCravingModal(false)}
        onConquer={() => {
          onAddCravingConquest();
          setShowCravingModal(false);
        }}
      />

      <MyWhyCard
        isOpen={showMyWhy}
        onClose={() => setShowMyWhy(false)}
        myWhy={userProfile.myWhy}
      />
    </div>
  );
}