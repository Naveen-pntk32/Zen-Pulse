import { useState } from 'react';
import { Html5MusicPlayer, Song } from '@/components/html5-music-player';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Upload, Link as LinkIcon } from 'lucide-react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { FileUpload } from '@/components/file-upload';

// Sample playlist with free audio samples
const defaultPlaylist: Song[] = [
  {
    id: '1',
    title: 'Nature Sounds',
    artist: 'Ambient Collection',
    url: 'https://www.soundjay.com/misc/sounds/magic-chime-02.mp3',
    artwork: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200'
  },
  {
    id: '2', 
    title: 'Peaceful Melody',
    artist: 'Relaxation Sounds',
    url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3',
    artwork: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200'
  },
  {
    id: '3',
    title: 'Gentle Chimes',
    artist: 'Meditation Music',
    url: 'https://www.soundjay.com/misc/sounds/magic-chime-01.mp3',
    artwork: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200'
  }
];

export default function Music() {
  const [playlist, setPlaylist] = useLocalStorage<Song[]>('music-playlist', defaultPlaylist);
  const [newSong, setNewSong] = useState({
    title: '',
    artist: '',
    url: '',
    artwork: ''
  });

  const addSong = () => {
    if (!newSong.title || !newSong.artist || !newSong.url) return;
    
    const song: Song = {
      id: Date.now().toString(),
      title: newSong.title,
      artist: newSong.artist,
      url: newSong.url,
      artwork: newSong.artwork || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200'
    };
    
    setPlaylist([...playlist, song]);
    setNewSong({ title: '', artist: '', url: '', artwork: '' });
  };

  const handleFileUpload = (uploadedFile: any) => {
    // Extract song title from filename (remove extension)
    const fileName = uploadedFile.originalName;
    const titleFromFile = fileName.replace(/\.[^/.]+$/, "");
    
    const song: Song = {
      id: Date.now().toString(),
      title: titleFromFile,
      artist: 'Unknown Artist',
      url: uploadedFile.url,
      artwork: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200'
    };
    
    setPlaylist([...playlist, song]);
  };

  const removeSong = (id: string) => {
    setPlaylist(playlist.filter(song => song.id !== id));
  };

  const resetToDefault = () => {
    setPlaylist(defaultPlaylist);
  };

  return (
    <div className="text-white">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Music Player</h1>
          <p className="text-gray-400">Play your favorite tracks with HTML5 audio</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Music Player */}
          <div className="lg:sticky lg:top-6 lg:self-start">
            <Html5MusicPlayer 
              playlist={playlist}
              autoPlay={false}
              className="w-full"
            />
          </div>

          {/* Playlist Management */}
          <div className="space-y-6">
            {/* Add New Song */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Add New Song
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="upload" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="upload" className="flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Upload File
                    </TabsTrigger>
                    <TabsTrigger value="url" className="flex items-center gap-2">
                      <LinkIcon className="w-4 h-4" />
                      Add URL
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="upload" className="space-y-4">
                    <FileUpload onUploadComplete={handleFileUpload} />
                  </TabsContent>

                  <TabsContent value="url" className="space-y-4">
                    <Input
                      placeholder="Song title"
                      value={newSong.title}
                      onChange={(e) => setNewSong({ ...newSong, title: e.target.value })}
                      className="bg-gray-700 border-gray-600"
                    />
                    <Input
                      placeholder="Artist name"
                      value={newSong.artist}
                      onChange={(e) => setNewSong({ ...newSong, artist: e.target.value })}
                      className="bg-gray-700 border-gray-600"
                    />
                    <Input
                      placeholder="MP3 URL (e.g., https://example.com/song.mp3)"
                      value={newSong.url}
                      onChange={(e) => setNewSong({ ...newSong, url: e.target.value })}
                      className="bg-gray-700 border-gray-600"
                    />
                    <Input
                      placeholder="Artwork URL (optional)"
                      value={newSong.artwork}
                      onChange={(e) => setNewSong({ ...newSong, artwork: e.target.value })}
                      className="bg-gray-700 border-gray-600"
                    />
                    <Button 
                      onClick={addSong}
                      className="w-full bg-green-400 hover:bg-green-500 text-black"
                      disabled={!newSong.title || !newSong.artist || !newSong.url}
                    >
                      Add Song
                    </Button>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Current Playlist */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Current Playlist ({playlist.length} songs)</CardTitle>
                <Button
                  onClick={resetToDefault}
                  variant="outline"
                  size="sm"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Reset to Default
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {playlist.map((song, index) => (
                    <div
                      key={song.id}
                      className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      <img
                        src={song.artwork || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40'}
                        alt={song.title}
                        className="w-10 h-10 rounded object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{song.title}</p>
                        <p className="text-sm text-gray-400 truncate">{song.artist}</p>
                      </div>
                      <span className="text-sm text-gray-400 mr-2">#{index + 1}</span>
                      <Button
                        onClick={() => removeSong(song.id)}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-400/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  {playlist.length === 0 && (
                    <div className="text-center text-gray-400 py-8">
                      <Upload className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No songs in playlist</p>
                      <p className="text-sm">Add some songs to get started</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card className="bg-blue-900/20 border-blue-700/50">
              <CardHeader>
                <CardTitle className="text-blue-300">How to Add Your Music</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-blue-200 space-y-2">
                <p>• <strong>Upload Files:</strong> Drag & drop or browse to upload MP3, WAV, OGG, M4A, AAC files (up to 50MB)</p>
                <p>• <strong>URL Method:</strong> Add direct links to audio files hosted online</p>
                <p>• <strong>Cloud Storage:</strong> Your uploaded files are stored securely and synced across devices</p>
                <p>• <strong>File Management:</strong> Uploaded files are automatically organized and accessible offline</p>
                <p>• <strong>Artwork:</strong> Add image URLs for album covers (optional)</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}