import { useState, useEffect, useCallback } from 'react';
import { MediaInfo } from '@/types/timer';

export function useMediaSession() {
  const [mediaInfo, setMediaInfo] = useState<MediaInfo | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported('mediaSession' in navigator);
  }, []);

  const updateMediaSession = useCallback((info: Partial<MediaInfo>) => {
    if (!isSupported) return;

    try {
      if (info.title || info.artist || info.artwork) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: info.title || 'Unknown Title',
          artist: info.artist || 'Unknown Artist',
          artwork: info.artwork ? [{ src: info.artwork, sizes: '512x512', type: 'image/png' }] : [],
        });
      }

      navigator.mediaSession.playbackState = info.playbackState || 'none';

      setMediaInfo(prev => prev ? { ...prev, ...info } : null);
    } catch (error) {
      console.error('Error updating media session:', error);
    }
  }, [isSupported]);

  const setActionHandler = useCallback(
    (action: MediaSessionAction, handler: MediaSessionActionHandler | null) => {
      if (!isSupported) return;

      try {
        navigator.mediaSession.setActionHandler(action, handler);
      } catch (error) {
        console.error(`Error setting ${action} handler:`, error);
      }
    },
    [isSupported]
  );

  const detectCurrentMedia = useCallback(() => {
    // Try to detect currently playing media from browser tabs
    // This is limited by browser security, but we can check for basic info
    if (!isSupported) return null;

    // Check if there's any media session metadata available
    try {
      const metadata = navigator.mediaSession.metadata;
      if (metadata) {
        const detectedInfo: MediaInfo = {
          title: metadata.title || 'Unknown Title',
          artist: metadata.artist || 'Unknown Artist',
          artwork: metadata.artwork?.[0]?.src || '',
          duration: 0,
          position: 0,
          playbackState: navigator.mediaSession.playbackState,
          source: 'Browser',
        };
        setMediaInfo(detectedInfo);
        return detectedInfo;
      }
    } catch (error) {
      console.error('Error detecting media:', error);
    }

    return null;
  }, [isSupported]);

  useEffect(() => {
    if (isSupported) {
      // Try to detect existing media on mount
      detectCurrentMedia();

      // Set up default handlers that will be overridden by the component
      const defaultHandler = () => {
        console.log('Media session action triggered');
      };

      setActionHandler('play', defaultHandler);
      setActionHandler('pause', defaultHandler);
      setActionHandler('previoustrack', defaultHandler);
      setActionHandler('nexttrack', defaultHandler);
    }
  }, [isSupported, detectCurrentMedia, setActionHandler]);

  return {
    isSupported,
    mediaInfo,
    updateMediaSession,
    setActionHandler,
    detectCurrentMedia,
  };
}
