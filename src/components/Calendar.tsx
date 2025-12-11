import { UserProfile, CigaretteLog } from '../App';
import { CheckCircle2, XCircle, Calendar as CalendarIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface CalendarProps {
  userProfile: UserProfile;
  cigaretteLogs: CigaretteLog[];
}

export function Calendar({ userProfile, cigaretteLogs }: CalendarProps) {
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const currentDate = new Date();
  const quitDate = new Date(userProfile.quitDate);
  
  // Generate calendar data for the current month
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Add empty cells for days before the first day of month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateStr = date.toDateString();
      
      // Check if this day is after quit date
      const isAfterQuit = date >= quitDate;
      
      // Check if any cigarettes were logged on this day
      const logsOnDay = cigaretteLogs.filter(log => {
        const logDate = new Date(log.timestamp);
        return logDate.toDateString() === dateStr;
      });

      const isFuture = date > currentDate;
      
      days.push({
        day,
        date,
        isAfterQuit,
        hasCigarettes: logsOnDay.length > 0,
        cigaretteCount: logsOnDay.length,
        isFuture,
        isToday: date.toDateString() === currentDate.toDateString(),
      });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  // Calculate stats
  const daysTracked = calendarDays.filter(d => d && d.isAfterQuit && !d.isFuture).length;
  const smokFreeDays = calendarDays.filter(d => d && d.isAfterQuit && !d.hasCigarettes && !d.isFuture).length;
  const successRate = daysTracked > 0 ? ((smokFreeDays / daysTracked) * 100).toFixed(1) : '0';

  return (
    <div className="min-h-screen p-4 pb-24">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2 pt-4"
        >
          <h1 className="text-blue-900">Progress Calendar</h1>
          <p className="text-gray-600">
            Track your smoke-free journey day by day
          </p>
        </motion.div>

        {/* Stats Summary */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white border-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <CalendarIcon className="w-6 h-6" />
                {monthName}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl">{smokFreeDays}</div>
                  <div className="text-sm opacity-90">Clean Days</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl">{daysTracked - smokFreeDays}</div>
                  <div className="text-sm opacity-90">Slip-ups</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl">{successRate}%</div>
                  <div className="text-sm opacity-90">Success</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Calendar Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-4">
              {/* Day headers */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-sm font-medium text-gray-600">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar days */}
              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((dayData, index) => {
                  if (!dayData) {
                    return <div key={`empty-${index}`} className="aspect-square" />;
                  }

                  const { day, isAfterQuit, hasCigarettes, cigaretteCount, isFuture, isToday } = dayData;

                  let bgColor = 'bg-gray-100';
                  let icon = null;
                  let textColor = 'text-gray-400';

                  if (isAfterQuit && !isFuture) {
                    if (hasCigarettes) {
                      bgColor = 'bg-red-100 border-2 border-red-300';
                      textColor = 'text-red-700';
                      icon = <XCircle className="w-3 h-3 text-red-500" />;
                    } else {
                      bgColor = 'bg-green-100 border-2 border-green-300';
                      textColor = 'text-green-700';
                      icon = <CheckCircle2 className="w-3 h-3 text-green-500" />;
                    }
                  }

                  if (isToday) {
                    bgColor = bgColor + ' ring-2 ring-blue-500';
                  }

                  return (
                    <motion.div
                      key={day}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.01 }}
                      className={`aspect-square rounded-lg ${bgColor} flex flex-col items-center justify-center p-1 relative`}
                    >
                      <div className={`text-sm ${textColor}`}>{day}</div>
                      {icon && <div className="absolute top-1 right-1">{icon}</div>}
                      {cigaretteCount > 1 && (
                        <div className="text-xs text-red-600 font-medium">
                          {cigaretteCount}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-900">Legend</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-100 border-2 border-green-300 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                </div>
                <span className="text-sm text-gray-700">Smoke-free day</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-100 border-2 border-red-300 flex items-center justify-center">
                  <XCircle className="w-4 h-4 text-red-500" />
                </div>
                <span className="text-sm text-gray-700">Day with slip-up(s)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-100" />
                <span className="text-sm text-gray-700">Before quit date / Future</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Encouragement */}
        {smokFreeDays > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-r from-green-400 to-emerald-500 border-none">
              <CardContent className="p-6 text-center text-white">
                <p className="text-lg">
                  {smokFreeDays === daysTracked
                    ? '🎉 Perfect month so far! Keep it going!'
                    : `💪 ${smokFreeDays} smoke-free days this month! Every day counts!`}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
