"use client"

import { motion } from "framer-motion"
import { Home, Users, Mail, Image, Award, Bell, Palette, Lock, HelpCircle, LogOut, X } from "lucide-react"
import { useState } from "react"

interface MobileNavProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const tabs = [
  { id: "home", icon: Home, label: "Нүүр" },
  { id: "members", icon: Users, label: "Бид" },
  { id: "capsule", icon: Mail, label: "Захидал" },
  { id: "gallery", icon: Image, label: "Зураг" },
  { id: "music", icon: Award, label: "Батламж" },
]

export function MobileNav({ activeTab, onTabChange }: MobileNavProps) {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-[100] touch-none overscroll-none select-none"
      style={{
        paddingTop: "env(safe-area-inset-top, 8px)",
        background: "linear-gradient(to bottom, rgba(246,241,235,0.98) 60%, rgba(246,241,235,0.85) 100%)",
        WebkitBackdropFilter: "blur(20px) saturate(1.4)",
        backdropFilter: "blur(20px) saturate(1.4)",
        borderBottom: "1px solid rgba(201,164,92,0.2)",
      }}
    >
      <div className="mx-auto max-w-md px-2 pt-0.5 pb-1.5">
        <div className="flex items-center justify-between">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className="relative flex flex-col items-center gap-0.5 py-1.5 px-2 sm:px-3 rounded-xl transition-all flex-1 min-w-0 active:scale-95"
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-xl"
                    style={{ 
                      background: "rgba(201, 164, 92, 0.12)", 
                      border: "1px solid #c9a45c" 
                    }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <tab.icon
                  className="w-5 h-5 relative z-10 transition-colors flex-shrink-0 text-[#1f2d5a]"
                />
                <span
                  className="text-[9px] sm:text-[10px] relative z-10 transition-colors truncate font-sans font-semibold text-[#1f2d5a]"
                >
                  {tab.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const settingsItems = [
    { icon: Bell, label: "Мэдэгдэл", description: "Анхааруулга тохируулах" },
    { icon: Palette, label: "Харагдац", description: "Загвар болон өнгө" },
    { icon: Lock, label: "Нууцлал", description: "Агуулга харах эрх" },
    { icon: HelpCircle, label: "Тусламж", description: "Дэмжлэг авах" },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="settings-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] bg-black/80 flex items-end sm:items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            onClick={(e) => e.stopPropagation()} 
            className="w-full max-w-md bg-card rounded-2xl overflow-hidden border border-border shadow-lg"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground font-serif">Тохиргоо</h3>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted text-muted-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Settings List */}
            <div className="p-2">
              {settingsItems.map((item, index) => (
                <motion.button
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-muted transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 font-sans">
                    <p className="text-sm font-semibold text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Logout */}
            <div className="p-4 border-t border-border">
              <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Системээс гарах</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function TopNav({ groupName, onSettings }: { groupName: string; onSettings?: () => void }) {
  const [showSettings, setShowSettings] = useState(false)

  const handleSettingsClick = () => {
    if (onSettings) {
      onSettings()
    } else {
      setShowSettings(true)
    }
  }

  return (
    <>
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="fixed top-0 left-0 right-0 z-[90] px-4 pt-[max(1rem,env(safe-area-inset-top))] bg-gradient-to-b from-background/95 via-background/80 to-transparent pb-4 touch-none overscroll-none"
        style={{
          WebkitBackdropFilter: "blur(16px)",
          backdropFilter: "blur(16px)",
        }}
      >
        <div className="bg-card rounded-2xl mx-auto max-w-md px-4 py-2.5 flex items-center justify-between border border-border shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary text-sm font-bold font-serif">M</span>
            </div>
            <span className="font-medium text-sm">{groupName}</span>
          </div>
        </div>
      </motion.header>

      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </>
  )
}
