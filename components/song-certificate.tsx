"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useRef } from "react"
import { Pencil, Save, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface SongCertificateProps {
  studentName: string
  schoolName: string
  className: string
  graduationYear: number
  isTeacher?: boolean
}

export function SongCertificate({
  studentName,
  schoolName,
  className,
  graduationYear,
  isTeacher = false,
}: SongCertificateProps) {
  const [editMode, setEditMode] = useState(false)
  const [editSchool, setEditSchool] = useState(schoolName)
  const [editClass, setEditClass] = useState(className)
  const [editYear, setEditYear] = useState(String(graduationYear))
  const [certText, setCertText] = useState(
    `Энэхүү дурсамжийн хайрцаг нь ${schoolName} сургуулийн ${className} ангийн сурагчдын хамтдаа бүтээсэн хамгийн нандин мөчүүд, захиа, зураг, бичлэгийг хадгалж буйг батламжлав.`
  )
  const [logoSrc, setLogoSrc] = useState<string | null>(null)
  const [saved, setSaved] = useState({ school: schoolName, cls: className, year: graduationYear, text: certText })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setLogoSrc(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    const updatedText = certText
      .replace(schoolName, editSchool)
      .replace(className, editClass)
    setSaved({ school: editSchool, cls: editClass, year: Number(editYear), text: updatedText })
    setCertText(updatedText)
    setEditMode(false)
  }
  return (
    <div className="fixed inset-0 bg-[#f6f1eb]">
      <div 
        className="absolute inset-0 opacity-[0.4] mix-blend-multiply pointer-events-none"
        style={{
          backgroundImage: `url("https://www.transparenttextures.com/patterns/pinstriped-suit.png"), radial-gradient(circle at center, transparent 0%, rgba(180,140,100,0.1) 100%)`,
        }}
      />

      {/* Teacher edit panel - slides in from right */}
      <AnimatePresence>
        {isTeacher && editMode && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute right-0 top-0 bottom-0 w-72 z-30 bg-card border-l border-border shadow-2xl flex flex-col overflow-y-auto"
          >
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-serif font-bold text-foreground text-sm">Батламж засварлах</h3>
              <button onClick={() => setEditMode(false)} className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-muted text-muted-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 space-y-4 flex-1">
              {/* Logo upload */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide font-sans">Сургуулийн лого</label>
                <input type="file" ref={fileInputRef} onChange={handleLogoUpload} accept="image/*" className="hidden" />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-2 w-full h-20 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-primary/40 transition-colors bg-muted/30"
                >
                  {logoSrc ? (
                    <div className="relative w-14 h-14">
                      <Image src={logoSrc} alt="Logo" fill className="object-contain rounded" />
                    </div>
                  ) : (
                    <>
                      <Upload className="w-5 h-5 text-muted-foreground mb-1" />
                      <span className="text-xs text-muted-foreground font-sans">Лого оруулах</span>
                    </>
                  )}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide font-sans">Сургуулийн нэр</label>
                <Input value={editSchool} onChange={(e) => setEditSchool(e.target.value)} className="mt-1 h-9 bg-input border-border text-sm font-sans text-foreground" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide font-sans">Анги / бүлэг</label>
                <Input value={editClass} onChange={(e) => setEditClass(e.target.value)} className="mt-1 h-9 bg-input border-border text-sm font-sans text-foreground" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide font-sans">Төгсөх он</label>
                <Input value={editYear} onChange={(e) => setEditYear(e.target.value)} type="number" className="mt-1 h-9 bg-input border-border text-sm font-sans text-foreground" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide font-sans">Батламжийн текст</label>
                <Textarea value={certText} onChange={(e) => setCertText(e.target.value)} className="mt-1 bg-input border-border text-sm font-serif min-h-[100px] resize-none text-foreground" />
              </div>
              <Button onClick={handleSave} className="w-full h-10 font-bold font-sans text-sm">
                <Save className="w-4 h-4 mr-2" />
                Хадгалах
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute inset-0 flex items-center justify-center px-4 pt-20 pb-24">
        {/* Teacher edit button */}
        {isTeacher && !editMode && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => setEditMode(true)}
            className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-card border border-border shadow-sm text-xs font-semibold font-sans text-foreground hover:bg-muted transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" />
            Засварлах
          </motion.button>
        )}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative w-full max-w-[min(420px,95vw)] bg-white rounded-lg overflow-hidden"
          style={{
            boxShadow: "0 8px 32px rgba(31,45,90,0.15), 0 24px 60px rgba(0,0,0,0.12)",
            maxHeight: "min(650px, 85vh)",
            aspectRatio: "3/4",
          }}
        >
          {/* ===== LUXURIOUS CORNER ORNAMENTS - Navy Blue & Gold ===== */}

          {/* Top Left Corner Ornament */}
          <div className="absolute top-0 left-0 w-36 h-36 z-20">
            <svg className="w-full h-full" viewBox="0 0 120 120">
              <defs>
                <linearGradient id="tlNavy" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1f2d5a" />
                  <stop offset="50%" stopColor="#2a4178" />
                  <stop offset="100%" stopColor="#1f2d5a" />
                </linearGradient>
                <linearGradient id="tlGold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffd700" />
                  <stop offset="25%" stopColor="#f4d03f" />
                  <stop offset="50%" stopColor="#ffec8b" />
                  <stop offset="75%" stopColor="#c9a45c" />
                  <stop offset="100%" stopColor="#daa520" />
                </linearGradient>
              </defs>
              {/* Navy corner shape */}
              <path d="M 0,0 L 90,0 Q 50,10 35,35 Q 10,50 0,90 Z" fill="url(#tlNavy)" />
              {/* Gold inner border - shimmer */}
              <path d="M 0,0 L 70,0 Q 40,8 28,28 Q 8,40 0,70 Z" fill="none" stroke="url(#tlGold)" strokeWidth="2.5" />
              {/* Gold decorative curves */}
              <path d="M 5,50 Q 20,30 50,5" fill="none" stroke="url(#tlGold)" strokeWidth="2" opacity="0.9" />
              <path d="M 10,35 Q 20,22 35,10" fill="none" stroke="url(#tlGold)" strokeWidth="1.5" opacity="0.7" />
              {/* Gold dots/stars - brighter */}
              <circle cx="20" cy="20" r="3" fill="#ffd700" />
              <circle cx="35" cy="12" r="2" fill="#ffec8b" opacity="0.9" />
              <circle cx="12" cy="35" r="2" fill="#ffec8b" opacity="0.9" />
              {/* Decorative flourish */}
              <path d="M 8,8 Q 15,12 12,20 Q 18,15 25,12 Q 18,18 15,25" fill="none" stroke="#ffd700" strokeWidth="1" opacity="0.6" />
            </svg>
            {/* Shimmer overlay */}
            <motion.div 
              className="absolute inset-0 opacity-30"
              style={{
                background: "linear-gradient(135deg, transparent 40%, rgba(255,236,139,0.4) 50%, transparent 60%)",
              }}
              animate={{ 
                backgroundPosition: ["0% 0%", "200% 200%"],
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "linear" 
              }}
            />
          </div>

          {/* Top Right Corner Ornament */}
          <div className="absolute top-0 right-0 w-36 h-36 z-20">
            <svg className="w-full h-full" viewBox="0 0 120 120">
              <defs>
                <linearGradient id="trNavy" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#1f2d5a" />
                  <stop offset="50%" stopColor="#2a4178" />
                  <stop offset="100%" stopColor="#1f2d5a" />
                </linearGradient>
                <linearGradient id="trGold" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ffd700" />
                  <stop offset="25%" stopColor="#f4d03f" />
                  <stop offset="50%" stopColor="#ffec8b" />
                  <stop offset="75%" stopColor="#c9a45c" />
                  <stop offset="100%" stopColor="#daa520" />
                </linearGradient>
              </defs>
              <path d="M 120,0 L 30,0 Q 70,10 85,35 Q 110,50 120,90 Z" fill="url(#trNavy)" />
              <path d="M 120,0 L 50,0 Q 80,8 92,28 Q 112,40 120,70 Z" fill="none" stroke="url(#trGold)" strokeWidth="2.5" />
              <path d="M 115,50 Q 100,30 70,5" fill="none" stroke="url(#trGold)" strokeWidth="2" opacity="0.9" />
              <path d="M 110,35 Q 100,22 85,10" fill="none" stroke="url(#trGold)" strokeWidth="1.5" opacity="0.7" />
              <circle cx="100" cy="20" r="3" fill="#ffd700" />
              <circle cx="85" cy="12" r="2" fill="#ffec8b" opacity="0.9" />
              <circle cx="108" cy="35" r="2" fill="#ffec8b" opacity="0.9" />
              <path d="M 112,8 Q 105,12 108,20 Q 102,15 95,12 Q 102,18 105,25" fill="none" stroke="#ffd700" strokeWidth="1" opacity="0.6" />
            </svg>
            <motion.div 
              className="absolute inset-0 opacity-30"
              style={{
                background: "linear-gradient(-135deg, transparent 40%, rgba(255,236,139,0.4) 50%, transparent 60%)",
              }}
              animate={{ 
                backgroundPosition: ["0% 0%", "200% 200%"],
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "linear",
                delay: 0.5 
              }}
            />
          </div>

          {/* Bottom Left Corner Ornament */}
          <div className="absolute bottom-0 left-0 w-36 h-36 z-20">
            <svg className="w-full h-full" viewBox="0 0 120 120">
              <defs>
                <linearGradient id="blNavy" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#1f2d5a" />
                  <stop offset="50%" stopColor="#2a4178" />
                  <stop offset="100%" stopColor="#1f2d5a" />
                </linearGradient>
                <linearGradient id="blGold" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ffd700" />
                  <stop offset="25%" stopColor="#f4d03f" />
                  <stop offset="50%" stopColor="#ffec8b" />
                  <stop offset="75%" stopColor="#c9a45c" />
                  <stop offset="100%" stopColor="#daa520" />
                </linearGradient>
              </defs>
              <path d="M 0,120 L 90,120 Q 50,110 35,85 Q 10,70 0,30 Z" fill="url(#blNavy)" />
              <path d="M 0,120 L 70,120 Q 40,112 28,92 Q 8,80 0,50 Z" fill="none" stroke="url(#blGold)" strokeWidth="2.5" />
              <path d="M 5,70 Q 20,90 50,115" fill="none" stroke="url(#blGold)" strokeWidth="2" opacity="0.9" />
              <path d="M 10,85 Q 20,98 35,110" fill="none" stroke="url(#blGold)" strokeWidth="1.5" opacity="0.7" />
              <circle cx="20" cy="100" r="3" fill="#ffd700" />
              <circle cx="35" cy="108" r="2" fill="#ffec8b" opacity="0.9" />
              <circle cx="12" cy="85" r="2" fill="#ffec8b" opacity="0.9" />
              <path d="M 8,112 Q 15,108 12,100 Q 18,105 25,108 Q 18,102 15,95" fill="none" stroke="#ffd700" strokeWidth="1" opacity="0.6" />
            </svg>
            <motion.div 
              className="absolute inset-0 opacity-30"
              style={{
                background: "linear-gradient(45deg, transparent 40%, rgba(255,236,139,0.4) 50%, transparent 60%)",
              }}
              animate={{ 
                backgroundPosition: ["0% 0%", "200% 200%"],
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "linear",
                delay: 1 
              }}
            />
          </div>

          {/* Bottom Right Corner Ornament */}
          <div className="absolute bottom-0 right-0 w-36 h-36 z-20">
            <svg className="w-full h-full" viewBox="0 0 120 120">
              <defs>
                <linearGradient id="brNavy" x1="100%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#1f2d5a" />
                  <stop offset="50%" stopColor="#2a4178" />
                  <stop offset="100%" stopColor="#1f2d5a" />
                </linearGradient>
                <linearGradient id="brGold" x1="100%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#ffd700" />
                  <stop offset="25%" stopColor="#f4d03f" />
                  <stop offset="50%" stopColor="#ffec8b" />
                  <stop offset="75%" stopColor="#c9a45c" />
                  <stop offset="100%" stopColor="#daa520" />
                </linearGradient>
              </defs>
              <path d="M 120,120 L 30,120 Q 70,110 85,85 Q 110,70 120,30 Z" fill="url(#brNavy)" />
              <path d="M 120,120 L 50,120 Q 80,112 92,92 Q 112,80 120,50 Z" fill="none" stroke="url(#brGold)" strokeWidth="2.5" />
              <path d="M 115,70 Q 100,90 70,115" fill="none" stroke="url(#brGold)" strokeWidth="2" opacity="0.9" />
              <path d="M 110,85 Q 100,98 85,110" fill="none" stroke="url(#brGold)" strokeWidth="1.5" opacity="0.7" />
              <circle cx="100" cy="100" r="3" fill="#ffd700" />
              <circle cx="85" cy="108" r="2" fill="#ffec8b" opacity="0.9" />
              <circle cx="108" cy="85" r="2" fill="#ffec8b" opacity="0.9" />
              <path d="M 112,112 Q 105,108 108,100 Q 102,105 95,108 Q 102,102 105,95" fill="none" stroke="#ffd700" strokeWidth="1" opacity="0.6" />
            </svg>
            <motion.div 
              className="absolute inset-0 opacity-30"
              style={{
                background: "linear-gradient(-45deg, transparent 40%, rgba(255,236,139,0.4) 50%, transparent 60%)",
              }}
              animate={{ 
                backgroundPosition: ["0% 0%", "200% 200%"],
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "linear",
                delay: 1.5 
              }}
            />
          </div>

          {/* ===== ELEGANT BORDER FRAMES ===== */}
          {/* Outer gold border */}
          <div className="absolute inset-2 border-2 border-[#c9a45c]/60 rounded-lg pointer-events-none z-10" />
          {/* Inner decorative frame with pattern */}
          <div className="absolute inset-3 border border-[#1f2d5a]/20 rounded pointer-events-none z-10" />
          {/* Gold accent line */}
          <div className="absolute inset-4 border border-[#c9a45c]/30 rounded pointer-events-none z-10" />

          {/* ===== CERTIFICATE CONTENT ===== */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full px-8 py-12 text-center overflow-hidden">

            {/* Gold Medal Badge - Elegant and prominent */}
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, duration: 0.8, type: "spring", stiffness: 80 }}
              className="relative mb-4 scale-90 sm:scale-100"
            >
              {/* Laurel Wreath - More elegant */}
              <svg width="140" height="110" viewBox="0 0 140 110" className="absolute -top-4 left-1/2 -translate-x-1/2 overflow-visible scale-75">
                <defs>
                  <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f4d03f" />
                    <stop offset="30%" stopColor="#e8c98c" />
                    <stop offset="70%" stopColor="#c9a45c" />
                    <stop offset="100%" stopColor="#a67c32" />
                  </linearGradient>
                </defs>
                <g fill="url(#goldGrad)">
                  {/* Left branch - more leaves */}
                  <ellipse cx="28" cy="82" rx="8" ry="14" transform="rotate(-45 28 82)" />
                  <ellipse cx="18" cy="64" rx="7" ry="13" transform="rotate(-30 18 64)" />
                  <ellipse cx="14" cy="46" rx="6.5" ry="12" transform="rotate(-12 14 46)" />
                  <ellipse cx="16" cy="30" rx="6" ry="11" transform="rotate(8 16 30)" />
                  <ellipse cx="24" cy="16" rx="5.5" ry="10" transform="rotate(28 24 16)" />
                  <ellipse cx="36" cy="6" rx="5" ry="9" transform="rotate(45 36 6)" />
                  {/* Right branch - more leaves */}
                  <ellipse cx="112" cy="82" rx="8" ry="14" transform="rotate(45 112 82)" />
                  <ellipse cx="122" cy="64" rx="7" ry="13" transform="rotate(30 122 64)" />
                  <ellipse cx="126" cy="46" rx="6.5" ry="12" transform="rotate(12 126 46)" />
                  <ellipse cx="124" cy="30" rx="6" ry="11" transform="rotate(-8 124 30)" />
                  <ellipse cx="116" cy="16" rx="5.5" ry="10" transform="rotate(-28 116 16)" />
                  <ellipse cx="104" cy="6" rx="5" ry="9" transform="rotate(-45 104 6)" />
                </g>
              </svg>

              {/* Medal - Premium design */}
              <div
                className="relative w-20 h-20 rounded-full flex items-center justify-center"
                style={{
                  background: "conic-gradient(from 0deg, #f4d03f, #e8c98c, #c9a45c, #8b6914, #c9a45c, #e8c98c, #f4d03f, #c9a45c, #8b6914, #c9a45c, #f4d03f)",
                  padding: "6px",
                  boxShadow: "0 12px 40px rgba(201,164,92,0.5), 0 6px 12px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.3)",
                }}
              >
                <div
                  className="w-full h-full rounded-full flex flex-col items-center justify-center"
                  style={{
                    background: "radial-gradient(circle at 30% 25%, #3d5a96, #2a4178 50%, #1f2d5a 80%, #152040)",
                    boxShadow: "inset 0 -4px 12px rgba(0,0,0,0.3), inset 0 4px 8px rgba(255,255,255,0.1)",
                  }}
                >
                  <span className="text-[#f4d03f] text-[8px] tracking-[0.15em]">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
                  <span className="text-white text-[10px] sm:text-xs font-bold tracking-[0.1em] mt-0.5">ТӨГСӨГЧ</span>
                  <span className="text-[#f4d03f] text-[9px] tracking-[0.15em] mt-0.5">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
                </div>
              </div>

              {/* Ribbon tails - More elegant */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-1">
                <motion.div
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                  className="w-5 h-8 origin-top"
                  style={{
                    background: "linear-gradient(180deg, #1f2d5a 0%, #2a4178 40%, #152040 100%)",
                    clipPath: "polygon(8% 0%, 92% 0%, 100% 100%, 50% 70%, 0% 100%)",
                    transform: "rotate(-15deg)",
                    boxShadow: "2px 2px 4px rgba(0,0,0,0.2)",
                  }}
                />
                <motion.div
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: 0.7, duration: 0.4 }}
                  className="w-5 h-8 origin-top"
                  style={{
                    background: "linear-gradient(180deg, #2a4178 0%, #3d5a96 40%, #1f2d5a 100%)",
                    clipPath: "polygon(8% 0%, 92% 0%, 100% 100%, 50% 70%, 0% 100%)",
                    transform: "rotate(15deg)",
                    boxShadow: "-2px 2px 4px rgba(0,0,0,0.2)",
                  }}
                />
              </div>
            </motion.div>

            {/* Certificate Title - Mongolian */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mt-4"
            >
              {/* Logo if uploaded */}
              {logoSrc && (
                <div className="relative w-12 h-12 mx-auto mb-3">
                  <Image src={logoSrc} alt="School logo" fill className="object-contain" />
                </div>
              )}
              <h1
                className="font-script text-3xl sm:text-4xl text-[#1f2d5a] tracking-wide"
                style={{ textShadow: "2px 2px 8px rgba(31,45,90,0.15)" }}
              >
                Батламж
              </h1>
              <div className="flex items-center justify-center gap-2 mt-1">
                <div className="w-12 h-px bg-gradient-to-r from-transparent via-[#c9a45c] to-[#c9a45c]" />
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#1f2d5a] font-semibold whitespace-nowrap mt-1">
                  Дурсамжийн хайрцаг
                </span>
                <div className="w-12 h-px bg-gradient-to-l from-transparent via-[#c9a45c] to-[#c9a45c]" />
              </div>
            </motion.div>

            {/* Presented To */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65 }}
              className="text-[11px] uppercase tracking-[0.2em] text-[#7a7a8a] mt-6 font-medium font-sans"
            >
              Гардуулах хүн
            </motion.p>

            {/* Student Name */}
            <motion.h2
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.75, type: "spring", stiffness: 80 }}
              className="font-serif text-2xl sm:text-3xl text-[#1f2d5a] mt-2 mb-2 px-2 font-bold break-words w-full max-w-[92%] leading-tight"
              style={{ textShadow: "1px 1px 4px rgba(31,45,90,0.1)" }}
            >
              {studentName}
            </motion.h2>

            {/* Gold Divider */}
            <motion.div 
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.85, duration: 0.5 }}
              className="w-32 h-0.5 bg-gradient-to-r from-transparent via-[#c9a45c] to-transparent mb-2"
            />

            {/* Description - editable by teacher */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.95 }}
              className="text-xs sm:text-sm text-[#4a4a5a] leading-normal max-w-[340px] font-serif px-2 mt-4"
            >
              {saved.text}
            </motion.p>

            {/* Year Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.05 }}
              className="mt-6"
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1f2d5a]/5 border border-[#c9a45c]/30">
                <span className="text-[#c9a45c] text-xs">&#9733;</span>
                <span className="text-sm sm:text-base font-semibold text-[#1f2d5a] tracking-wider">{graduationYear}</span>
                <span className="text-[#c9a45c] text-xs">&#9733;</span>
              </div>
            </motion.div>

            {/* Signature Section */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="mt-auto pt-4 flex flex-col items-center"
            >
              <div className="w-32 h-px bg-gradient-to-r from-transparent via-[#1f2d5a]/30 to-transparent mb-1" />
              <p className="text-[8px] uppercase tracking-[0.2em] text-[#9a9aaa] font-medium">
                Төгсөлт
              </p>
            </motion.div>
          </div>

          {/* Subtle paper texture */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-multiply"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />
        </motion.div>
      </div>
    </div>
  )
}
