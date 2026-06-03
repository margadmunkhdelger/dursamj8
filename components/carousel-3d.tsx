"use client"

import React, { useState, useEffect } from "react"
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Heart, Sparkles, MoveHorizontal } from "lucide-react"

interface Memory {
  id: string
  type: "photo" | "video"
  src: string
  caption: string
  date: string
  likes: number
  author: string
  liked?: boolean
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
    <div className="relative w-full h-[600px] flex items-center justify-center overflow-hidden perspective-[1500px]">
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

      {/* Зааварчилгаа */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 pointer-events-none opacity-40 flex flex-col items-center gap-2">
        <div className="flex items-center gap-3">
          <div className="h-px w-10 bg-gradient-to-r from-transparent to-[#c9a45c]" />
          <MoveHorizontal className="w-4 h-4 text-[#c9a45c]" />
          <div className="h-px w-8 bg-gradient-to-l from-transparent to-[#c9a45c]" />
        </div>
        <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#1f2d5a]">Дурсамжаа эргүүлж үзнэ үү</span>
      </div>
    </div>
  )
}

function CarouselItem({ memory, index, rotation, angleStep, radiusX, radiusZ, onSelect }: any) {
  const [aspectRatio, setAspectRatio] = useState(memory.aspectRatio || 1)

  useEffect(() => {
    const img = new window.Image()
    img.onload = () => setAspectRatio(img.width / img.height)
    img.src = memory.src
  }, [memory.src])

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
      className="absolute w-[280px] sm:w-[320px] preserve-3d" // Зургийн хэмжээг бага зэрэг томсгосон
    >
      {/* Өлгөөтэй гинжний эффект */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-0.5 h-24 bg-gradient-to-b from-[#c9a45c]/5 via-[#c9a45c]/40 to-[#c9a45c]/80 z-0" />
      
      <motion.div 
        style={{ filter: brightness }}
        whileHover={{ y: -20, rotate: 0, transition: { duration: 0.3 } }}
        className="relative p-2 rounded-xl bg-[#1f2d5a] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.6)] border border-[#1f2d5a]/80"
      >
        <div className="relative p-1 rounded-lg border-2 border-[#c9a45c]/60 overflow-hidden">
          <div 
            className="relative bg-white p-1 rounded-lg shadow-xl overflow-hidden"
            style={{ aspectRatio: `${aspectRatio}` }}
          >
            <Image
              src={memory.src}
              alt={memory.caption}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="400px"
              priority={index < 3}
            />
          </div>
          
          <div className="mt-3 text-center pb-2 px-3">
             <p className="text-[11px] font-bold text-[#f5d17a] uppercase tracking-[0.2em] truncate">
               {memory.author}
             </p>
             <p className="text-[10px] text-white/70 italic mt-1.5 leading-tight line-clamp-2 px-1">
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