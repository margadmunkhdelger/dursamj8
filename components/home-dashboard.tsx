"use client"

import { motion } from "framer-motion"
import { CountdownTimer } from "./countdown-timer"
import { Users, Image as ImageIcon, Clock, Award, MessageCircle, Plus, ArrowRight, MapPin, Pencil, Save } from "lucide-react"
import Image from "next/image"
import { TeacherMessageCard } from "./teacher-message-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface HomeDashboardProps {
  groupName: string
  graduationYear: number
  reunionDate: Date
  memberCount: number
  memoryCount: number
  onNavigate: (tab: string) => void
  teacherMessage: { name: string; message: string }
  onUpdateTeacherMessage: (message: string) => void
  isTeacher: boolean
  schoolName?: string
  reunionLocationDetails: ReunionLocationDetails | null; // New prop
  onUpdateReunionDetails: (details: ReunionLocationDetails) => void; // New prop
}

interface ReunionLocationDetails {
  name: string;
  address: string;
  mapsUrl: string;
  dateTime: string; // ISO string for datetime-local input
}

const recentActivities = [
  { id: 1, user: "Сарангуа", action: "шинэ дурсамж нэмлээ", time: "2ц өмнө", type: "photo" },
  { id: 2, user: "Мишээл", action: "цаг хугацааны капсулд захидал илгээлээ", time: "5ц өмнө", type: "capsule" },
  { id: 3, user: "Энхжин", action: "жагсаалтад дуу нэмлээ", time: "1ө өмнө", type: "music" },
]

