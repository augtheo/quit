import { Achievement } from '../App';
import { Lock, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface AchievementsProps {
  achievements: Achievement[];
  quitPoints: number;
}

export function Achievements({ achievements, quitPoints }: AchievementsProps) {
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const progress = (unlockedCount / totalCount) * 100;

  return (
    <div className="min-h-screen p-4 pb-24">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2 pt-4"
        >
          <h1 className="text-text">Achievements</h1>
          <p className="text-subtext0">
            Celebrate your milestones and victories
          </p>
        </motion.div>

        {/* Progress Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-yellow to-peach rounded-3xl p-6 text-crust shadow-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6" />
              <span className="text-xl">Total Points</span>
            </div>
            <span className="text-3xl">{quitPoints}</span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Achievements Unlocked</span>
              <span>{unlockedCount}/{totalCount}</span>
            </div>
            <div className="w-full bg-base/30 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-base rounded-full"
              />
            </div>
          </div>
        </motion.div>

        {/* Achievements Grid */}
        <div className="space-y-4">
          <h2 className="text-text">Your Badges</h2>
          
          <div className="grid grid-cols-2 gap-4">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className={`relative rounded-2xl p-6 text-center text-crust  transition-all ${
                  achievement.unlocked
                    ? 'bg-gradient-to-br from-blue to-mauve shadow-lg'
                    : 'bg-surface0'
                }`}
              >
                {achievement.unlocked ? (
                  <>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.05 + 0.2, type: 'spring', stiffness: 200 }}
                      className="text-5xl mb-3"
                    >
                      {achievement.icon}
                    </motion.div>
                    <h3 className="text-crust mb-2">{achievement.name}</h3>
                    <p className="text-sm text-crust/90">
                      {achievement.description}
                    </p>
                    {achievement.unlockedAt && (
                      <div className="mt-3 text-xs text-crust/75">
                        {new Date(achievement.unlockedAt).toLocaleDateString()}
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="text-5xl mb-3 opacity-30 relative">
                      {achievement.icon}
                      <Lock className="w-6 h-6 text-overlay2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <h3 className="text-subtext0 mb-2">{achievement.name}</h3>
                    <p className="text-sm text-subtext1">
                      {achievement.description}
                    </p>
                  </>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Motivation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green to-teal rounded-2xl p-6 text-crust text-center"
        >
          <Sparkles className="w-8 h-8 mx-auto mb-3" />
          <h3 className="mb-2">Keep Collecting!</h3>
          <p className="text-sm opacity-90">
            Each badge represents a real victory in your journey. 
            You're doing amazing! 🌟
          </p>
        </motion.div>

        {/* How to Earn Points */}
        <div className="bg-base rounded-2xl p-6 shadow-lg space-y-4">
          <h3 className="text-text">How to Earn Points</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 bg-green/20 rounded-xl p-3">
              <Sparkles className="w-5 h-5 text-green flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-green">Conquer a Craving</div>
                <div className="text-sm text-green">+10 points</div>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-blue/20 rounded-xl p-3">
              <Sparkles className="w-5 h-5 text-blue flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-blue">Unlock an Achievement</div>
                <div className="text-sm text-blue">Automatic when you hit milestones</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
