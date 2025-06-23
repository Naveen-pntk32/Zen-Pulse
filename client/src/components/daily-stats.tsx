import { useState, useEffect } from 'react';
import { BarChart3 } from 'lucide-react';
import { storage } from '@/lib/storage';
import { DailyStats as DailyStatsType } from '@/types/timer';

export function DailyStats() {
  const [todayStats, setTodayStats] = useState<DailyStatsType>(storage.getTodayStats());
  const [weeklyData, setWeeklyData] = useState<DailyStatsType[]>([]);

  useEffect(() => {
    const updateStats = () => {
      setTodayStats(storage.getTodayStats());
      
      // Get last 7 days of stats
      const allStats = storage.getStats();
      const last7Days = [];
      const today = new Date();
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        
        const dayStats = allStats.find(s => s.date === dateString) || {
          date: dateString,
          pomodoros: 0,
          focusHours: 0,
          tasksCompleted: 0,
          streak: 0,
        };
        
        last7Days.push(dayStats);
      }
      
      setWeeklyData(last7Days);
    };

    updateStats();
    
    // Update stats every minute
    const interval = setInterval(updateStats, 60000);
    return () => clearInterval(interval);
  }, []);

  const getDayName = (date: string) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[new Date(date).getDay()];
  };

  const getMaxPomodoros = () => {
    return Math.max(...weeklyData.map(d => d.pomodoros), 8);
  };

  return (
    <div className="bg-gray-800 rounded-3xl p-6 border border-gray-700">
      <h2 className="text-lg font-semibold flex items-center gap-2 mb-6">
        <BarChart3 className="w-5 h-5 text-indigo-400" />
        Daily Statistics
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-gray-700 rounded-2xl">
          <div className="text-2xl font-bold text-red-400">{todayStats.pomodoros}</div>
          <div className="text-sm text-gray-400">Pomodoros</div>
          <div className="text-xs text-green-400">
            {todayStats.pomodoros >= 8 ? 'Goal: 8 ✓' : `Goal: 8`}
          </div>
        </div>
        
        <div className="text-center p-4 bg-gray-700 rounded-2xl">
          <div className="text-2xl font-bold text-blue-400">
            {todayStats.focusHours.toFixed(1)}
          </div>
          <div className="text-sm text-gray-400">Focus Hours</div>
          <div className="text-xs text-amber-400">
            {todayStats.focusHours > 0 ? `+${((todayStats.focusHours / 3.3) * 100 - 100).toFixed(0)}% vs avg` : 'Start focusing!'}
          </div>
        </div>
        
        <div className="text-center p-4 bg-gray-700 rounded-2xl">
          <div className="text-2xl font-bold text-green-400">{todayStats.tasksCompleted}</div>
          <div className="text-sm text-gray-400">Tasks Done</div>
          <div className="text-xs text-green-400">
            {todayStats.tasksCompleted > 5 ? 'Great day!' : 'Keep going!'}
          </div>
        </div>
        
        <div className="text-center p-4 bg-gray-700 rounded-2xl">
          <div className="text-2xl font-bold text-purple-400">{todayStats.streak}</div>
          <div className="text-sm text-gray-400">Day Streak</div>
          <div className="text-xs text-purple-400">
            {todayStats.streak > 0 ? 'Keep it up!' : 'Start today!'}
          </div>
        </div>
      </div>

      {/* Weekly Progress Chart */}
      <div className="mt-6 p-4 bg-gray-700 rounded-2xl">
        <div className="text-sm font-medium mb-3 text-white">This Week's Progress</div>
        <div className="flex items-end justify-between h-20 space-x-1">
          {weeklyData.map((day, index) => {
            const maxPomodoros = getMaxPomodoros();
            const height = maxPomodoros > 0 ? (day.pomodoros / maxPomodoros) * 100 : 0;
            const isToday = day.date === new Date().toISOString().split('T')[0];
            
            return (
              <div
                key={day.date}
                className={`rounded-t transition-all hover:opacity-80 ${
                  isToday ? 'bg-red-500' : day.pomodoros > 0 ? 'bg-red-400' : 'bg-red-400/50'
                }`}
                style={{ height: `${Math.max(height, 5)}%`, width: '12%' }}
                title={`${getDayName(day.date)}: ${day.pomodoros} pomodoros`}
              />
            );
          })}
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-2">
          {weeklyData.map(day => (
            <span key={day.date}>{getDayName(day.date)}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