const featuredMembers = [
  { id: "1", name: "Sarah", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80" },
  { id: "2", name: "Mike", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80" },
  { id: "3", name: "Emma", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80" },
  { id: "4", name: "Alex", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80" },
  { id: "5", name: "Jordan", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&q=80" },
]

export function HomeDashboard({
  groupName,
  graduationYear,
  reunionDate,
  memberCount,
  memoryCount,
  onNavigate,
  teacherMessage,
  onUpdateTeacherMessage,
  isTeacher,
  schoolName,
  reunionLocationDetails, // New prop
  onUpdateReunionDetails, // New prop
}: HomeDashboardProps) {
  const [editingLocation, setEditingLocation] = useState(false)
  const [locationInput, setLocationInput] = useState<ReunionLocationDetails>(
    reunionLocationDetails || { name: "", address: "", mapsUrl: "", dateTime: "" }
  );

  useEffect(() => {
    // Update local state if prop changes (e.g., after initial load or external update)
    if (reunionLocationDetails) {
      setLocationInput(reunionLocationDetails);
    }
  }, [reunionLocationDetails]);

  const handleSaveLocation = () => {
    onUpdateReunionDetails(locationInput);
    setEditingLocation(false);
  };

  // Format reunionDate for datetime-local input
  const formatDateTimeLocal = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  return (
    <div className="space-y-4 pb-4">
      {/* Hero Section with Countdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-2xl p-4 sm:p-6 text-center relative overflow-hidden border border-border shadow-lg"
      >
        {/* Decorative Background */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-primary blur-[80px]" />
          <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-accent blur-[60px]" />
        </div>

        <div className="relative z-10">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8 space-y-3"
          >
            {groupName && (
              <p className="text-[10px] uppercase tracking-[0.4em] text-[#c9a45c] font-bold">
                {groupName}
              </p>
            )}
            <h1 className="text-3xl sm:text-5xl font-script text-foreground leading-[1.1] px-2">
              {schoolName || "Шинэ Монгол Технологийн Коллеж"}
            </h1>
            <div className="flex items-center justify-center gap-3">
              <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent to-[#c9a45c] max-w-[60px]" />
              <p className="text-xs sm:text-sm font-sans font-bold text-[#1f2d5a] uppercase tracking-[0.2em] whitespace-nowrap lining-nums tabular-nums">
                {graduationYear} ОНЫ ТӨГСӨЛТ
              </p>
              <div className="h-0.5 flex-1 bg-gradient-to-l from-transparent to-[#c9a45c] max-w-[60px]" />
            </div>
          </motion.div>

          <CountdownTimer targetDate={reunionDate} />
        </div>
      </motion.div>

      {/* Reunion Location Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className={cn(
          "bg-card border rounded-2xl p-6 shadow-lg text-center relative overflow-hidden",
          !reunionLocationDetails && "border-dashed border-2 border-muted-foreground/30" // Dashed border for empty state
        )}
      >
        <div className="flex flex-col items-center justify-center gap-2 mb-2">
          <div className="bg-[#14213d] p-3 rounded-full text-[#f5d17a] shadow-sm mb-1">
            <MapPin className="w-6 h-6" />
          </div>
          <div className="flex items-center justify-center w-full relative">
            <h3 className="text-xl font-bold text-[#14213d] font-serif tracking-wide uppercase">Дахин уулзах газар</h3>
            {isTeacher && !editingLocation && ( // Only show edit button if not editing and is teacher
              <button
                onClick={() => {
                  setEditingLocation(true);
                  // Initialize form with current reunion details or empty
                  setLocationInput(reunionLocationDetails || {
                    name: "",
                    address: "",
                    mapsUrl: "",
                    dateTime: formatDateTimeLocal(reunionDate), // Use reunionDate prop for initial datetime
                  });
                }}
                className="absolute right-0 p-2 rounded-full bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
                title="Засах"
              >
                <Pencil className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="border-t border-border pt-4 mt-2">
          {isTeacher && editingLocation ? (
            <div className="space-y-3 text-left">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold ml-1">Байршлын нэр</label>
                <Input
                  value={locationInput.name}
                  onChange={(e) => setLocationInput(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Жишээ: Сургуулийн урд талбай"
                  className="bg-input border-border h-12 text-sm font-sans text-foreground placeholder:text-muted-foreground rounded-xl focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold ml-1">Хаяг</label>
                <Input
                  value={locationInput.address}
                  onChange={(e) => setLocationInput(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Жишээ: Сүхбаатарын талбай, Улаанбаатар"
                  className="bg-input border-border h-12 text-sm font-sans text-foreground placeholder:text-muted-foreground rounded-xl focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold ml-1">Google Maps Линк</label>
                <Input
                  value={locationInput.mapsUrl}
                  onChange={(e) => setLocationInput(prev => ({ ...prev, mapsUrl: e.target.value }))}
                  placeholder="https://maps.app.goo.gl/..."
                  className="bg-input border-border h-12 text-sm font-sans text-foreground placeholder:text-muted-foreground rounded-xl focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold ml-1">Огноо & Цаг</label>
                <Input
                  type="datetime-local"
                  value={locationInput.dateTime}
                  onChange={(e) => setLocationInput(prev => ({ ...prev, dateTime: e.target.value }))}
                  className="bg-input border-border h-12 text-sm font-sans text-foreground placeholder:text-muted-foreground rounded-xl focus:ring-primary/20"
                />
              </div>
              <Button onClick={handleSaveLocation} className="w-full h-12 bg-primary hover:bg-primary/90 font-bold rounded-xl shadow-lg shadow-primary/20">
                <Save className="w-4 h-4 mr-2" />
                Мэдээллийг хадгалах
              </Button>
            </div>
          ) : reunionLocationDetails ? (
            <div className="space-y-1">
              <p className="text-lg font-bold text-[#1f2d5a] uppercase tracking-wide font-sans">
                {reunionLocationDetails.name}
              </p>
              <p className="text-sm text-muted-foreground italic font-sans">
                {reunionLocationDetails.address}
              </p>
              <p className="text-xs text-muted-foreground font-sans mt-1">
                {new Date(reunionLocationDetails.dateTime).toLocaleDateString("mn-MN", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}
              </p>
              {reunionLocationDetails.mapsUrl && (
                <Button
                  onClick={() => window.open(reunionLocationDetails.mapsUrl, "_blank")}
                  className="mt-4 gap-2 h-10 px-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 font-bold text-sm rounded-full transition-all active:scale-95"
                >
                  <MapPin className="w-4 h-4" />
                  Google Maps-д нээх
                </Button>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic font-medium leading-relaxed">
              Багш уулзах газрын мэдээллийг удахгүй нэмнэ.
            </p>
          )}
        </div>
      </motion.div>

      {/* Teacher's Message Section */}
      <TeacherMessageCard
        teacherName={teacherMessage.name}
        message={teacherMessage.message}
        isTeacher={isTeacher}
        onUpdate={onUpdateTeacherMessage}
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: "Гишүүд", value: memberCount, icon: Users, tab: "members" },
          { label: "Дурсамж", value: memoryCount, icon: ImageIcon, tab: "gallery" },
          { label: "Капсул", value: 12, icon: Clock, tab: "capsule" },
          { label: "Батламж", value: 1, icon: Award, tab: "music" },
        ].map((stat, index) => (
          <motion.button
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate(stat.tab)}
            className="bg-card border border-border rounded-2xl p-4 text-left shadow-md hover:border-[#c9a45c] transition-all group relative overflow-hidden"
          >
            {/* Decorative background icon - Aligned straight and centered for a cleaner look */}
            <stat.icon className="absolute -right-2 top-1/2 -translate-y-1/2 w-16 h-16 text-[#1f2d5a] opacity-[0.05] group-hover:opacity-10 transition-opacity" />

            <div className="relative z-10">
              <div className="w-8 h-8 rounded-full bg-[#c9a45c]/10 flex items-center justify-center mb-3 group-hover:bg-[#c9a45c]/20 transition-colors border border-[#c9a45c]">
                <stat.icon className="w-4 h-4 text-[#1f2d5a]" />
              </div>
              {stat.value !== null && (
                <p className="text-2xl font-bold text-[#1f2d5a] leading-none font-mono tabular-nums">{stat.value}</p>
              )}
              <p className={cn("text-[10px] uppercase font-bold tracking-widest text-[#8a7a6a]/70 font-sans", stat.value !== null ? "mt-1" : "mt-2")}>{stat.label}</p>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Members Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card rounded-2xl p-4 border border-border shadow-md"
      >
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#c9a45c]/10 flex items-center justify-center border border-[#c9a45c]">
              <Users className="w-4 h-4 text-[#1f2d5a]" />
            </div>
            <h2 className="font-serif font-bold text-[#1f2d5a]">Манай Ангийнхан</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate("members")}
            className="text-[#c9a45c] hover:text-[#c9a45c]/80 hover:bg-[#c9a45c]/10 gap-1 font-bold text-xs uppercase tracking-tight"
          >
            Бүгдийг харах
            <ArrowRight className="w-3 h-3" />
          </Button>
        </div>
        <div className="flex -space-x-2">
          {featuredMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-background"
            >
              <Image
                src={member.avatar}
                alt={member.name}
                fill
                className="object-cover"
              />
            </motion.div>
          ))}
          {memberCount > 5 && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 }}
              className="w-10 h-10 rounded-full bg-primary/20 ring-2 ring-background flex items-center justify-center"
            >
              <span className="text-xs text-primary">+{memberCount - 5}</span>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-2">
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }} 
          onClick={() => onNavigate("gallery")}
          className="bg-card border border-border rounded-2xl p-4 flex flex-col items-center gap-3 hover:bg-muted transition-all shadow-md group"
        >
          <div className="w-10 h-10 rounded-full bg-[#c9a45c]/10 flex items-center justify-center border border-[#c9a45c] group-hover:scale-110 transition-transform">
            <Plus className="w-5 h-5 text-[#1f2d5a]" />
          </div>
          <span className="text-xs font-bold text-[#1f2d5a] uppercase tracking-wider font-sans">Дурсамж нэмэх</span>
        </motion.button>
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }} 
          onClick={() => onNavigate("capsule")}
          className="bg-card border border-border rounded-2xl p-4 flex flex-col items-center gap-3 hover:bg-muted transition-all shadow-md group"
        >
          <div className="w-10 h-10 rounded-full bg-[#c9a45c]/10 flex items-center justify-center border border-[#c9a45c] group-hover:scale-110 transition-transform">
            <MessageCircle className="w-5 h-5 text-[#1f2d5a]" />
          </div>
          <span className="text-xs font-bold text-[#1f2d5a] uppercase tracking-wider font-sans">Захидал бичих</span>
        </motion.button>
      </div>

      {/* Inspirational Quote */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center py-3"
      >
        <p className="text-xs text-muted-foreground italic">
          &ldquo;Дурсамж бүтээх хамгийн тохиромжтой үе бол одоо.&rdquo;
        </p>
      </motion.div>
    </div>
  )
}
