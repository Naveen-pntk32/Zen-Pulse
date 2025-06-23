import { DigitalClock } from '@/components/digital-clock';
import { PomodoroTimer } from '@/components/pomodoro-timer';
import { Timer } from '@/components/stopwatch';
import { Html5MusicPlayer } from '@/components/html5-music-player';
import { TaskScheduler } from '@/components/task-scheduler';
import { QuickSettings } from '@/components/quick-settings';
import { DailyStats } from '@/components/daily-stats';
import { NotificationToast, useToasts } from '@/components/notification-toast';
import { Button } from '@/components/ui/button';
import { Music, Home as HomeIcon } from 'lucide-react';
import { Link, useLocation } from 'wouter';

export default function Home() {
  const { toasts, removeToast } = useToasts();
  const [location] = useLocation();

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Navigation */}
        <nav className="flex justify-between items-center mb-6">
          <div className="flex bg-gray-800 rounded-2xl p-1 border border-gray-700">
            <Link href="/">
              <Button
                variant={location === '/' ? 'default' : 'ghost'}
                className={`rounded-xl px-6 py-2 ${
                  location === '/' 
                    ? 'bg-green-400 text-black hover:bg-green-500' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                <HomeIcon className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <Link href="/music">
              <Button
                variant={location === '/music' ? 'default' : 'ghost'}
                className={`rounded-xl px-6 py-2 ${
                  location === '/music' 
                    ? 'bg-green-400 text-black hover:bg-green-500' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                <Music className="w-4 h-4 mr-2" />
                Music Player
              </Button>
            </Link>
          </div>
        </nav>

        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent mb-2">
            ZenPulse
          </h1>
          <p className="text-gray-400">Your productivity companion with smartwatch experience</p>
        </header>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column: Timers */}
          <div className="lg:col-span-2 space-y-6">
            <DigitalClock />
            <PomodoroTimer />
            <Timer />
          </div>

          {/* Right Column: Tasks & Settings */}
          <div className="space-y-6">
            <TaskScheduler />
            <QuickSettings />
          </div>
        </div>

        {/* Daily Stats Summary */}
        <DailyStats />

        {/* Notification Toast Container */}
        <NotificationToast toasts={toasts} onRemove={removeToast} />
      </div>
    </div>
  );
}
