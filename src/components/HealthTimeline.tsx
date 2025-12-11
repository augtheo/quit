import { UserProfile, CigaretteLog } from '../App';
import { Heart, Wind, Activity, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface HealthTimelineProps {
  userProfile: UserProfile;
  cigaretteLogs: CigaretteLog[];
}

interface Milestone {
  hours: number;
  title: string;
  description: string;
  icon: 'heart' | 'wind' | 'activity' | 'sparkles';
}

const HEALTH_MILESTONES: Milestone[] = [
  {
    hours: 0.33, // 20 minutes
    title: '20 Minutes',
    description: 'Heart rate and blood pressure drop to normal levels',
    icon: 'heart',
  },
  {
    hours: 12,
    title: '12 Hours',
    description: 'Carbon monoxide level in blood drops to normal',
    icon: 'activity',
  },
  {
    hours: 24,
    title: '1 Day',
    description: 'Risk of heart attack begins to decrease',
    icon: 'heart',
  },
  {
    hours: 48,
    title: '2 Days',
    description: 'Nerve endings start regrowing. Smell and taste improve',
    icon: 'sparkles',
  },
  {
    hours: 72,
    title: '3 Days',
    description: 'Breathing becomes easier. Bronchial tubes relax',
    icon: 'wind',
  },
  {
    hours: 168, // 1 week
    title: '1 Week',
    description: 'Sense of taste and smell significantly improved',
    icon: 'sparkles',
  },
  {
    hours: 336, // 2 weeks
    title: '2 Weeks',
    description: 'Circulation improves. Lung function increases',
    icon: 'activity',
  },
  {
    hours: 720, // 1 month
    title: '1 Month',
    description: 'Coughing and shortness of breath decrease',
    icon: 'wind',
  },
  {
    hours: 2160, // 3 months
    title: '3 Months',
    description: 'Lung function continues to improve significantly',
    icon: 'wind',
  },
  {
    hours: 4380, // 6 months
    title: '6 Months',
    description: 'Overall energy levels increase',
    icon: 'activity',
  },
  {
    hours: 8760, // 1 year
    title: '1 Year',
    description: 'Risk of heart disease is cut in half',
    icon: 'heart',
  },
  {
    hours: 43800, // 5 years
    title: '5 Years',
    description: 'Stroke risk reduced to that of a non-smoker',
    icon: 'activity',
  },
  {
    hours: 87600, // 10 years
    title: '10 Years',
    description: 'Lung cancer risk drops to half that of a smoker',
    icon: 'wind',
  },
];

export function HealthTimeline({ userProfile, cigaretteLogs }: HealthTimelineProps) {
  const calculateProgress = () => {
    const quitDate = new Date(userProfile.quitDate).getTime();
    const now = Date.now();
    const lastCigarette = cigaretteLogs.length > 0 
      ? Math.max(...cigaretteLogs.map(log => log.timestamp))
      : quitDate;
    const hoursSinceLastCigarette = (now - lastCigarette) / (1000 * 60 * 60);

    return hoursSinceLastCigarette;
  };

  const hoursSinceLast = calculateProgress();

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'heart':
        return <Heart className="w-6 h-6" />;
      case 'wind':
        return <Wind className="w-6 h-6" />;
      case 'activity':
        return <Activity className="w-6 h-6" />;
      case 'sparkles':
        return <Sparkles className="w-6 h-6" />;
      default:
        return <Heart className="w-6 h-6" />;
    }
  };

  return (
    <div className="min-h-screen p-4 pb-24">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2 pt-4"
        >
          <h1 className="text-blue-900">Health Recovery</h1>
          <p className="text-gray-600">
            Watch your body heal and recover over time
          </p>
        </motion.div>

        {/* Current Progress */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-6 text-white shadow-xl"
        >
          <div className="text-center">
            <div className="text-sm opacity-90 mb-2">Time Since Last Cigarette</div>
            <div className="text-4xl mb-4">
              {hoursSinceLast < 24 
                ? `${Math.floor(hoursSinceLast)} hours`
                : `${Math.floor(hoursSinceLast / 24)} days`
              }
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <p className="text-sm">
                Your body is healing right now! Every moment counts. 🌟
              </p>
            </div>
          </div>
        </motion.div>

        {/* Timeline */}
        <div className="space-y-4">
          {HEALTH_MILESTONES.map((milestone, index) => {
            const isCompleted = hoursSinceLast >= milestone.hours;
            const isNext = !isCompleted && (index === 0 || hoursSinceLast >= HEALTH_MILESTONES[index - 1].hours);
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`relative flex gap-4 ${
                  isCompleted 
                    ? 'opacity-100' 
                    : isNext 
                    ? 'opacity-90' 
                    : 'opacity-50'
                }`}
              >
                {/* Timeline Line */}
                {index < HEALTH_MILESTONES.length - 1 && (
                  <div className="absolute left-6 top-14 w-0.5 h-full bg-gray-200" />
                )}

                {/* Icon */}
                <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isCompleted 
                    ? 'bg-green-500 text-white' 
                    : isNext
                    ? 'bg-blue-500 text-white animate-pulse'
                    : 'bg-gray-200 text-gray-400'
                }`}>
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    getIcon(milestone.icon)
                  )}
                </div>

                {/* Content */}
                <div className={`flex-1 pb-8 ${
                  isCompleted 
                    ? 'bg-green-50 border-green-200' 
                    : isNext
                    ? 'bg-blue-50 border-blue-200'
                    : 'bg-white border-gray-200'
                } border-2 rounded-2xl p-4`}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`${
                      isCompleted 
                        ? 'text-green-900' 
                        : isNext
                        ? 'text-blue-900'
                        : 'text-gray-700'
                    }`}>
                      {milestone.title}
                    </h3>
                    {isCompleted && (
                      <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                        ✓ Completed
                      </span>
                    )}
                    {isNext && (
                      <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">
                        Next
                      </span>
                    )}
                  </div>
                  <p className={`text-sm ${
                    isCompleted 
                      ? 'text-green-700' 
                      : isNext
                      ? 'text-blue-700'
                      : 'text-gray-600'
                  }`}>
                    {milestone.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Encouragement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl p-6 text-white text-center"
        >
          <h3 className="mb-2">Keep Going!</h3>
          <p className="text-sm opacity-90">
            Each milestone represents real, measurable improvements in your health. 
            Your body is thanking you! 💪
          </p>
        </motion.div>
      </div>
    </div>
  );
}