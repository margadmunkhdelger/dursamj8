"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useRef, useCallback, useEffect } from "react"
import { Heart, MessageCircle, Share2, X, ChevronLeft, ChevronRight, Plus, Send, Upload, ImagePlus, Camera, LayoutGrid, Rotate3d, Play, MoveHorizontal } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Carousel3D } from "./carousel-3d"

interface Memory {
  id: string
  type: "photo" | "video"
  src: string
  caption: string
  date: string
  likes: number
  comments: Comment[]
  author: string
  liked?: boolean
  aspectRatio?: number
}

interface Comment {
  id: string
  author: string
  text: string
  time: string
}

const getYouTubeId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const initialMemories: Memory[] = [
  {
    id: "v1",
    type: "video",
    src: "https://youtu.be/PO2tKcyTW8U",
    caption: "Бидний хамгийн нандин мөчүүд 🎓",
    date: "2024 оны 5-р сарын 28",
    likes: 124,
    comments: [],
    author: "Ангийнхан"
  },
  {
    id: "1",
    type: "photo",
    src: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80",
    caption: "Our last day together before graduation. The memories we made will last forever.",
    date: "May 28, 2024",
    likes: 42,
    comments: [
      { id: "c1", author: "Mike", text: "Best day ever!", time: "2d ago" },
      { id: "c2", author: "Emma", text: "I miss this so much", time: "1d ago" }
    ],
    author: "Sarah"
  },
  {
    id: "2",
    type: "photo",
    src: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80",
    caption: "Throwing caps in the air! We did it!",
    date: "May 25, 2024",
    likes: 68,
    comments: [{ id: "c3", author: "Jordan", text: "Legendary moment", time: "3d ago" }],
    author: "Mike"
  },
  {
    id: "3",
    type: "photo",
    src: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&q=80",
    caption: "Study sessions that turned into pizza nights",
    date: "April 15, 2024",
    likes: 35,
    comments: [],
    author: "Emma"
  },
  {
    id: "4",
    type: "photo",
    src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
    caption: "Group project that brought us all together",
    date: "March 10, 2024",
    likes: 28,
    comments: [],
    author: "Alex"
  },
  {
    id: "5",
    type: "photo",
    src: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80",
    caption: "Weekend adventures with the best people",
    date: "February 20, 2024",
    likes: 55,
    comments: [],
    author: "Jordan"
  },
  {
    id: "6",
    type: "photo",
    src: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80",
    caption: "The party that started it all",
    date: "September 5, 2023",
    likes: 89,
    comments: [],
    author: "Taylor"
  },
]

