"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useRef, useCallback, useEffect } from "react"
import { Heart, MessageCircle, Share2, X, ChevronLeft, ChevronRight, Plus, Send, Upload, ImagePlus, Sparkles, Camera } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

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

const initialMemories: Memory[] = [
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
      className="w-3 h-3.5 bg-white/60 rounded-[2px] shadow-sm p-[2px]"
      animate={{ rotate: [-5, 5, -5] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="w-full h-2 bg-primary/25 rounded-[1px]" />
    </motion.div>,
    // Camera lens
    <motion.svg 
      key="lens" 
      className="w-3.5 h-3.5 text-primary/35" 
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
      <div className="w-1 h-2 bg-primary/30 rounded-[1px]" />
      <div className="w-1 h-2 bg-primary/20 rounded-[1px]" />
      <div className="w-1 h-2 bg-primary/30 rounded-[1px]" />
    </motion.div>,
    // Photo corner
    <motion.svg 
      key="corner" 
      className="w-3 h-3 text-primary/35" 
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
      className="w-3.5 h-3.5 text-primary/30"
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
    const img = new window.Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      const ratio = img.width / img.height
      setAspectRatio(ratio)
      setImageLoaded(true)
      onLoad?.(ratio)
    }
    img.src = memory.src
  }, [memory.src, onLoad])

  // Calculate frame dimensions based on actual aspect ratio of image
  const getFrameStyle = () => {
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
      <div className="absolute inset-0 bg-black/10 rounded-lg blur-md translate-y-1 translate-x-0.5" />
      
      {/* Gingham pattern border */}
      <div className="relative bg-white p-1.5 sm:p-2 rounded-lg shadow-md gingham-frame">
        {/* Inner white mat */}
        <div className="bg-white p-0.5 rounded-md">
          {/* Photo container with dynamic aspect ratio - adapts to image */}
                          <div 
                            className="relative w-full rounded-sm overflow-hidden bg-muted/10"
                            style={frameStyle}
                          >
                            {imageLoaded ? (
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
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>
        </div>
        
        {/* Date label at bottom with subtle background */}
        <div className="mt-1.5 flex justify-center">
          <span className="text-[8px] sm:text-[9px] text-foreground/70 font-sans truncate px-2 py-0.5 bg-muted/60 rounded-full">
            {memory.date}
          </span>
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
}

export function MemoryGallery({ currentUser, onBack }: MemoryGalleryProps) {
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
    if (!newMemory.caption.trim() || !newMemory.imageUrl || !newMemory.date) return
    const memory: Memory = {
      id: `m${Date.now()}`,
      type: "photo",
      src: newMemory.imageUrl,
      caption: newMemory.caption,
      date: formatMongolianDate(newMemory.date),
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
    <div className="relative w-full bg-background overflow-hidden">
      {/* Floating photo-themed decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
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
      <div className="relative px-3 sm:px-4 py-4 sm:py-5">
        {/* Header Section - more decorative */}
        <div className="mb-5 sm:mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 sm:gap-3">
              {onBack && ( 
                <Button variant="ghost" size="icon" onClick={onBack} className="w-8 h-8 rounded-full bg-card hover:bg-muted shadow-sm flex-shrink-0 border border-border">
                  <ChevronLeft className="w-4 h-4 text-foreground" />
                </Button>
              )}
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  <h2 className="text-lg sm:text-xl font-semibold text-foreground font-serif">Дурсамжууд</h2>
                </div>
                <p className="text-[10px] sm:text-xs text-muted-foreground font-sans mt-0.5 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" />
                  {memories.length} үнэт мөч хадгалагдсан
                </p>
              </div>
            </div>
            <Button 
              size="sm" 
              className="gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm text-xs px-3 h-8 flex-shrink-0"
              onClick={() => setShowAddModal(true)}
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Дурсамж</span> нэмэх
            </Button>
          </div>
          
          {/* Decorative divider */}
          <div className="flex items-center gap-2 px-1">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            <div className="flex items-center gap-1.5">
              <div className="w-1 h-1 rounded-full bg-primary/30" />
              <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
              <div className="w-1 h-1 rounded-full bg-primary/30" />
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>
        </div>

        {/* Photo Grid with decorative elements */}
        <div className="relative">
          {/* Corner decorations */}
          <div className="absolute -top-2 -left-1 w-6 h-6 border-l-2 border-t-2 border-primary/20 rounded-tl-lg" />
          <div className="absolute -top-2 -right-1 w-6 h-6 border-r-2 border-t-2 border-primary/20 rounded-tr-lg" />
          
          <div className="grid grid-cols-2 gap-4 sm:gap-5 pb-4">
          {memories.map((memory, index) => (
            <div key={memory.id} className="relative">
              <PhotoFrame
                memory={memory}
                index={index}
                onClick={(e) => openMemory(memory, index, e)}
              />
              {/* Small decorative element between some photos */}
              {index % 3 === 1 && index < memories.length - 1 && (
                <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 z-0">
                  <DecorativeElement type={index} />
                </div>
              )}
            </div>
          ))}
          </div>
          
          {/* Bottom corner decorations */}
          <div className="absolute -bottom-2 -left-1 w-6 h-6 border-l-2 border-b-2 border-primary/20 rounded-bl-lg" />
          <div className="absolute -bottom-2 -right-1 w-6 h-6 border-r-2 border-b-2 border-primary/20 rounded-br-lg" />
        </div>
        
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
            className="fixed inset-0 z-[60] bg-foreground/80 flex items-center justify-center p-3 sm:p-4"
            onClick={resetAddModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()} 
              className="w-full max-w-sm sm:max-w-md max-h-[85vh] overflow-y-auto bg-card rounded-xl p-4 sm:p-5 shadow-xl border border-border"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-primary" />
                  <h3 className="text-base font-semibold text-foreground font-serif">Шинэ дурсамж</h3>
                </div>
                <button
                  onClick={resetAddModal}
                  aria-label="Close"
                  className="w-7 h-7 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors text-muted-foreground"
                >
                  <X className="w-3.5 h-3.5" />
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
                  className={`relative aspect-[4/3] rounded-lg overflow-hidden cursor-pointer border-2 border-dashed transition-colors ${
                    isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
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
                        className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"
                      >
                        {isDragging ? (
                          <Upload className="w-5 h-5 text-primary" />
                        ) : (
                          <ImagePlus className="w-5 h-5 text-primary" />
                        )}
                      </motion.div>
                      <div className="text-center">
                        <p className="text-xs font-medium text-foreground">
                          {isDragging ? "Зургаа энд тавина уу" : "Зураг сонгох"}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          эсвэл чирж оруулна уу
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                
                <Input
                  value={newMemory.caption}
                  onChange={(e) => setNewMemory(prev => ({ ...prev, caption: e.target.value }))}
                  placeholder="Энэ мөчийн тухай бичнэ үү..."
                  className="bg-background text-sm"
                />
                
                <div className="flex items-center gap-2">
                  <label className="text-xs text-muted-foreground whitespace-nowrap">Огноо:</label>
                  <Input
                    type="date"
                    value={newMemory.date}
                    onChange={(e) => setNewMemory(prev => ({ ...prev, date: e.target.value }))}
                    className="bg-background text-sm flex-1"
                  />
                </div>
                
                <Button 
                  onClick={addMemory}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-9 text-sm"
                  disabled={!newMemory.caption.trim() || !newMemory.imageUrl || !newMemory.date}
                >
                  <Plus className="w-4 h-4 mr-1.5" />
                  Нэмэх
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen Viewer - elegant expand animation */}
      <AnimatePresence>
        {selectedMemory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] bg-foreground/95 flex flex-col overflow-hidden"
          >
            {/* Soft light rays emanating from click point */}
            <motion.div
              initial={{ opacity: 0.6 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute inset-0 pointer-events-none z-10"
              style={{
                background: `radial-gradient(circle at ${clickOrigin.x}px ${clickOrigin.y}px, rgba(255,255,255,0.15) 0%, transparent 50%)`
              }}
            />

            {/* Close Button */}
            <motion.button
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.2 }}
              onClick={() => setSelectedMemory(null)}
              aria-label="Close memory view"
              className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors backdrop-blur-sm"
            >
              <X className="w-5 h-5" />
            </motion.button>

            {/* Navigation */}
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35, duration: 0.2 }}
              onClick={() => navigateMemory("prev")}
              aria-label="Previous"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors backdrop-blur-sm"
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
            <motion.button
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35, duration: 0.2 }}
              onClick={() => navigateMemory("next")}
              aria-label="Next"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors backdrop-blur-sm"
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>

            {/* Main Content Area - smooth expand from click point */}
            <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-12 pt-14 pb-4 min-h-0 overflow-hidden">
              <motion.div
                key={selectedMemory.id}
                initial={{ 
                  scale: 0.3,
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
                className="flex flex-col max-h-full"
              >
                {/* Gingham frame for photo - adapts to image size */}
                <motion.div 
                  className="gingham-frame p-2.5 sm:p-3 rounded-xl inline-block"
                  initial={{ boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
                  animate={{ boxShadow: "0 25px 50px -12px rgba(0,0,0,0.4)" }}
                  transition={{ delay: 0.15, duration: 0.4 }}
                >
                  <div className="bg-white p-1.5 sm:p-2 rounded-lg">
                    <div className="relative rounded-md overflow-hidden flex items-center justify-center">
                      <Image
                        src={selectedMemory.src}
                        alt={selectedMemory.caption}
                        width={800}
                        height={800}
                        sizes="(max-width: 640px) 85vw, 500px"
                        className="object-contain max-h-[50vh] sm:max-h-[55vh] w-auto h-auto rounded-md"
                        priority
                      />
                    </div>
                  </div>
                  
                  {/* Caption inside frame - like Polaroid */}
                  <motion.div 
                    className="bg-white px-3 pb-3 pt-2 rounded-b-lg -mt-0.5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.25, duration: 0.2 }}
                  >
                    <p className="text-xs sm:text-sm text-foreground/80 text-center font-sans leading-relaxed">
                      {selectedMemory.caption}
                    </p>
                    <div className="flex justify-center mt-1.5">
                      <span className="text-[10px] text-foreground/60 font-sans px-2 py-0.5 bg-muted/50 rounded-full">
                        {selectedMemory.date}
                      </span>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
            
            {/* Bottom Actions Bar */}
            <motion.div
              className="bg-card/95 backdrop-blur-xl border-t border-border"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="max-w-md mx-auto px-4 py-3">
                {/* Actions */}
                <div className="flex items-center justify-center gap-6">
                  <button 
                    onClick={() => toggleLike(selectedMemory.id)} 
                    className={`flex items-center gap-2 transition-colors ${selectedMemory.liked ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'}`}
                  >
                    <Heart className={`w-5 h-5 ${selectedMemory.liked ? 'fill-current' : ''}`} />
                    <span className="text-sm font-medium">{selectedMemory.likes}</span>
                  </button>
                  <button 
                    onClick={() => setShowComments(!showComments)}
                    className={`flex items-center gap-2 transition-colors ${showComments ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">{selectedMemory.comments.length}</span>
                  </button>
                  <button aria-label="Share" className="text-muted-foreground hover:text-foreground transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Comments Section */}
                <AnimatePresence>
                  {showComments && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden" 
                    >
                      <div className="pt-3 mt-3 border-t border-border space-y-2 max-h-32 overflow-y-auto">
                        {selectedMemory.comments.length === 0 ? (
                          <p className="text-xs text-muted-foreground text-center py-2">Сэтгэгдэл байхгүй байна</p>
                        ) : (
                          selectedMemory.comments.map((comment) => (
                            <div key={comment.id} className="flex gap-2">
                              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-medium text-primary flex-shrink-0">
                                {comment.author[0]}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-foreground">
                                  <span className="font-semibold">{comment.author}</span>
                                  <span className="text-muted-foreground ml-1.5">{comment.text}</span>
                                </p>
                                <p className="text-[10px] text-muted-foreground/60">{comment.time}</p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                      
                      {/* Add Comment */}
                      <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                        <Input
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Сэтгэгдэл бичих..."
                          className="text-sm h-9"
                          onKeyDown={(e) => e.key === 'Enter' && addComment()}
                        />
                        <Button 
                          size="sm" 
                          onClick={addComment}
                          disabled={!newComment.trim()}
                          className="h-9 px-3"
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
