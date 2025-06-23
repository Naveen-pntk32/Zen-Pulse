import { useState, useRef, useEffect } from 'react';
import { Music, Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Shuffle, Repeat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';

export interface Song {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration?: number;
  artwork?: string;
}

interface Html5MusicPlayerProps {
  playlist?: Song[];
  autoPlay?: boolean;
  className?: string;
}

const defaultPlaylist: Song[] = [
  {
    id: '1',
    title: 'Sample Track 1',
    artist: 'Demo Artist',
    url: 'https://www.soundjay.com/misc/sounds/magic-chime-02.mp3',
    artwork: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200'
  },
  {
    id: '2',
    title: 'Sample Track 2',
    artist: 'Demo Artist',
    url: 'https://www.soundjay.com/misc/sounds/magic-chime-01.mp3',
    artwork: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200'
  }
];

export function Html5MusicPlayer({ 
  playlist = defaultPlaylist, 
  autoPlay = false,
  className = ""
}: Html5MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<'none' | 'one' | 'all'>('none');

  const currentSong = playlist[currentSongIndex] || null;

  // Format time in MM:SS format
  const formatTime = (time: number): string => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Update audio element when current song changes
  useEffect(() => {
    if (audioRef.current && currentSong) {
      audioRef.current.src = currentSong.url;
      audioRef.current.load();
      setCurrentTime(0);
      setDuration(0);
      setIsLoading(true);
    }
  }, [currentSong]);

  // Handle audio events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      if (repeat === 'one') {
        audio.currentTime = 0;
        audio.play();
      } else {
        handleNext();
      }
    };

    const handleCanPlay = () => {
      setIsLoading(false);
      if (autoPlay && isPlaying) {
        audio.play().catch(console.error);
      }
    };

    const handleLoadStart = () => {
      setIsLoading(true);
    };

    const handleError = () => {
      setIsLoading(false);
      console.error('Error loading audio file:', currentSong?.url);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('error', handleError);
    };
  }, [currentSong, autoPlay, isPlaying, repeat]);

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handlePlayPause = async () => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Playback error:', error);
      setIsPlaying(false);
    }
  };

  const handleNext = () => {
    if (playlist.length === 0) return;
    
    let nextIndex;
    if (shuffle) {
      nextIndex = Math.floor(Math.random() * playlist.length);
    } else {
      nextIndex = (currentSongIndex + 1) % playlist.length;
    }
    
    if (nextIndex === currentSongIndex && playlist.length > 1) {
      nextIndex = (nextIndex + 1) % playlist.length;
    }
    
    setCurrentSongIndex(nextIndex);
    if (isPlaying) {
      setIsPlaying(true); // Will auto-play when new song loads
    }
  };

  const handlePrevious = () => {
    if (playlist.length === 0) return;
    
    // If we're more than 3 seconds into the song, restart it
    if (currentTime > 3) {
      audioRef.current!.currentTime = 0;
      return;
    }
    
    let prevIndex;
    if (shuffle) {
      prevIndex = Math.floor(Math.random() * playlist.length);
    } else {
      prevIndex = currentSongIndex === 0 ? playlist.length - 1 : currentSongIndex - 1;
    }
    
    setCurrentSongIndex(prevIndex);
    if (isPlaying) {
      setIsPlaying(true); // Will auto-play when new song loads
    }
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    
    const newTime = (value[0] / 100) * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0] / 100);
    setIsMuted(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleShuffle = () => {
    setShuffle(!shuffle);
  };

  const toggleRepeat = () => {
    const modes: Array<'none' | 'one' | 'all'> = ['none', 'all', 'one'];
    const currentIndex = modes.indexOf(repeat);
    setRepeat(modes[(currentIndex + 1) % modes.length]);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!currentSong) {
    return (
      <Card className={`${className} bg-gray-800 border-gray-700`}>
        <CardContent className="p-6">
          <div className="text-center text-gray-400">
            <Music className="w-12 h-12 mx-auto mb-2" />
            <p>No songs in playlist</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${className} bg-gray-800 border-gray-700`}>
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Music className="w-5 h-5 text-green-400" />
          <h2 className="text-lg font-semibold text-white">Music Player</h2>
        </div>

        {/* Hidden audio element */}
        <audio ref={audioRef} preload="metadata" />

        {/* Current song info */}
        <div className="text-center mb-6">
          <img
            src={currentSong.artwork || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200'}
            alt={`${currentSong.title} artwork`}
            className="w-32 h-32 rounded-2xl mx-auto mb-4 shadow-lg object-cover"
          />
          <h3 className="font-semibold text-white text-lg mb-1 truncate">
            {currentSong.title}
          </h3>
          <p className="text-gray-400 truncate">{currentSong.artist}</p>
          {isLoading && (
            <p className="text-sm text-amber-400 mt-2">Loading...</p>
          )}
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <Slider
            value={[progress]}
            onValueChange={handleSeek}
            max={100}
            step={0.1}
            className="w-full"
            disabled={!duration || isLoading}
          />
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Main controls */}
        <div className="flex justify-center items-center gap-4 mb-6">
          <Button
            onClick={toggleShuffle}
            variant="ghost"
            size="icon"
            className={`rounded-full ${shuffle ? 'bg-green-400 text-black' : 'bg-gray-700 hover:bg-gray-600'}`}
          >
            <Shuffle className="w-4 h-4" />
          </Button>

          <Button
            onClick={handlePrevious}
            variant="ghost"
            size="icon"
            className="rounded-full bg-gray-700 hover:bg-gray-600"
            disabled={playlist.length <= 1}
          >
            <SkipBack className="w-5 h-5" />
          </Button>

          <Button
            onClick={handlePlayPause}
            className="w-14 h-14 rounded-full bg-green-400 hover:bg-green-500 text-black"
            disabled={!currentSong || isLoading}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6 ml-0.5" />
            )}
          </Button>

          <Button
            onClick={handleNext}
            variant="ghost"
            size="icon"
            className="rounded-full bg-gray-700 hover:bg-gray-600"
            disabled={playlist.length <= 1}
          >
            <SkipForward className="w-5 h-5" />
          </Button>

          <Button
            onClick={toggleRepeat}
            variant="ghost"
            size="icon"
            className={`rounded-full ${repeat !== 'none' ? 'bg-green-400 text-black' : 'bg-gray-700 hover:bg-gray-600'}`}
          >
            <Repeat className="w-4 h-4" />
            {repeat === 'one' && (
              <span className="absolute text-xs font-bold">1</span>
            )}
          </Button>
        </div>

        {/* Volume control */}
        <div className="flex items-center gap-3">
          <Button
            onClick={toggleMute}
            variant="ghost"
            size="icon"
            className="rounded-full bg-gray-700 hover:bg-gray-600 w-8 h-8"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </Button>
          
          <Slider
            value={[isMuted ? 0 : volume * 100]}
            onValueChange={handleVolumeChange}
            max={100}
            step={1}
            className="flex-1"
          />
        </div>

        {/* Playlist info */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-400">
            Track {currentSongIndex + 1} of {playlist.length}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}