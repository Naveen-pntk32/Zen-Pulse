import { useState, useEffect } from 'react';
import { Music, Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMediaSession } from '@/hooks/use-media-session';

export function MusicController() {
  const { isSupported, mediaInfo, setActionHandler, detectCurrentMedia } = useMediaSession();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [currentTrack, setCurrentTrack] = useState({
    title: 'No media playing',
    artist: 'Open Spotify, YouTube Music, or Apple Music',
    artwork: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200',
    currentTime: '0:00',
    totalTime: '0:00',
    progress: 0,
    source: 'None',
  });

  useEffect(() => {
    if (isSupported) {
      // Set up media session handlers that respond to external controls
      setActionHandler('play', () => {
        setIsPlaying(true);
        setLastUpdate(Date.now());
        console.log('External play command received');
      });

      setActionHandler('pause', () => {
        setIsPlaying(false);
        setLastUpdate(Date.now());
        console.log('External pause command received');
      });

      setActionHandler('previoustrack', () => {
        setLastUpdate(Date.now());
        console.log('Previous track command received');
      });

      setActionHandler('nexttrack', () => {
        setLastUpdate(Date.now());
        console.log('Next track command received');
      });

      // Check for media periodically
      const checkMedia = () => {
        const detected = detectCurrentMedia();
        if (detected) {
          setCurrentTrack(prev => ({
            ...prev,
            title: detected.title,
            artist: detected.artist,
            artwork: detected.artwork || prev.artwork,
            source: detected.source,
          }));
          setIsPlaying(detected.playbackState === 'playing');
          setLastUpdate(Date.now());
        }
      };

      checkMedia();
      const interval = setInterval(checkMedia, 2000);
      return () => clearInterval(interval);
    }
  }, [isSupported, setActionHandler, detectCurrentMedia]);

  const handleTogglePlay = () => {
    if (isSupported) {
      // Try to trigger the actual media commands
      try {
        if (isPlaying) {
          // Send pause command to external media
          document.dispatchEvent(new KeyboardEvent('keydown', { 
            key: 'MediaPlayPause', 
            code: 'MediaPlayPause' 
          }));
        } else {
          // Send play command to external media  
          document.dispatchEvent(new KeyboardEvent('keydown', { 
            key: 'MediaPlayPause', 
            code: 'MediaPlayPause' 
          }));
        }
        setIsPlaying(!isPlaying);
        setLastUpdate(Date.now());
      } catch (error) {
        console.error('Media control error:', error);
        // Fallback to just toggling local state
        setIsPlaying(!isPlaying);
      }
    }
  };

  const handlePrevious = () => {
    if (isSupported) {
      try {
        document.dispatchEvent(new KeyboardEvent('keydown', { 
          key: 'MediaTrackPrevious', 
          code: 'MediaTrackPrevious' 
        }));
        setLastUpdate(Date.now());
      } catch (error) {
        console.error('Previous track not supported:', error);
      }
    }
  };

  const handleNext = () => {
    if (isSupported) {
      try {
        document.dispatchEvent(new KeyboardEvent('keydown', { 
          key: 'MediaTrackNext', 
          code: 'MediaTrackNext' 
        }));
        setLastUpdate(Date.now());
      } catch (error) {
        console.error('Next track not supported:', error);
      }
    }
  };

  if (!isSupported) {
    return (
      <div className="bg-gray-800 rounded-3xl p-6 border border-gray-700">
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <Music className="w-5 h-5 text-green-400" />
          Music Controller
        </h2>
        <div className="text-center text-gray-400">
          <p className="text-sm">Media Session API not supported in this browser</p>
          <p className="text-xs mt-2">Try Chrome, Firefox, or Safari for music control features</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-3xl p-6 border border-gray-700">
      <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
        <Music className="w-5 h-5 text-green-400" />
        Music Controller
      </h2>

      <div className="text-center">
        {/* Track Info */}
        <div className="mb-4">
          <img
            src={currentTrack.artwork}
            alt="Album cover"
            className="w-24 h-24 rounded-2xl mx-auto mb-3 shadow-lg object-cover"
          />
          <div className="font-semibold text-white truncate">{currentTrack.title}</div>
          <div className="text-sm text-gray-400 truncate">{currentTrack.artist}</div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="w-full bg-gray-700 rounded-full h-1">
            <div
              className="bg-green-400 h-1 rounded-full transition-all duration-1000"
              style={{ width: `${currentTrack.progress * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>{currentTrack.currentTime}</span>
            <span>{currentTrack.totalTime}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center items-center space-x-4">
          <Button
            onClick={handlePrevious}
            variant="ghost"
            size="icon"
            className="rounded-full bg-gray-700 hover:bg-gray-100 hover:text-gray-900"
          >
            <SkipBack className="w-5 h-5" />
          </Button>
          
          <Button
            onClick={handleTogglePlay}
            className="w-12 h-12 rounded-full bg-green-400 hover:bg-green-500 text-white"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6" />
            )}
          </Button>
          
          <Button
            onClick={handleNext}
            variant="ghost"
            size="icon"
            className="rounded-full bg-gray-700 hover:bg-gray-100 hover:text-gray-900"
          >
            <SkipForward className="w-5 h-5" />
          </Button>
        </div>

        {/* Source Info */}
        <div className="mt-4 text-xs text-gray-400">
          {mediaInfo ? (
            <>Playing from <span className="text-green-400">{currentTrack.source}</span></>
          ) : (
            <>Start playing music in another tab to control it here</>
          )}
        </div>

        {/* Status and Testing */}
        <div className="mt-4 space-y-2">
          <div className="text-xs">
            <span className="text-amber-400">API Status:</span> 
            <span className={`ml-1 ${isSupported ? 'text-green-400' : 'text-red-400'}`}>
              {isSupported ? 'Supported' : 'Not Supported'}
            </span>
          </div>
          <div className="text-xs">
            <span className="text-amber-400">Last Update:</span> 
            <span className="ml-1 text-gray-400">
              {new Date(lastUpdate).toLocaleTimeString()}
            </span>
          </div>
          <Button
            onClick={() => {
              const detected = detectCurrentMedia();
              setLastUpdate(Date.now());
              if (!detected) {
                alert('No media detected. Open Spotify, YouTube Music, or Apple Music in another tab and start playing music.');
              }
            }}
            className="w-full text-xs py-1 bg-green-400 hover:bg-green-500 text-white"
          >
            Refresh Media Detection
          </Button>
        </div>
      </div>
    </div>
  );
}
