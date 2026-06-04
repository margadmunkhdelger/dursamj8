"use client"

import React, { useState, useEffect } from "react"
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Heart, MoveHorizontal, Play } from "lucide-react"

const getYouTubeId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

interface Comment {
  id: string
  author: string
  text: string
  time: string
}

interface Memory {
  id: string
  type: "photo" | "video"
  src: string
  caption: string
  date: string
  likes: number
  author: string
  liked?: boolean
  comments: Comment[]
  aspectRatio?: number
}

interface Carousel3DProps {
  memories: Memory[]
  onSelect: (memory: Memory, index: number, e: React.MouseEvent) => void
}

export function Carousel3D({ memories, onSelect }: Carousel3DProps) {
  const rotation = useMotionValue(0)
  
  // Илүү тансаг, зөөлөн хөдөлгөөнтэй болгохын тулд Spring ашиглав
  const smoothRotation = useSpring(rotation, {
    stiffness: 45,
    damping: 20
  })

  const count = memories.length
  const angleStep = 360 / count
  const radiusX = 550 // Илүү уудам тойрог зам
  const radiusZ = 450 // Илүү гүн 3D эффект

  const handleDrag = (event: any, info: any) => {
    const currentRotation = rotation.get()
    // Мэдрэгчийг тааруулав
    rotation.set(currentRotation + (info.delta.x * 0.35))
  }

  const handleDragEnd = (event: any, info: any) => {
    const currentRot = rotation.get()
    // Хамгийн ойрын зураг дээр очиж зогсох (Snap effect)
    const targetIndex = Math.round(-currentRot / angleStep)
    rotation.set(targetIndex * -angleStep)
  }

  return (
    <div className="relative w-full h-[480px] flex items-center justify-center overflow-hidden perspective-[1500px]">
      {/* Orbit Line Visual (Алтан гинжин тойрог зам) */}
      <div 
        className="absolute w-[1100px] h-[900px] border-2 border-[#c9a45c]/20 rounded-[50%] pointer-events-none z-5"
        style={{ 
          transform: "rotateX(75deg) translateY(20px)",
          boxShadow: "inset 0 0 120px rgba(201,164,92,0.1)"
        }}
      />

      {/* Төв хэсгийн гэрэлтэлт */}
      <div className="absolute w-80 h-80 bg-gradient-radial from-[#c9a45c]/10 to-transparent blur-3xl pointer-events-none z-0" />

      {/* Interactive 3D Orbit */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        className="relative w-full h-full flex items-center justify-center preserve-3d cursor-grab active:cursor-grabbing z-10"
      >
        {memories.map((memory, i) => (
          <CarouselItem 
            key={memory.id}
            memory={memory}
            index={i}
            rotation={smoothRotation}
            angleStep={angleStep}
            radiusX={radiusX}
            radiusZ={radiusZ}
            onSelect={(e) => onSelect(memory, i, e)}
          />
        ))}
      </motion.div>
    </div>
  )
}

interface CarouselItemProps {
  memory: Memory
  index: number
  rotation: any // MotionValue<number>
  angleStep: number
  radiusX: number
  radiusZ: number
  onSelect: (e: React.MouseEvent) => void
}

function CarouselItem({ memory, index, rotation, angleStep, radiusX, radiusZ, onSelect }: CarouselItemProps) {
  const [aspectRatio, setAspectRatio] = useState(memory.aspectRatio || 1)

  useEffect(() => {
    const videoId = getYouTubeId(memory.src);
    if (memory.type === "video" && videoId) {
      // Видеоны хувьд стандарт 16:9 харьцааг ашиглана. 
      // Ингэснээр YouTube-ийн 4:3 thumbnail дээрх хар зурааснууд автоматаар таслагдана.
      setAspectRatio(1.77); 
      return;
    }

    const img = new window.Image()
    img.crossOrigin = "anonymous"
    img.onload = () => setAspectRatio(img.width / img.height)
    img.src = memory.src
  }, [memory.src, memory.type])

  const baseAngle = index * angleStep
  const angle = useTransform(rotation, (r) => (r + baseAngle))
  
  // Эллипс хэлбэрийн байршил тооцоолох
  const x = useTransform(angle, (a) => Math.sin(a * (Math.PI / 180)) * radiusX)
  const z = useTransform(angle, (a) => Math.cos(a * (Math.PI / 180)) * radiusZ)
  
  // Гүнээс хамаарсан визуал эффектүүд
  const scale = useTransform(z, [-radiusZ, radiusZ], [0.5, 1.0]) 
  const opacity = useTransform(z, [-radiusZ, 0, radiusZ], [0.7, 0.85, 1]) 
  const brightness = useTransform(z, [-radiusZ, radiusZ], ["brightness(0.7)", "brightness(1)"]) 

  // Тойрог замын дагуух 3D эргэлт (Realism)
  const rotateY = useTransform(x, [-radiusX, 0, radiusX], [35, 0, -35])
  
  // Z-index-ийг динамикаар тохируулах (Урд байгаа нь үргэлж дээр)
  const zIndex = useTransform(z, (v) => Math.round(v + radiusZ))

  // Clamp aspect ratio to prevent vertical overflow of portrait images
  const displayAspectRatio = Math.max(0.7, aspectRatio)

  return (
    <motion.div
      onClick={onSelect}
      style={{
        x,
        z,
        scale,
        opacity,
        rotateY,
        zIndex,
      }}
      className="absolute w-[280px] sm:w-[320px] preserve-3d"
    >
      {/* Өлгөөтэй гинжний эффект */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-0.5 h-24 bg-gradient-to-b from-[#c9a45c]/5 via-[#c9a45c]/40 to-[#c9a45c]/80 z-0" />
      
      <motion.div 
        style={{ filter: brightness }}
        whileHover={{ y: -20, rotate: 0, transition: { duration: 0.3 } }}
        className="relative p-2 rounded-lg bg-[#1f2d5a] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.6)] border border-[#1f2d5a]/80"
      >
        {/* Gold line running through the middle of the frame */}
        <div className="absolute inset-[4px] border border-[#d4af37] rounded-[6px] pointer-events-none z-20" />

        <div className="relative rounded-md shadow-xl overflow-hidden bg-white flex flex-col">
          <div 
            className="relative bg-stone-50 overflow-hidden"
            style={{ aspectRatio: `${displayAspectRatio}` }}
          >
            {memory.type === "video" && getYouTubeId(memory.src) ? (
              <div className="absolute inset-0 bg-stone-100 flex items-center justify-center">
                <Image
                  src={`https://i.ytimg.com/vi/${getYouTubeId(memory.src)}/hqdefault.jpg`}
                  alt={memory.caption}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <Play className="w-10 h-10 text-white/80 relative z-10" />
              </div>
            ) : (
              <Image
                src={memory.src}
                alt={memory.caption}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="400px"
                priority={index < 3}
              />
            )}
          </div>
          
          <div className="py-2 text-center px-3 bg-white">
             <p className="text-[10px] text-[#1f2d5a] italic leading-snug line-clamp-2 px-1 font-serif">
               {memory.caption}
             </p>
          </div>
        </div>

        {/* Like Badge */}
        {memory.liked && (
          <div className="absolute -top-3 -right-3 w-8 h-8 bg-[#ff2d55] rounded-full flex items-center justify-center shadow-lg border-2 border-white z-20">
            <Heart className="w-4 h-4 text-white fill-current" />
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}