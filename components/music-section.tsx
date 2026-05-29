"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Play, Pause, SkipForward, SkipBack, Heart, Plus, Music2, Disc3, X, User, Link2, ExternalLink } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Song {
  id: string
  title: string
  artist: string
  cover: string
  addedBy: string
  caption: string
  streamingUrl?: string
  likes: number
  liked?: boolean
}

const initialPlaylist: Song[] = [
  {
    id: "1",
    title: "Graduation",
    artist: "Kanye West",
    cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80",
    addedBy: "Mike",
    caption: "This was OUR song during senior year",
    streamingUrl: "https://open.spotify.com/track/3MkLIJwrqhH4Z7YD9kPcMQ",
    likes: 24
  },
  {
    id: "2",
    title: "Good Riddance (Time of Your Life)",
    artist: "Green Day",
    cover: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&q=80",
    addedBy: "Sarah",
    caption: "Cried to this at prom",
    streamingUrl: "https://open.spotify.com/track/1zNXF2svmdlNxfS5XeNUgr",
    likes: 31
  },
  {
    id: "3",
    title: "Photograph",
    artist: "Ed Sheeran",
    cover: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&q=80",
    addedBy: "Emma",
    caption: "For all the memories we made",
    streamingUrl: "https://open.spotify.com/track/1HNkqx9Ahdgi1Ixy2xkKkL",
    likes: 28
  },
  {
    id: "4",
    title: "See You Again",
    artist: "Wiz Khalifa ft. Charlie Puth",
    cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80",
    addedBy: "Alex",
    caption: "Until we meet again friends",
    streamingUrl: "https://www.youtube.com/watch?v=RgKAFK5djSk",
    likes: 45
  },
  {
    id: "5",
    title: "Forever Young",
    artist: "Alphaville",
    cover: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&q=80",
    addedBy: "Jordan",
    caption: "Classic vibes for the class",
    streamingUrl: "https://open.spotify.com/track/2aoo2jlRnM3A0NyLQqMN2M",
    likes: 19
  },
]

function getStreamingPlatform(url: string): { name: string; color: string } | null {
  if (url.includes('spotify.com')) {
    return { name: 'Spotify', color: 'text-green-400' }
  }
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    return { name: 'YouTube', color: 'text-red-400' }
  }
  if (url.includes('apple.com') || url.includes('music.apple')) {
    return { name: 'Apple Music', color: 'text-pink-400' }
  }
  if (url.includes('soundcloud.com')) {
    return { name: 'SoundCloud', color: 'text-orange-400' }
  }
  return null
}

