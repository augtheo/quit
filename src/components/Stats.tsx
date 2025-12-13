import { UserProfile, CigaretteLog, CravingConquest } from '../App';
import { TrendingDown, TrendingUp, IndianRupee, Ban, Sparkles, Activity } from 'lucide-react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface StatsProps {
  userProfile: UserProfile;
  cigaretteLogs: CigaretteLog[];
  cravingConquests: CravingConquest[];
  quitPoints: number;
}

export function Stats({ userProfile, cigaretteLogs, cravingConquests, quitPoints }: StatsProps) {
  // Calculate daily stats for the past 30 days
  const generateDailyStats = () => {
    const days = [];
    const today = new Date();
    const quitDate = new Date(userProfile.quitDate);
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      if (date < quitDate) continue;
      
      const dateStr = date.toDateString();
      
      // Count cigarettes for this day
      const cigarettesOnDay = cigaretteLogs.filter(log => {
        return new Date(log.timestamp).toDateString() === dateStr;
      }).length;
      
      // Count craving conquests for this day
      const conquestsOnDay = cravingConquests.filter(conquest => {
        return new Date(conquest.timestamp).toDateString() === dateStr;
      }).length;
      
      days.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        cigarettes: cigarettesOnDay,
        conquests: conquestsOnDay,
        fullDate: date,
      });
    }
    
    return days;
  };

  const dailyStats = generateDailyStats();

  // Calculate overall stats
  const calculateOverallStats = () => {
    const quitDate = new Date(userProfile.quitDate).getTime();
    const now = Date.now();
    const daysSinceQuit = Math.floor((now - quitDate) / (1000 * 60 * 60 * 24));
    
    const costPerCigarette = userProfile.costPerPack / userProfile.cigarettesPerPack;
    const expectedCigarettes = userProfile.dailyCigarettes * (daysSinceQuit + 1);
    const cigarettesSmoked = cigaretteLogs.length;
    const cigarettesAvoided = Math.max(0, expectedCigarettes - cigarettesSmoked);
    const moneySaved = cigarettesAvoided * costPerCigarette;
    
    const avgDailyCigarettes = daysSinceQuit > 0 ? (cigarettesSmoked / daysSinceQuit).toFixed(1) : '0';
    const reductionRate = userProfile.dailyCigarettes > 0 
      ? (((userProfile.dailyCigarettes - parseFloat(avgDailyCigarettes)) / userProfile.dailyCigarettes) * 100).toFixed(1)
      : '0';

    return {
      daysSinceQuit,
      cigarettesAvoided,
      moneySaved,
      avgDailyCigarettes,
      reductionRate: parseFloat(reductionRate),
      totalConquests: cravingConquests.length,
    };
  };

  const overallStats = calculateOverallStats();

  // Location breakdown
  const locationBreakdown = cigaretteLogs.reduce((acc, log) => {
    const location = log.location || 'Not specified';
    acc[location] = (acc[location] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const locationData = Object.entries(locationBreakdown)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  // Craving strength distribution
  const cravingStrengthData = [1, 2, 3, 4, 5].map(strength => ({
    strength: `Level ${strength}`,
    count: cigaretteLogs.filter(log => log.cravingStrength === strength).length,
  }));

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

  return (
    <div className="min-h-screen p-4 pb-24">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2 pt-4"
        >
          <h1 className="text-text">Statistics & History</h1>
          <p className="text-subtext0">
            Track your progress over time
          </p>
        </motion.div>

        {/* Overall Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Ban className="w-5 h-5 text-blue" />
                  <span className="text-sm text-subtext0">Avoided</span>
                </div>
                <div className="text-2xl text-blue">{overallStats.cigarettesAvoided}</div>
                <div className="text-xs text-subtext1">cigarettes</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <IndianRupee className="w-5 h-5 text-green" />
                  <span className="text-sm text-subtext0">Saved</span>
                </div>
                <div className="text-2xl text-green">₹{overallStats.moneySaved.toFixed(0)}</div>
                <div className="text-xs text-subtext1">total</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="w-5 h-5 text-mauve" />
                  <span className="text-sm text-subtext0">Reduction</span>
                </div>
                <div className="text-2xl text-mauve">{overallStats.reductionRate}%</div>
                <div className="text-xs text-subtext1">vs baseline</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-yellow" />
                  <span className="text-sm text-subtext0">Conquests</span>
                </div>
                <div className="text-2xl text-yellow">{overallStats.totalConquests}</div>
                <div className="text-xs text-subtext1">cravings beat</div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Daily Cigarettes Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-text">
                <Activity className="w-5 h-5" />
                Daily Cigarettes (Last 30 Days)
              </CardTitle>
              <CardDescription>Track your smoking patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={dailyStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-surface2)" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--color-base)', 
                      border: '1px solid var(--color-surface2)',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="cigarettes" 
                    stroke="var(--color-red)" 
                    strokeWidth={2}
                    dot={{ fill: 'var(--color-red)', r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Craving Conquests Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-text">
                <Sparkles className="w-5 h-5" />
                Daily Craving Conquests
              </CardTitle>
              <CardDescription>Your victories over cravings</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={dailyStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-surface2)" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--color-base)', 
                      border: '1px solid var(--color-surface2)',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="conquests" fill="var(--color-green)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Common Triggers */}
        {locationData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-text">Common Triggers</CardTitle>
                <CardDescription>Where/when slip-ups happen most</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {locationData.map((item, index) => {
                    const percentage = cigaretteLogs.length > 0 
                      ? ((item.value / cigaretteLogs.length) * 100).toFixed(0)
                      : 0;
                    
                    return (
                      <div key={item.name}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-subtext1">{item.name}</span>
                          <span className="text-sm text-subtext1">{item.value} ({percentage}%)</span>
                        </div>
                        <div className="w-full bg-surface0 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: COLORS[index % COLORS.length],
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Craving Strength Distribution */}
        {cigaretteLogs.some(log => log.cravingStrength) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-text">Craving Intensity</CardTitle>
                <CardDescription>Distribution of craving strength</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={cravingStrengthData.filter(d => d.count > 0)}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="var(--color-mauve)"
                      dataKey="count"
                    >
                      {cravingStrengthData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-gradient-to-r from-blue to-mauve border-none">
            <CardContent className="p-6 text-crust space-y-3">
              <h3 className="text-crust">💡 Insights</h3>
              {overallStats.reductionRate > 50 && (
                <p className="text-sm opacity-90">
                  Amazing! You've reduced your smoking by over {overallStats.reductionRate}%!
                </p>
              )}
              {overallStats.totalConquests > 10 && (
                <p className="text-sm opacity-90">
                  You've conquered {overallStats.totalConquests} cravings. Each one makes you stronger!
                </p>
              )}
              {locationData.length > 0 && (
                <p className="text-sm opacity-90">
                  Your main trigger is "{locationData[0].name}". Plan ahead for these moments!
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
