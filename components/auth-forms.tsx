"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Sparkles, KeyRound, ArrowRight, Copy, Check, AlertCircle } from "lucide-react"
import { buildGroupIdentity, parseAccessCode, saveGroupIdentity } from "@/lib/group-identity"

interface AuthFormsProps {
  onSuccess: () => void
}

type AuthMode = "login" | "signup"
type InstitutionType = "ЕБС" | "Их сургууль" | "Коллеж"

// In production, promo code validation must be done on the backend.
const VALID_PROMO_CODES = ["DURSAMJ2024", "MEMORIA", "TOSGOGT2025"]

function buildAccessCode(school: string, year: string, className: string): string {
  const schoolPart = school.trim().toUpperCase().replace(/[^A-Z0-9А-ЯӨҮа-яөү]/g, "").replace(/[а-яөүА-ЯӨҮ]/g, "")
  const yearPart = year.trim().replace(/\D/g, "")
  const classPart = className.trim().toUpperCase().replace(/[^A-Z0-9]/g, "")
  if (!schoolPart || !yearPart || !classPart) return ""
  return `${schoolPart}${yearPart}${classPart}`
}

export function AuthForms({ onSuccess }: AuthFormsProps) {
  const [mode, setMode] = useState<AuthMode>("login")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [schoolCode, setSchoolCode] = useState("")
  const [graduationYear, setGraduationYear] = useState("")
  const [className, setClassName] = useState("")
  const [copied, setCopied] = useState(false)
  const [institutionType, setInstitutionType] = useState<InstitutionType>("ЕБС")
  const [promoCode, setPromoCode] = useState("")
  const [promoError, setPromoError] = useState(false)
  const [promoValid, setPromoValid] = useState(false)

  // Extra fields for Их сургууль / Коллеж
  const [faculty, setFaculty] = useState("")
  const [major, setMajor] = useState("")
  const [grade, setGrade] = useState("")

  const accessCode = useMemo(
    () => buildAccessCode(schoolCode, graduationYear, className),
    [schoolCode, graduationYear, className]
  )

  const handleCopyCode = async () => {
    if (!accessCode) return
    await navigator.clipboard.writeText(accessCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePromoCheck = () => {
    if (VALID_PROMO_CODES.includes(promoCode.trim().toUpperCase())) {
      setPromoValid(true)
      setPromoError(false)
    } else {
      setPromoError(true)
      setPromoValid(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (mode === "signup" && !accessCode) return
    if (mode === "signup" && !promoValid) return
    setIsLoading(true)
    if (mode === "signup" && accessCode) {
      const identity = buildGroupIdentity(schoolCode, graduationYear, className)
      if (identity) saveGroupIdentity(identity)
      localStorage.setItem("memoria-group-access-code", accessCode)
    }
    if (mode === "login") {
      const input = document.getElementById("group-code") as HTMLInputElement | null
      const code = input?.value?.trim() ?? ""
      const parsed = parseAccessCode(code)
      if (parsed) saveGroupIdentity(parsed)
    }
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsLoading(false)
    onSuccess()
  }

  const formVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  }

  return (
    <motion.div className="w-full max-w-md mx-auto pointer-events-auto touch-manipulation">
      {/* Mode Selector */}
      <div className="flex gap-2 mb-6 p-1.5 bg-[#fcfaf2] border border-amber-900/10 rounded-2xl shadow-sm">
        {[
          { id: "login" as AuthMode, label: "Нэвтрэх", icon: KeyRound },
          { id: "signup" as AuthMode, label: "Үүсгэх", icon: Sparkles },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setMode(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all font-sans ${
              mode === tab.id
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.form
          key={mode}
          variants={formVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.25 }}
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          {mode === "login" && (
            <>
              <div className="space-y-1.5">
                <Label htmlFor="group-code" className="text-sm font-semibold text-foreground font-sans">
                  Группийн хандах код
                </Label>
                <Input
                  id="group-code"
                  type="text"
                  placeholder="Жишээ: NMCT202512A"
                  className="bg-input border-border h-12 text-foreground placeholder:text-muted-foreground uppercase font-mono text-base tracking-wide"
                  required
                />
                <p className="text-xs text-muted-foreground font-sans">
                  Сургууль + төгсөх он + анги (Жишээ: NMCT202512A)
                </p>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-sm font-semibold text-foreground font-sans">
                  Нууц үг
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Нууц үгээ оруулна уу"
                    className="bg-input border-border h-12 pr-12 text-foreground placeholder:text-muted-foreground font-sans"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </>
          )}

          {mode === "signup" && (
            <>
              {/* Institution type selector */}
              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-foreground font-sans">Байгууллагын төрөл</Label>
                <div className="grid grid-cols-3 gap-2">
                  {(["ЕБС", "Их сургууль", "Коллеж"] as InstitutionType[]).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setInstitutionType(type)}
                      className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all border font-sans ${
                        institutionType === type
                          ? "bg-primary text-primary-foreground border-primary shadow-sm"
                          : "bg-muted border-border text-muted-foreground hover:border-primary/30"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* ЕБС fields */}
              {institutionType === "ЕБС" && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <div className="space-y-1.5">
                    <Label htmlFor="school-name-ebs" className="text-xs font-semibold text-muted-foreground uppercase tracking-wide font-sans">Сургуулийн нэр</Label>
                    <Input id="school-name-ebs" value={schoolCode} onChange={(e) => setSchoolCode(e.target.value)} placeholder="Жишээ: NMCT" className="bg-input border-border h-11 font-sans text-foreground placeholder:text-muted-foreground" required />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide font-sans">Анги</Label>
                      <Input value={className} onChange={(e) => setClassName(e.target.value)} placeholder="12A" className="bg-input border-border h-11 font-sans text-foreground placeholder:text-muted-foreground" required />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide font-sans">Төгсөх он</Label>
                      <Input type="number" value={graduationYear} onChange={(e) => setGraduationYear(e.target.value)} placeholder="2025" min="2020" max="2035" className="bg-input border-border h-11 font-sans text-foreground placeholder:text-muted-foreground" required />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide font-sans">Группийн нэр</Label>
                    <Input placeholder="2024 оны төгсөлт" className="bg-input border-border h-11 font-sans text-foreground placeholder:text-muted-foreground" />
                  </div>
                </motion.div>
              )}

              {/* Их сургууль fields */}
              {institutionType === "Их сургууль" && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide font-sans">Их сургуулийн нэр</Label>
                    <Input value={schoolCode} onChange={(e) => setSchoolCode(e.target.value)} placeholder="Жишээ: МУИС, ШУТИС" className="bg-input border-border h-11 font-sans text-foreground placeholder:text-muted-foreground" required />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide font-sans">Салбар сургууль / факультет</Label>
                    <Input value={faculty} onChange={(e) => setFaculty(e.target.value)} placeholder="Мэдээлэл технологийн сургууль" className="bg-input border-border h-11 font-sans text-foreground placeholder:text-muted-foreground" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide font-sans">Хөтөлбөр / мэргэжил</Label>
                      <Input value={major} onChange={(e) => setMajor(e.target.value)} placeholder="Программ хангамж" className="bg-input border-border h-11 font-sans text-foreground placeholder:text-muted-foreground" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide font-sans">Курс / бүлэг</Label>
                      <Input value={className} onChange={(e) => setClassName(e.target.value)} placeholder="4-р курс Б бүлэг" className="bg-input border-border h-11 font-sans text-foreground placeholder:text-muted-foreground" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide font-sans">Төгсөх он</Label>
                      <Input type="number" value={graduationYear} onChange={(e) => setGraduationYear(e.target.value)} placeholder="2025" min="2020" max="2035" className="bg-input border-border h-11 font-sans text-foreground placeholder:text-muted-foreground" required />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide font-sans">Группийн нэр</Label>
                      <Input value={grade} onChange={(e) => setGrade(e.target.value)} placeholder="2025 төгсөгчид" className="bg-input border-border h-11 font-sans text-foreground placeholder:text-muted-foreground" />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Коллеж fields */}
              {institutionType === "Коллеж" && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide font-sans">Коллежийн нэр</Label>
                    <Input value={schoolCode} onChange={(e) => setSchoolCode(e.target.value)} placeholder="Жишээ: МонКолледж" className="bg-input border-border h-11 font-sans text-foreground placeholder:text-muted-foreground" required />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide font-sans">Мэргэжил</Label>
                    <Input value={major} onChange={(e) => setMajor(e.target.value)} placeholder="Мэдээлэл технологи" className="bg-input border-border h-11 font-sans text-foreground placeholder:text-muted-foreground" />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide font-sans">Курс / бүлэг</Label>
                      <Input value={className} onChange={(e) => setClassName(e.target.value)} placeholder="3-р курс" className="bg-input border-border h-11 font-sans text-foreground placeholder:text-muted-foreground" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide font-sans">Төгсөх он</Label>
                      <Input type="number" value={graduationYear} onChange={(e) => setGraduationYear(e.target.value)} placeholder="2025" min="2020" max="2035" className="bg-input border-border h-11 font-sans text-foreground placeholder:text-muted-foreground" required />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide font-sans">Группийн нэр</Label>
                      <Input placeholder="2025 дурсамж" className="bg-input border-border h-11 font-sans text-foreground placeholder:text-muted-foreground" />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Access code preview */}
              {accessCode && (
                <div className="rounded-xl bg-muted border border-border p-3">
                  <p className="text-xs text-muted-foreground mb-1 font-sans">Хандах код</p>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-lg font-bold text-primary tracking-wide">
                      {accessCode}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyCode}
                      className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md bg-secondary/10 hover:bg-secondary/20 transition-colors text-secondary-foreground font-sans"
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? "Хуулагдлаа" : "Хуулах"}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Password */}
              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-foreground font-sans">Нууц үг үүсгэх</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Найдвартай нууц үг оруулна уу"
                    className="bg-input border-border h-12 pr-12 text-foreground placeholder:text-muted-foreground font-sans"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Reunion date */}
              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-foreground font-sans">Уулзалтын тов (Капсул нээгдэх огноо)</Label>
                <Input
                  type="date"
                  className="bg-input border-border h-12 text-foreground font-sans"
                  required
                />
              </div>

              {/* Promo code */}
              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-foreground font-sans">Промо код</Label>
                <div className="flex gap-2">
                  <Input
                    value={promoCode}
                    onChange={(e) => {
                      setPromoCode(e.target.value)
                      setPromoError(false)
                      setPromoValid(false)
                    }}
                    placeholder="Зөвхөн урилгатай хэрэглэгчдэд"
                    className={`bg-input border-border h-11 text-foreground placeholder:text-muted-foreground font-mono tracking-wider uppercase flex-1 ${
                      promoError ? "border-red-400" : promoValid ? "border-green-500" : ""
                    }`}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePromoCheck}
                    disabled={!promoCode.trim()}
                    className="h-11 px-4 font-sans font-semibold shrink-0"
                  >
                    {promoValid ? <Check className="w-4 h-4 text-green-500" /> : "Шалгах"}
                  </Button>
                </div>
                <AnimatePresence>
                  {promoError && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-xs text-red-500 flex items-center gap-1 font-sans"
                    >
                      <AlertCircle className="w-3 h-3" />
                      Промо код буруу байна
                    </motion.p>
                  )}
                  {promoValid && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-xs text-green-600 flex items-center gap-1 font-sans"
                    >
                      <Check className="w-3 h-3" />
                      Промо код зөв байна
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}

          <Button
            type="submit"
            disabled={isLoading || (mode === "signup" && (!accessCode || !promoValid))}
            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm shadow-lg shadow-primary/20 transition-all touch-manipulation font-sans mt-2"
          >
            {isLoading ? (
              <motion.div
                className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            ) : (
              <span className="flex items-center gap-2">
                {mode === "login" ? "Дурсамжийн ертөнцөд нэвтрэх" : "Дурсамжийн орон зай үүсгэх"}
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </Button>
        </motion.form>
      </AnimatePresence>

      {/* Mongolian slogan */}
      <motion.div
        className="mt-6 p-4 glass-card rounded-xl text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-sm text-muted-foreground font-serif italic leading-relaxed">
          &ldquo;Дурсамж бүтээх хамгийн тохиромжтой үе бол одоо.&rdquo;
        </p>
      </motion.div>
    </motion.div>
  )
}