export function MusicSection() {
  const [playlist, setPlaylist] = useState<Song[]>(initialPlaylist)
  const [currentSong, setCurrentSong] = useState<Song | null>(playlist[0])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newSong, setNewSong] = useState({ title: "", artist: "", caption: "", streamingUrl: "" })
  const progressInterval = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isPlaying) {
      progressInterval.current = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            skipNext()
            return 0
          }
          return prev + 0.5
        })
      }, 100)
    } else {
      if (progressInterval.current) {
        clearInterval(progressInterval.current)
      }
    }
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current)
      }
    }
  }, [isPlaying])

  const toggleLike = (songId: string) => {
    setPlaylist(prev => prev.map(s => {
      if (s.id === songId) {
        return { ...s, liked: !s.liked, likes: s.liked ? s.likes - 1 : s.likes + 1 }
      }
      return s
    }))
    if (currentSong?.id === songId) {
      setCurrentSong(prev => prev ? {
        ...prev,
        liked: !prev.liked,
        likes: prev.liked ? prev.likes - 1 : prev.likes + 1
      } : null)
    }
  }

  const playSong = (song: Song, index: number) => {
    setCurrentSong(song)
    setCurrentIndex(index)
    setProgress(0)
    setIsPlaying(true)
  }

  const skipPrev = () => {
    const newIndex = (currentIndex - 1 + playlist.length) % playlist.length
    setCurrentIndex(newIndex)
    setCurrentSong(playlist[newIndex])
    setProgress(0)
  }

  const skipNext = () => {
    const newIndex = (currentIndex + 1) % playlist.length
    setCurrentIndex(newIndex)
    setCurrentSong(playlist[newIndex])
    setProgress(0)
  }

  const openStreamingLink = (url: string | undefined) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  const addSong = () => {
    if (!newSong.title.trim() || !newSong.artist.trim()) return
    const song: Song = {
      id: `s${Date.now()}`,
      title: newSong.title,
      artist: newSong.artist,
      cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80",
      addedBy: "You",
      caption: newSong.caption || "A special song for the memories",
      streamingUrl: newSong.streamingUrl || undefined,
      likes: 0
    }
    setPlaylist(prev => [song, ...prev])
    setNewSong({ title: "", artist: "", caption: "", streamingUrl: "" })
    setShowAddModal(false)
  }

  return (
    <div className="space-y-6">
      {/* Now Playing */}
      {currentSong && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-6 relative overflow-hidden border border-border shadow-lg"
        >
          {/* Background Blur */}
          <div className="absolute inset-0 opacity-30">
            <Image
              src={currentSong.cover}
              alt=""
              fill
              className="object-cover blur-2xl"
            />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <Music2 className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">
                Одоо тоглуулж буй
              </span>
            </div>

            <div className="flex items-center gap-4">
              {/* Album Art */}
              <motion.div
                className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0"
                animate={{ rotate: isPlaying ? 360 : 0 }}
                transition={{ duration: 3, repeat: isPlaying ? Infinity : 0, ease: "linear" }}
              >
                <Image
                  src={currentSong.cover}
                  alt={currentSong.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <Disc3 className="w-6 h-6 text-white/80" />
                </div>
              </motion.div>

              {/* Song Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate">{currentSong.title}</h3>
                <p className="text-sm text-muted-foreground truncate font-sans">{currentSong.artist}</p>
                {/* Added By - More Prominent */}
                <div className="flex items-center gap-1.5 mt-2 px-2 py-1 rounded-full bg-muted w-fit">
                  <User className="w-3 h-3 text-primary" />
                  <span className="text-xs text-primary font-medium">Нэмсэн: {currentSong.addedBy}</span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${progress}%`, background: "var(--primary)" }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1 font-sans">
                <span>{Math.floor(progress * 2.22 / 60)}:{String(Math.floor((progress * 2.22) % 60)).padStart(2, '0')}</span>
                <span>3:42</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-6 mt-4">
              <button 
                onClick={skipPrev}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <SkipBack className="w-5 h-5" />
              </button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5 ml-0.5" />
                )}
              </motion.button>
              <button 
                onClick={skipNext}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>

            {/* Like & Listen Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
              <button
                onClick={() => toggleLike(currentSong.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                  currentSong.liked
                    ? 'bg-accent/10 text-accent'
                    : 'bg-white/5 text-muted-foreground hover:text-accent'
                }`}
              >
                <Heart className={`w-4 h-4 ${currentSong.liked ? 'fill-current' : ''}`} />
                <span className="text-sm">{currentSong.likes}</span>
              </button>
              
              {currentSong.streamingUrl && (
                <button
                  onClick={() => openStreamingLink(currentSong.streamingUrl)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-muted-foreground hover:text-primary transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="text-xs sm:text-sm">
                  {getStreamingPlatform(currentSong.streamingUrl)?.name || 'Линк'} дээрээс сонсох
                  </span>
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Caption */}
      {currentSong && (
        <motion.div
          key={currentSong.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-card rounded-xl p-4 text-center border border-border shadow-sm"
        >
          <p className="text-sm text-muted-foreground italic font-sans">
            &ldquo;{currentSong.caption}&rdquo;
          </p>
          <p className="text-xs text-primary font-semibold mt-2">- {currentSong.addedBy}</p>
        </motion.div>
      )}

      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Дурсамжийн дуунууд</h2>
          <p className="text-sm text-muted-foreground font-sans">Тоглуулах жагсаалтад {playlist.length} дуу байна</p>
        </div>
        <Button 
          size="sm" 
          className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
          onClick={() => setShowAddModal(true)}
        >
          <Plus className="w-4 h-4" />
          Дуу нэмэх
        </Button>
      </div>

      {/* Playlist */}
      <div className="space-y-3">
        {playlist.map((song, index) => {
          const platform = song.streamingUrl ? getStreamingPlatform(song.streamingUrl) : null
          
          return (
            <motion.div
              key={song.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ x: 4 }}
              onClick={() => playSong(song, index)}
              className={`bg-card rounded-xl p-3 flex items-center gap-3 cursor-pointer group border border-border shadow-sm ${
                currentSong?.id === song.id ? "ring-1 ring-primary" : ""
              }`}
            >
              {/* Cover */}
              <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={song.cover}
                  alt={song.title}
                  fill
                  className="object-cover"
                />
                {currentSong?.id === song.id && isPlaying && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="flex gap-0.5">
                      {[1, 2, 3].map((bar) => (
                        <motion.div
                          key={bar}
                          className="w-1 bg-primary rounded-full"
                          animate={{ height: [4, 12, 4] }}
                          transition={{
                            duration: 0.5,
                            repeat: Infinity,
                            delay: bar * 0.1,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-foreground truncate">{song.title}</h4>
                <p className="text-xs text-muted-foreground truncate font-sans">{song.artist}</p>
                {/* Added By Badge & Platform */}
                <div className="flex items-center gap-2 mt-1 font-sans">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3 text-primary/70" />
                    <span className="text-[10px] text-primary/70">{song.addedBy}</span>
                  </div>
                  {platform && (
                    <span className={`text-[10px] ${platform.color}`}>
                      {platform.name}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                {song.streamingUrl && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      openStreamingLink(song.streamingUrl)
                    }}
                    className="p-2 rounded-full text-muted-foreground hover:bg-muted transition-colors"
                  > 
                    <ExternalLink className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleLike(song.id)
                  }}
                  className={`p-2 rounded-full hover:bg-muted transition-colors ${
                    song.liked ? "text-accent" : "text-muted-foreground hover:text-accent"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${song.liked ? "fill-current" : ""}`} />
                </button>
                <span className="text-xs text-muted-foreground min-w-[24px] text-right">
                  {song.likes}
                </span>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Add Song Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()} 
              className="w-full max-w-md bg-card rounded-2xl p-6 border border-border shadow-lg"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">Жагсаалтад дуу нэмэх</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted-foreground/10 transition-colors text-muted-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-muted">
                  <div className="w-16 h-16 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Music2 className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Группийнхэндээ зориулж онцгой дуу нэмээрэй</p>
                  </div>
                </div>
                
                <Input
                  value={newSong.title}
                  onChange={(e) => setNewSong(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="ДУУНЫ НЭР..."
                  className="bg-input border-border h-12 text-foreground font-semibold placeholder:text-muted-foreground"
                />
                
                <Input
                  value={newSong.artist}
                  onChange={(e) => setNewSong(prev => ({ ...prev, artist: e.target.value }))}
                  placeholder="ДУУЧИН ЭСВЭЛ ХАМТЛАГ..."
                  className="bg-input border-border h-12 text-foreground font-semibold placeholder:text-muted-foreground"
                />
                
                {/* Streaming Link Input */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Link2 className="w-3 h-3" />
                    <span>Бүх хүн сонсох боломжтой линк нэмээрэй</span>
                  </div>
                  <Input
                    value={newSong.streamingUrl}
                    onChange={(e) => setNewSong(prev => ({ ...prev, streamingUrl: e.target.value }))}
                    placeholder="Spotify, YouTube, эсвэл Apple Music линк..."
                    className="bg-input border-border h-12 text-foreground font-semibold placeholder:text-muted-foreground"
                  />
                  {newSong.streamingUrl && getStreamingPlatform(newSong.streamingUrl) && (
                    <div className={`text-xs flex items-center gap-1 ${getStreamingPlatform(newSong.streamingUrl)?.color}`}>
                      <ExternalLink className="w-3 h-3" />
                      {getStreamingPlatform(newSong.streamingUrl)?.name} link detected
                    </div>
                  )}
                </div>
                
                <Input
                  value={newSong.caption}
                  onChange={(e) => setNewSong(prev => ({ ...prev, caption: e.target.value }))}
                  placeholder="Энэ дуу яагаад онцгой вэ? (сонголтоор)"
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                />
                
                <Button 
                  onClick={addSong}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
                  disabled={!newSong.title.trim() || !newSong.artist.trim()}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Жагсаалтад нэмэх
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
