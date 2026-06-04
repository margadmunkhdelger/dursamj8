"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { FloatingParticles } from "@/components/floating-particles"
import { AuthForms } from "@/components/auth-forms"
import { AlbumFlow } from "@/components/album-flow"
import { MobileNav, TopNav } from "@/components/mobile-nav"
import { HomeDashboard } from "@/components/home-dashboard"
import { MemberGrid } from "@/components/member-card"
import { TimeCapsule } from "@/components/time-capsule"
import { MemoryGallery } from "@/components/memory-gallery"
import { MusicSection } from "@/components/music-section" // Removed MusicSection as it's not used
import { SongCertificate } from "@/components/song-certificate"
import { ProfilePicker, PendingMembers, CurrentUserBadge, type Member } from "@/components/profile-picker"

interface ReunionLocationDetails {
  name: string;
  address: string;
  mapsUrl: string;
  dateTime: string;
}

// Demo data
const demoGroup = {
  schoolName: "Шинэ Монгол Технологийн Коллеж", // Сургуулийн нэрийг нэмэв
  name: "Механик Инженер", // Ангийн нэрийг жишээ болгон өөрчлөв
  graduationYear: 2024,
  reunionDate: new Date("2034-05-28"),
  quote: "Дурсамж бүтээх хамгийн тохиромжтой үе бол одоо.",
  memberCount: 28,
  memoryCount: 156,
}

const initialMembers: Member[] = [
  {
    id: "teacher_1",
    name: "Д. Оюун",
    nickname: "oyunaa_bagsh",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80",
    tags: ["Ангийн багш", "Математик"],
    quote: "Хайрт шавь нар минь, дурсамжуудаа үргэлж нандигнаж яваарай.",
    dreamJob: "Багш",
    likes: 50,
    comments: [],
    voiceNotes: 0,
    photos: 5,
    status: "approved"
  },
  {
    id: "1",
    name: "А. Сарангуа",
    nickname: "saraa",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
    tags: ["Ангийн дарга", "Драмын дугуйлан", "Кофенд дуртай"],
    quote: "Уйтгартай дурсамж үлдээхэд амьдрал дэндүү богинохон",
    dreamJob: "Найруулагч",
    likes: 12,
    comments: [
      { id: "c1", author: "Б. Мишээл", text: "Хамгийн шилдэг ангийн дарга!", time: "2 өдрийн өмнө" }
    ],
    voiceNotes: 2,
    photos: 8,
    status: "approved"
  },
  {
    id: "2",
    name: "Б. Мишээл",
    nickname: "misheel",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    tags: ["Сагсан бөмбөгийн баг", "Техник сонирхогч", "Шөнийн шувуу"],
    quote: "Өдөр нь код бичиж, шөнө нь сагс тоглоно",
    dreamJob: "Тоглоом хөгжүүлэгч",
    likes: 18,
    comments: [
      { id: "c2", author: "А. Сарангуа", text: "Орой сууж код бичдэг байснаа санаж байна!", time: "1 өдрийн өмнө" }
    ],
    voiceNotes: 1,
    photos: 12,
    status: "approved"
  },
  {
    id: "3",
    name: "Г. Энхжин",
    nickname: "enhkjin",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
    tags: ["Урлагийн дугуйлан", "Мөрөөдөгч", "Мууранд хайртай"],
    quote: "Зургийн цаасан дээр шинэ ертөнцийг бүтээхүй",
    dreamJob: "Зураач",
    likes: 24,
    comments: [],
    voiceNotes: 0,
    photos: 15,
    status: "approved"
  },
  {
    id: "4",
    name: "Д. Алимаа",
    nickname: "alimaa",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
    tags: ["Мэтгэлцээний клуб", "Номын хорхойтон", "Гүн ухаан"],
    quote: "Үг гэдэг бидэнд байгаа хамгийн хүчтэй зэвсэг",
    dreamJob: "Зохиолч",
    likes: 9,
    comments: [
      { id: "c3", author: "Г. Энхжин", text: "Чиний илтгэлүүд үнэхээр домог байсан шүү!", time: "3 өдрийн өмнө" },
      { id: "c4", author: "Э. Жавхлан", text: "Одоо хүртэл чиний хэлсэн үгсийг санаж явдаг", time: "2 өдрийн өмнө" }
    ],
    voiceNotes: 3,
    photos: 5,
    status: "approved"
  },
  {
    id: "5",
    name: "Э. Жавхлан",
    nickname: "javkhlan",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&q=80",
    tags: ["Хөгжмийн хамтлаг", "Пянз цуглуулагч", "Аялагч"],
    quote: "Хөгжим бол амьдралын дууны дуулал",
    dreamJob: "Хөгжмийн продюсер",
    likes: 31,
    comments: [],
    voiceNotes: 5,
    photos: 20,
    status: "approved"
  },
]

type AppState = "auth" | "intro" | "profile-picker" | "dashboard"