// Small photo-themed decorative elements between photos with subtle animation
function DecorativeElement({ type }: { type: number }) {
  const elements = [
    // Mini polaroid
    <motion.div 
      key="polaroid" 
      className="w-3 h-3.5 bg-[#f8e4b3]/60 rounded-[2px] shadow-sm p-[2px]"
      animate={{ rotate: [-5, 5, -5] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="w-full h-2 bg-[#c9a45c]/25 rounded-[1px]" />
    </motion.div>,
    // Camera lens
    <motion.svg 
      key="lens" 
      className="w-3.5 h-3.5 text-[#c9a45c]/50" 
      viewBox="0 0 24 24" 
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      animate={{ scale: [1, 1.15, 1] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
    >
      <circle cx="12" cy="12" r="8"/>
      <circle cx="12" cy="12" r="3"/>
    </motion.svg>,
    // Film strip
    <motion.div 
      key="film" 
      className="flex gap-0.5"
      animate={{ opacity: [0.3, 0.5, 0.3] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <div className="w-1 h-2 bg-[#c9a45c]/30 rounded-[1px]" />
      <div className="w-1 h-2 bg-[#c9a45c]/20 rounded-[1px]" />
      <div className="w-1 h-2 bg-[#c9a45c]/30 rounded-[1px]" />
    </motion.div>,
    // Photo corner
    <motion.svg 
      key="corner" 
      className="w-3 h-3 text-[#c9a45c]/40" 
      viewBox="0 0 24 24" 
      fill="currentColor"
      animate={{ rotate: [0, 90, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      <path d="M3 3h8v2H5v6H3V3z"/>
    </motion.svg>,
    // Shutter/aperture
    <motion.svg
      key="shutter"
      className="w-3.5 h-3.5 text-[#c9a45c]/30"
      viewBox="0 0 24 24"
      fill="currentColor"
      animate={{ rotate: [0, 60, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
    </motion.svg>,
  ]
  return elements[type % elements.length]
}

// Photo frame with dynamic aspect ratio support
function PhotoFrame({ 
  memory, 
  index, 
  onClick,
  onLoad
}: { 
  memory: Memory
  index: number
  onClick: () => void
  onLoad?: (aspectRatio: number) => void
}) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [aspectRatio, setAspectRatio] = useState(1)

  // Subtle rotation for scrapbook effect
  const rotations = [-1.5, 1, -1, 1.5, -0.5, 1, -1.5, 0.5]
  const rotation = rotations[index % rotations.length]

  useEffect(() => {
    const videoId = getYouTubeId(memory.src);
    if (memory.type === "video" && videoId) {
      setAspectRatio(1.77);
      setImageLoaded(true);
      onLoad?.(1.77);
      return;
    }

    const img = new window.Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      const ratio = img.width / img.height
      setAspectRatio(ratio)
      setImageLoaded(true)
      onLoad?.(ratio)
    }
    img.src = memory.src
  }, [memory.src, memory.type, onLoad])

  // Calculate frame dimensions based on actual aspect ratio of image
  const getFrameStyle = () => {
    // Видеоны хувьд 16:9 харьцааг (56.25%) албадах
    if (memory.type === "video") {
      return { paddingBottom: '56.25%' }
    }
    // For very wide images (panorama, 16:9, etc)
    if (aspectRatio >= 2) {
      return { paddingBottom: '50%' }
    } else if (aspectRatio >= 1.5) {
      return { paddingBottom: '66%' }
    } else if (aspectRatio >= 1.2) {
      return { paddingBottom: '83%' }
    // For square-ish images
    } else if (aspectRatio >= 0.8) {
      return { paddingBottom: '100%' }
    // For vertical images (portrait)
    } else if (aspectRatio >= 0.5) {
      return { paddingBottom: `${Math.round(100 / aspectRatio)}%` }
    // For very tall images (1:4 etc)
    } else if (aspectRatio >= 0.25) {
      return { paddingBottom: `${Math.min(Math.round(100 / aspectRatio), 200)}%` }
    }
    // Default for extremely tall images - cap at 200%
    return { paddingBottom: '200%' }
  }

  const frameStyle = getFrameStyle()

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, rotate: rotation }}
      animate={{ opacity: 1, y: 0, rotate: rotation }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
      whileHover={{ 
        scale: 1.02, 
        rotate: 0,
        zIndex: 10,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="relative cursor-pointer group"
      style={{ zIndex: 1 }}
    >
      {/* Soft shadow */}
      <div className="absolute inset-0 bg-black/10 rounded-lg blur-md translate-y-1 translate-x-0.5 z-0" />
      
      {/* Deep Blue Frame - Slightly Wider and Elegant */}
      <div className="relative p-2 rounded-lg bg-[#1f2d5a] shadow-2xl border border-[#1f2d5a]/80 z-10">
        {/* Gold line running through the middle of the frame */}
        <div className="absolute inset-[4px] border border-[#d4af37] rounded-[6px] pointer-events-none z-20" />

        {/* Inner Content Area */}
        <div className="relative rounded-md shadow-xl overflow-hidden flex flex-col bg-white">
          <div 
            className="relative w-full overflow-hidden bg-stone-50"
            style={frameStyle}
          >
            {!imageLoaded && (
              <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />
            )}

            {memory.type === "video" && getYouTubeId(memory.src) ? (
              <div className="absolute inset-0 bg-stone-100 flex items-center justify-center">
                <Image
                  src={`https://i.ytimg.com/vi/${getYouTubeId(memory.src)}/hqdefault.jpg`}
                  alt={memory.caption}
                  fill
                  className="object-cover"
                />
                <Play className="w-10 h-10 text-white/80 relative z-10" />
              </div>
            ) : imageLoaded ? (
              <Image
                src={memory.src}
                alt={memory.caption}
                fill
                sizes="(max-width: 640px) 45vw, 200px"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 bg-muted/50 animate-pulse" />
            )}
            
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1f2d5a]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          
          {/* Caption label at bottom (Author removed as requested) */}
          <div className="py-2 text-center px-1 bg-white">
            <p className="text-[9px] text-[#1f2d5a] italic leading-snug line-clamp-2 font-serif">
              {memory.caption}
            </p>
          </div>
        </div>
      </div>

      {/* Like indicator */}
      {memory.liked && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1.5 -right-1.5 w-5 h-5 sm:w-6 sm:h-6 bg-red-500 rounded-full flex items-center justify-center shadow-md z-10"
        >
          <Heart className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white fill-white" />
        </motion.div>
      )}
    </motion.div>
  )
}

interface MemoryGalleryProps {
  currentUser?: { name: string; nickname: string; avatar: string } | null
  onBack?: () => void
  schoolName?: string
  graduationYear?: number
}

export function MemoryGallery({ currentUser, onBack, schoolName, graduationYear }: MemoryGalleryProps) {
  const [memories, setMemories] = useState<Memory[]>(initialMemories)
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [newMemory, setNewMemory] = useState({ caption: "", imageUrl: "", date: "" })
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [clickOrigin, setClickOrigin] = useState({ x: 0, y: 0 })
  const [viewMode, setViewMode] = useState<"grid" | "3d">("3d")
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Format date to Mongolian
  const formatMongolianDate = (dateStr: string) => {
    if (!dateStr) return ""
    const date = new Date(dateStr)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    
    const mongolianMonths = [
      "1-р сар", "2-р сар", "3-р сар", "4-р сар", "5-р сар", "6-р сар",
      "7-р сар", "8-р сар", "9-р сар", "10-р сар", "11-р сар", "12-р сар"
    ]
    
    return `${year} оны ${mongolianMonths[month - 1]}ын ${day}`
  }

  const handleFileSelect = useCallback((file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setPreviewImage(result)
        setNewMemory(prev => ({ ...prev, imageUrl: result }))
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }, [handleFileSelect])

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const openMemory = (memory: Memory, index: number, e: React.MouseEvent) => {
    // Get click position for whirl animation origin
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    setClickOrigin({ x: centerX, y: centerY })
    setSelectedMemory(memory)
    setCurrentIndex(index)
    setShowComments(false)
  }

  const navigateMemory = (direction: "prev" | "next") => {
    const newIndex = direction === "prev"
      ? (currentIndex - 1 + memories.length) % memories.length
      : (currentIndex + 1) % memories.length
    setCurrentIndex(newIndex)
    setSelectedMemory(memories[newIndex])
    setShowComments(false)
  }

  const toggleLike = (memoryId: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    setMemories(prev => prev.map(m => {
      if (m.id === memoryId) {
        return {
          ...m,
          liked: !m.liked,
          likes: m.liked ? m.likes - 1 : m.likes + 1
        }
      }
      return m
    }))
    if (selectedMemory?.id === memoryId) {
      setSelectedMemory(prev => prev ? {
        ...prev,
        liked: !prev.liked,
        likes: prev.liked ? prev.likes - 1 : prev.likes + 1
      } : null)
    }
  }

  const addComment = () => {
    if (!newComment.trim() || !selectedMemory) return
    const comment: Comment = {
      id: `c${Date.now()}`,
      author: currentUser?.name || "Anonymous",
      text: newComment,
      time: "Just now"
    }
    setMemories(prev => prev.map(m => {
      if (m.id === selectedMemory.id) {
        return { ...m, comments: [...m.comments, comment] }
      }
      return m
    }))
    setSelectedMemory(prev => prev ? {
      ...prev,
      comments: [...prev.comments, comment]
    } : null)
    setNewComment("")
  }

  const addMemory = () => {
    if (!newMemory.caption.trim() || !newMemory.imageUrl) return
    const today = new Date().toISOString().split('T')[0]
    const youtubeId = getYouTubeId(newMemory.imageUrl);
    const memory: Memory = {
      id: `m${Date.now()}`,
      type: youtubeId ? "video" : "photo",
      src: newMemory.imageUrl,
      caption: newMemory.caption,
      date: formatMongolianDate(today),
      likes: 0,
      comments: [],
      author: currentUser?.name || "Anonymous"
    }
    setMemories(prev => [memory, ...prev])
    setNewMemory({ caption: "", imageUrl: "", date: "" })
    setPreviewImage(null)
    setShowAddModal(false)
  }

  const resetAddModal = () => {
    setShowAddModal(false)
    setNewMemory({ caption: "", imageUrl: "", date: "" })
    setPreviewImage(null)
  }

  return (
    <div className="relative w-full flex flex-col bg-background overflow-hidden">
      {/* Floating photo-themed decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Paper texture overlay for the entire gallery background */}
        <div 
          className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-multiply"
          style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/natural-paper.png')` }}
        />

        {/* Subtle gradient glows - matching other pages */}
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-[#c9a45c]/5 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-[#1f2d5a]/5 blur-[80px] pointer-events-none" />

        {/* Floating mini polaroid frame - top left */}
        <motion.div
          animate={{ 
            y: [0, -6, 0],
            rotate: [-8, -12, -8],
            opacity: [0.15, 0.25, 0.15]
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 left-3"
        >
          <div className="w-6 h-7 bg-white/80 rounded-sm shadow-sm p-0.5">
            <div className="w-full h-4 bg-primary/20 rounded-[1px]" />
          </div>
        </motion.div>
        
        {/* Camera icon - top right */}
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.35, 0.2]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute top-8 right-6"
        >
          <Camera className="w-4 h-4 text-primary/40" />
        </motion.div>
        
        {/* Film strip dots - left side */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-24 left-2 flex flex-col gap-1"
        >
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-sm bg-primary/15" />
          ))}
        </motion.div>
        
        {/* Floating mini polaroid - right side */}
        <motion.div
          animate={{ 
            y: [0, 8, 0],
            rotate: [12, 8, 12],
            opacity: [0.12, 0.22, 0.12]
          }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
          className="absolute top-20 right-4"
        >
          <div className="w-5 h-6 bg-white/70 rounded-sm shadow-sm p-0.5">
            <div className="w-full h-3.5 bg-accent/20 rounded-[1px]" />
          </div>
        </motion.div>
        
        {/* Photo corner decoration - bottom left */}
        <motion.div
          animate={{ opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute bottom-20 left-1"
        >
          <svg className="w-4 h-4 text-primary/25" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 3h6v6H3V3zm0 12h6v6H3v-6z"/>
          </svg>
        </motion.div>
        
        {/* Aperture/lens icon - floating */}
        <motion.div
          animate={{ 
            rotate: [0, 360],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-32 right-1/4"
        >
          <svg className="w-3 h-3 text-primary/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <circle cx="12" cy="12" r="4"/>
          </svg>
        </motion.div>
      </div>

      {/* Content Area - no min-height, grows with content */}
      <div className="relative flex-1 flex flex-col px-3 sm:px-4 py-4 sm:py-5 min-h-0">
        {/* Header Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 relative overflow-hidden bg-[#1f2d5a] rounded-2xl p-4 shadow-xl border border-[#c9a45c]/30"
        >
          {/* Decorative Gold Line */}
          <div className="absolute inset-1.5 border border-[#c9a45c]/40 rounded-[14px] pointer-events-none" />

          {/* Decorative Corner Ornaments */}
          <div className="absolute top-0 right-0 w-16 h-16 opacity-20 pointer-events-none">
            <svg viewBox="0 0 100 100" className="w-full h-full fill-[#c9a45c]">
              <path d="M100 0 L100 100 L0 0 Z" />
            </svg>
          </div>
          <div className="absolute bottom-0 left-0 w-12 h-12 opacity-10 pointer-events-none rotate-180">
            <svg viewBox="0 0 100 100" className="w-full h-full fill-[#c9a45c]">
              <path d="M100 0 L100 100 L0 0 Z" />
            </svg>
          </div>

          <div className="relative z-10 text-center">
            <h2 className="text-xl sm:text-2xl font-serif font-black text-[#f8e4b3] leading-tight">
              Бидний бүтээсэн дурсамж
            </h2>
          </div>
        </motion.div>

        {/* Header Section - more decorative */}
        <div className="mb-5 sm:mb-6 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="w-11 h-11 rounded-full bg-[#1f2d5a] flex items-center justify-center shadow-md border border-[#c9a45c] shrink-0">
              <Camera className="w-6 h-6 text-[#f8e4b3]" />
            </div>
            
            <div className="flex items-center gap-1 bg-[#1f2d5a] p-1 rounded-full shadow-inner border border-[#c9a45c]">
              <button 
                onClick={() => setViewMode("3d")}
                className={cn("p-1.5 rounded-full transition-all", viewMode === "3d" ? "bg-[#c9a45c] text-[#1f2d5a] shadow-sm" : "text-[#f8e4b3] hover:text-white")}
              >
                <Rotate3d className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setViewMode("grid")}
                className={cn("p-1.5 rounded-full transition-all", viewMode === "grid" ? "bg-[#c9a45c] text-[#1f2d5a] shadow-sm" : "text-[#f8e4b3] hover:text-white")}
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
            </div>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-1.5 bg-[#1f2d5a] border border-[#c9a45c] hover:bg-[#2a4178] text-[#f8e4b3] shadow-md text-[10px] font-bold uppercase tracking-widest px-4 h-10 rounded-full shrink-0"
              onClick={() => setShowAddModal(true)}
            >
              <Plus className="w-3 h-3 text-[#f8e4b3]" />
              <span className="hidden sm:inline">Дурсамж</span> нэмэх
            </motion.button>
          </div>

          {/* Зааварчилгаа - 3D харагдац үед харагдана */}
          <AnimatePresence>
            {viewMode === "3d" && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="flex flex-col items-center gap-1 pt-1"
              >
                <div className="flex items-center gap-3">
                  <div className="h-px w-8 bg-gradient-to-r from-transparent to-[#c9a45c]" />
                  <MoveHorizontal className="w-3.5 h-3.5 text-[#c9a45c]" />
                  <div className="h-px w-8 bg-gradient-to-l from-transparent to-[#c9a45c]" />
                </div>
                <span className="text-[10px] uppercase font-black tracking-[0.3em] text-[#1f2d5a]">Дурсамжаа эргүүлж үзнэ үү</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Decorative divider */}
          <div className="flex items-center gap-2 px-1">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#c9a45c]/30 to-transparent" />
            <div className="flex items-center gap-1.5">
              <div className="w-1 h-1 rounded-full bg-[#c9a45c]/30" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#c9a45c]/60" />
              <div className="w-1 h-1 rounded-full bg-[#c9a45c]/30" />
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#c9a45c]/30 to-transparent" />
          </div>
        </div>

        {/* Photo Grid with decorative elements */}
        {viewMode === "grid" ? (
          <div className="relative">
            {/* Corner decorations */}
            <div className="absolute -top-2 -left-1 w-6 h-6 border-l-2 border-t-2 border-[#c9a45c]/20 rounded-tl-lg" />
            <div className="absolute -top-2 -right-1 w-6 h-6 border-r-2 border-t-2 border-[#c9a45c]/20 rounded-tr-lg" />
            
            <div className="flex gap-4 sm:gap-5 pb-4 items-start">
              {/* Зүүн багана - Тэгш индексүүд */}
              <div className="flex-1 flex flex-col gap-4 sm:gap-5">
                {memories.map((memory, i) => i % 2 === 0 ? (
                  <div key={memory.id} className="relative">
                    <PhotoFrame
                      memory={memory}
                      index={i}
                      onClick={(e: any) => openMemory(memory, i, e)}
                    />
                    {/* Чимэглэлийн элементүүд */}
                    {i % 3 === 1 && i < memories.length - 1 && (
                      <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 z-0">
                        <DecorativeElement type={i} />
                      </div>
                    )}
                  </div>
                ) : null)}
              </div>

              {/* Баруун багана - Сондгой индексүүд */}
              <div className="flex-1 flex flex-col gap-4 sm:gap-5">
                {memories.map((memory, i) => i % 2 !== 0 ? (
                  <div key={memory.id} className="relative">
                    <PhotoFrame
                      memory={memory}
                      index={i}
                      onClick={(e: any) => openMemory(memory, i, e)}
                    />
                    {/* Чимэглэлийн элементүүд */}
                    {i % 3 === 1 && i < memories.length - 1 && (
                      <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 z-0">
                        <DecorativeElement type={i} />
                      </div>
                    )}
                  </div>
                ) : null)}
              </div>
            </div>
            
            {/* Bottom corner decorations */}
            <div className="absolute -bottom-2 -left-1 w-6 h-6 border-l-2 border-b-2 border-[#c9a45c]/20 rounded-bl-lg" />
            <div className="absolute -bottom-2 -right-1 w-6 h-6 border-r-2 border-b-2 border-[#c9a45c]/20 rounded-br-lg" />
          </div>
        ) : (
          <Carousel3D memories={memories} onSelect={openMemory} />
        )}
        
        {/* Bottom decorative flourish */}
        {memories.length > 0 && (
          <motion.div 
            className="flex items-center justify-center gap-3 pt-4 pb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div 
              className="w-10 h-px bg-gradient-to-r from-transparent via-primary/30 to-primary/10"
              animate={{ scaleX: [0.8, 1, 0.8] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            {/* Mini camera icon */}
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Camera className="w-3.5 h-3.5 text-primary/35" />
            </motion.div>
            <motion.div 
              className="w-10 h-px bg-gradient-to-l from-transparent via-primary/30 to-primary/10"
              animate={{ scaleX: [0.8, 1, 0.8] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
            />
          </motion.div>
        )}
      </div>

      {/* Add Memory Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-white/5 backdrop-blur-md flex items-center justify-center p-4"
            onClick={resetAddModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()} 
              className="w-[calc(100%-2rem)] max-w-md bg-card rounded-3xl p-6 relative overflow-hidden border border-border shadow-2xl"
            >
              <div className="absolute inset-0 opacity-[0.06] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#f8e4b3] to-[#d4af37] flex items-center justify-center shadow-md border border-amber-900/10">
                    <Camera className="w-6 h-6 text-[#14213d]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1f2d5a] font-serif tracking-tight">Шинэ дурсамж</h3>
                </div>
                <button
                  onClick={resetAddModal}
                  className="w-9 h-9 rounded-full flex items-center justify-center bg-stone-100 hover:bg-stone-200 text-stone-500 transition-colors shadow-sm"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  aria-label="Upload image file"
                  className="hidden"
                />
                
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer border-2 border-dashed transition-colors bg-stone-50/50 ${
                    isDragging ? 'border-[#c9a45c] bg-[#c9a45c]/5' : 'border-stone-200 hover:border-[#c9a45c]/50'
                  }`}
                >
                  {previewImage ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={previewImage}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <p className="text-xs text-white bg-black/50 px-2 py-1 rounded">Солих</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full gap-2 p-4">
                      <motion.div
                        animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
                        className="w-12 h-12 rounded-full bg-[#c9a45c]/10 flex items-center justify-center border border-[#c9a45c]/30 shadow-sm"
                      >
                        {isDragging ? (
                          <Upload className="w-6 h-6 text-[#1f2d5a]" />
                        ) : (
                          <ImagePlus className="w-6 h-6 text-[#1f2d5a]" />
                        )}
                      </motion.div>
                      <div className="text-center">
                        <p className="text-xs font-bold text-[#1f2d5a] font-sans uppercase tracking-wider">
                          {isDragging ? "Зургаа энд тавина уу" : "Зураг сонгох"}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          эсвэл чирж оруулна уу
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="relative">
                  <Input
                    value={newMemory.imageUrl}
                    onChange={(e) => {
                      setNewMemory(prev => ({ ...prev, imageUrl: e.target.value }));
                      // YouTube линк байвал зургийн preview-г арилгах
                      if (getYouTubeId(e.target.value)) setPreviewImage(null);
                    }}
                    placeholder="Эсвэл YouTube линкээ энд оруулж болно..."
                    className="bg-white/50 border-stone-200 text-xs h-10 rounded-xl text-[#1f2d5a]"
                  />
                </div>

                <Input
                  value={newMemory.caption}
                  onChange={(e) => setNewMemory(prev => ({ ...prev, caption: e.target.value }))}
                  placeholder="Энэ мөчийн тухай бичнэ үү..."
                  className="bg-white/50 border-stone-200 text-sm h-11 rounded-xl text-[#1f2d5a] font-serif italic"
                />
                
                <Button 
                  onClick={addMemory}
                  className="w-full h-12 bg-[#1f2d5a] hover:bg-[#2a4178] text-white font-bold rounded-xl shadow-lg transition-all active:scale-[0.98]"
                  disabled={!newMemory.caption.trim() || !newMemory.imageUrl}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Нэмэх
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen Viewer Modal */}
      <AnimatePresence>
        {selectedMemory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[80] bg-[#f6f1eb]/95 backdrop-blur-md flex flex-col overflow-hidden"
          >
            {/* Soft light rays emanating from click point */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <motion.div
                initial={{ opacity: 0.6 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute inset-0 z-10"
                style={{
                  background: `radial-gradient(circle at ${clickOrigin.x}px ${clickOrigin.y}px, rgba(255,255,255,0.15) 0%, transparent 50%)`
                }}
              />
              
              {/* Swipe instruction for mobile */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.4, 0] }}
                transition={{ delay: 1, duration: 2, repeat: 1 }}
                className="absolute bottom-32 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 sm:hidden"
              >
                <div className="flex items-center gap-4">
                  <ChevronLeft className="w-4 h-4 text-white/40" />
                  <div className="w-12 h-0.5 bg-white/20 rounded-full" />
                  <ChevronRight className="w-4 h-4 text-white/40" />
                </div>
                <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Шударч үзнэ үү</span>
              </motion.div>
            </div>

            {/* Main Content Area */}
            <div 
              className="flex-1 flex flex-col items-center justify-center px-4 sm:px-12 pb-12 min-h-0 relative z-20"
              style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 5rem)" }}
            >
              
              {/* Stable UI Wrapper for Controls and Animated Content */}
              <div className="relative w-[280px] sm:w-[350px] flex flex-col items-center">
                
                {/* Close Button (Stable - Outside keyed content) */}
                <motion.button
                  key="close-button"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.2 }}
                  onClick={() => setSelectedMemory(null)}
                  aria-label="Close memory view"
                  className="absolute -top-16 right-0 z-50 w-12 h-12 rounded-full bg-[#1f2d5a] flex items-center justify-center text-[#f8e4b3] hover:bg-[#2a4178] transition-all border border-[#c9a45c]/50 shadow-xl"
                >
                  <X className="w-7 h-7" />
                </motion.button>

              <motion.div
                key={selectedMemory.id}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.7}
                onDragEnd={(e, info) => {
                  const swipe = info.offset.x;
                  const velocity = info.velocity.x;
                  if (swipe < -100 || (swipe < -20 && velocity < -500)) {
                    navigateMemory("next");
                  } else if (swipe > 100 || (swipe > 20 && velocity > 500)) {
                    navigateMemory("prev");
                  }
                }}
                initial={{ 
                  scale: 0.8,
                  opacity: 0,
                  y: 20,
                  filter: "blur(8px)"
                }}
                animate={{ 
                  scale: 1,
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)"
                }}
                exit={{ 
                  scale: 0.9,
                  opacity: 0,
                  filter: "blur(4px)"
                }}
                transition={{ 
                  duration: 0.35,
                  ease: [0.32, 0.72, 0, 1]
                }}
                className="flex flex-col max-h-full items-center cursor-grab active:cursor-grabbing w-full"
              >
                {/* Premium Frame style matching 3D items */}
                <div className="relative p-2 rounded-lg bg-[#1f2d5a] shadow-2xl border border-[#1f2d5a]/80 w-full">
                  <div className="absolute inset-[4px] border border-[#d4af37] rounded-[6px] pointer-events-none z-20" />
                  
                  <div className="relative rounded-md shadow-xl overflow-hidden flex flex-col bg-white">
                    <div className="relative overflow-hidden flex items-center justify-center bg-stone-50">
                      {selectedMemory.type === "video" && getYouTubeId(selectedMemory.src) ? (
                        <div className="w-full aspect-video">
                          <iframe
                            width="100%"
                            height="100%"
                            src={`https://www.youtube.com/embed/${getYouTubeId(selectedMemory.src)}?autoplay=1`}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            className="w-full h-full"
                          />
                        </div>
                      ) : (
                        <Image
                          src={selectedMemory.src}
                          alt={selectedMemory.caption}
                          width={800}
                          height={800}
                          className="object-contain w-full h-auto max-h-[60vh]"
                          priority
                        />
                      )}
                    </div>

                    <div className="py-3 text-center px-4 bg-white border-t border-stone-100">
                      <p className="text-[11px] sm:text-xs text-[#1f2d5a] italic leading-snug line-clamp-2 font-serif">
                        {selectedMemory.caption}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Navigation Controls (Stable - Outside keyed content) */}
              <motion.div 
                key="nav-controls"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-10 mt-10 z-30"
              >
                <button
                  onClick={() => navigateMemory("prev")}
                  className="w-14 h-14 rounded-full bg-[#1f2d5a] flex items-center justify-center text-[#f8e4b3] hover:bg-[#2a4178] transition-all border border-[#c9a45c]/50 shadow-xl active:scale-95"
                  title="Өмнөх"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={() => navigateMemory("next")}
                  className="w-14 h-14 rounded-full bg-[#1f2d5a] flex items-center justify-center text-[#f8e4b3] hover:bg-[#2a4178] transition-all border border-[#c9a45c]/50 shadow-xl active:scale-95"
                  title="Дараах"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </motion.div>
              </div>
            </div>
            
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