export default function MemoriaApp() {
  const [appState, setAppState] = useState<AppState>("auth")
  const [activeTab, setActiveTab] = useState("home")
  const [members, setMembers] = useState<Member[]>(initialMembers)
  const [currentUser, setCurrentUser] = useState<Member | null>(null)
  const [userLikes, setUserLikes] = useState<Record<string, Set<string>>>({})
  const [reunionLocationDetails, setReunionLocationDetails] = useState<ReunionLocationDetails | null>({
    name: "Шинэ Монгол Технологийн Коллеж - Төв байр",
    address: "Улаанбаатар хот, Баянзүрх дүүрэг, 25-р хороо",
    mapsUrl: "https://maps.app.goo.gl/4jJzZ1rDk1mB1m1m1",
    dateTime: "2034-05-28T12:00"
  })
  const [reunionDate, setReunionDate] = useState(demoGroup.reunionDate)
  const [teacherMessage, setTeacherMessage] = useState({
    name: "Багш Д. Оюун",
    message: "Хайрт шавь нар минь, та бүхний ирээдүйн амьдралд аз жаргал, амжилт хүсье. Дурсамжуудаа үргэлж нандигнаж яваарай. Та нарыг үргэлж дэмжиж байх болно.",
  })

  const approvedMembers = members.filter(m => m.status === "approved")
  const pendingMembers = members.filter(m => m.status === "pending")

  const mainScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTop = 0;
    }
  }, [activeTab]);

  const handleMemberLike = (memberId: string) => {
    if (!currentUser) return
    setUserLikes(prev => {
      const currentLikes = new Set(prev[currentUser.id] || [])
      if (currentLikes.has(memberId)) {
        currentLikes.delete(memberId)
      } else {
        currentLikes.add(memberId)
      }
      return {
        ...prev,
        [currentUser.id]: currentLikes
      }
    })
  }

  const handleMemberComment = (memberId: string, commentText: string) => {
    if (!currentUser) return
    setMembers(prev => prev.map(m => {
      if (m.id === memberId) {
        return {
          ...m,
          comments: [...m.comments, {
            id: `c${Date.now()}`,
            author: currentUser.name,
            text: commentText,
            time: "Just now"
          }]
        }
      }
      return m
    }))
  }

  const handleUpdateMember = (memberId: string, updatedData: Partial<Member>) => {
    setMembers(prev => prev.map(m => 
      m.id === memberId ? { ...m, ...updatedData } : m
    ))
    // If current user is updated, update the local state as well
    if (currentUser?.id === memberId) {
      setCurrentUser(prev => prev ? { ...prev, ...updatedData } : null)
    }
  }

  const handleAuthSuccess = () => {
    setAppState("intro")
  }

  const handleSelectProfile = (member: Member) => {
    setCurrentUser(member)
    setAppState("dashboard")
  }

  const handleRequestJoin = (memberData: Omit<Member, "id" | "likes" | "comments" | "voiceNotes" | "photos" | "status">) => {
    const newMember: Member = {
      ...memberData,
      id: `m${Date.now()}`,
      likes: 0,
      comments: [],
      voiceNotes: 0,
      photos: 0,
      status: "pending"
    }
    setMembers(prev => [...prev, newMember])
  }

  const handleApproveMember = (memberId: string) => {
    setMembers(prev => prev.map(m => 
      m.id === memberId ? { ...m, status: "approved" as const } : m
    ))
  }

  const handleRejectMember = (memberId: string) => {
    setMembers(prev => prev.filter(m => m.id !== memberId))
  }

  const handleSwitchProfile = () => {
    setAppState("profile-picker")
  }

  const handleUpdateReunionDetails = useCallback((details: ReunionLocationDetails) => {
    setReunionLocationDetails(details)
    setReunionDate(new Date(details.dateTime))
  }, [])

  const renderDashboardContent = useCallback(() => {
    switch (activeTab) {
      case "home":
        return (
          <HomeDashboard
            groupName={demoGroup.name}
            graduationYear={demoGroup.graduationYear}
            reunionDate={demoGroup.reunionDate}
            memberCount={approvedMembers.length}
            memoryCount={demoGroup.memoryCount}
            onNavigate={setActiveTab}
            teacherMessage={teacherMessage}
            onUpdateTeacherMessage={(msg) => setTeacherMessage(prev => ({ ...prev, message: msg }))}
            isTeacher={currentUser?.id === "teacher_1"}
            reunionLocationDetails={reunionLocationDetails}
            onUpdateReunionDetails={handleUpdateReunionDetails}
          />
        )
      case "members":
        return (
          <div className="pb-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 relative overflow-hidden bg-[#1f2d5a] rounded-2xl p-6 shadow-xl border border-[#c9a45c]/30"
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
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#c9a45c] font-bold mb-2">
                  {demoGroup.schoolName}
                </p>
                <h2 className="text-xl sm:text-2xl font-serif font-black text-[#f8e4b3] leading-tight">
                  {demoGroup.name} ангийн багш болон төгсөгчид
                </h2>
                <div className="flex items-center justify-center gap-2 mt-3">
                  <div className="h-px w-8 bg-gradient-to-r from-transparent to-[#c9a45c]/50" />
                  <span className="text-[10px] text-[#c9a45c] font-bold uppercase tracking-widest">
                    Class of {demoGroup.graduationYear}
                  </span>
                  <div className="h-px w-8 bg-gradient-to-l from-transparent to-[#c9a45c]/50" />
                </div>
              </div>
            </motion.div>
            
            {/* Pending Members Approval */}
            {currentUser?.id === "teacher_1" && (
              <PendingMembers 
                pendingMembers={pendingMembers}
                currentUser={currentUser}
                onApprove={handleApproveMember}
                onReject={handleRejectMember}
              />
            )}

            <MemberGrid 
              members={approvedMembers} 
              likedMembers={userLikes[currentUser?.id || ""] || new Set()}
              onLike={handleMemberLike}
              onComment={handleMemberComment}
              onUpdate={handleUpdateMember}
              currentUser={currentUser}
            />
          </div>
        )
      case "capsule":
        return (
          <div className="pb-10">
            <TimeCapsule
              reunionDate={reunionDate}
              schoolName={demoGroup.schoolName}
              groupName={demoGroup.name}
              graduationYear={demoGroup.graduationYear}
              onWrite={(content, type) => {
                console.log("[v0] Time capsule written:", { content, type, author: currentUser?.name })
              }}
              reunionLocationDetails={reunionLocationDetails}
              currentUser={currentUser}
            />
          </div>
        )
      case "gallery":
        return (
          <MemoryGallery 
            currentUser={currentUser} 
            schoolName={demoGroup.schoolName}
            graduationYear={demoGroup.graduationYear}
          />
        )
      case "music":
        return (
          <SongCertificate 
            studentName={currentUser?.name || "Таны нэр"}
            schoolName={demoGroup.schoolName}
            className={demoGroup.name}
            graduationYear={demoGroup.graduationYear}
            isTeacher={currentUser?.id === "teacher_1"}
          />
        )
      default:
        return null
    }
  }, [
    activeTab,
    reunionLocationDetails,
    handleUpdateReunionDetails,
    currentUser,
    teacherMessage,
    reunionDate,
    approvedMembers,
    pendingMembers,
    userLikes,
    handleMemberLike,
    handleMemberComment,
    handleUpdateMember,
    handleApproveMember,
    handleRejectMember,
    setActiveTab,
    setTeacherMessage,
  ]);

  return (
    <div className="h-full w-full overflow-hidden flex flex-col relative bg-[#F5F0E8]">
      <AnimatePresence mode="wait">

        {/* Auth Page */}
        {appState === "auth" && (
          <motion.div
            key="auth"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="flex-1 w-full flex flex-col justify-center px-4 sm:px-6 py-12 relative overflow-hidden"
          >
            <FloatingParticles count={20} />
            
            <motion.div className="relative z-10 pointer-events-auto touch-manipulation w-full max-w-md mx-auto">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center mb-8"
              >
                <h1 className="text-6xl sm:text-7xl font-script text-[#0F1B3D] mb-2">Дурсамж</h1>
                <div className="flex items-center justify-center gap-3">
                  <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent to-[#C9A45C] max-w-[40px]" />
                  <p className="text-sm font-serif font-bold text-[#C9A45C] uppercase tracking-[0.2em]">
                    Тавтай морил
                  </p>
                  <div className="h-0.5 flex-1 bg-gradient-to-l from-transparent to-[#C9A45C] max-w-[40px]" />
                </div>
              </motion.div>

              <AuthForms onSuccess={handleAuthSuccess} />
            </motion.div>
          </motion.div>
        )}

        {/* Album: class cover → role picker (single flow) */}
        {(appState === "intro" || appState === "profile-picker") && (
          <AlbumFlow
            key={appState === "profile-picker" ? "profiles-only" : "full-flow"}
            schoolName={demoGroup.schoolName} // schoolName-ийг AlbumFlow руу дамжуулав
            initialStage={appState === "profile-picker" ? "profiles" : "cover"}
            groupName={demoGroup.name}
            graduationYear={demoGroup.graduationYear} // Use demoGroup.graduationYear
            reunionDate={demoGroup.reunionDate}
            quote={demoGroup.quote}
            members={approvedMembers}
            onSelectProfile={handleSelectProfile}
            onRequestJoin={handleRequestJoin}
          />
        )}

        {/* Main Dashboard */}
        {appState === "dashboard" && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex flex-col overflow-hidden w-full h-full"
          >
            <FloatingParticles count={15} />
            
            {/* Current User Badge */}
            {currentUser && (
              <CurrentUserBadge user={currentUser} onSwitch={handleSwitchProfile} />
            )}
            
            {/* Main scrollable area - Adjusted top padding to account for CurrentUserBadge */}
            <main ref={mainScrollRef} className="flex-1 overflow-y-auto overflow-x-hidden w-full outline-none touch-pan-y overscroll-contain pt-[calc(env(safe-area-inset-top,0px)+54px)] pb-[60px]">
              <div className="relative z-10 pt-2 px-4 max-w-md mx-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {renderDashboardContent()}
                  </motion.div>
                </AnimatePresence>
              </div>
            </main>

            <MobileNav activeTab={activeTab} onTabChange={setActiveTab} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
