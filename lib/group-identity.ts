export interface GroupIdentity {
  school: string
  graduationYear: string
  className: string
  accessCode: string
}

const STORAGE_KEY = "memoria-group-identity"

export function parseAccessCode(code: string): GroupIdentity | null {
  const normalized = code.trim().toUpperCase().replace(/\s/g, "")
  const match = normalized.match(/^([A-Z]+)(\d{4})([A-Z0-9]+)$/)
  if (!match) return null
  return {
    school: match[1],
    graduationYear: match[2],
    className: match[3],
    accessCode: normalized,
  }
}

export function buildGroupIdentity(
  school: string,
  graduationYear: string,
  className: string
): GroupIdentity | null {
  const schoolPart = school.trim().toUpperCase().replace(/[^A-Z0-9]/g, "")
  const yearPart = graduationYear.trim().replace(/\D/g, "")
  const classPart = className.trim().toUpperCase().replace(/[^A-Z0-9]/g, "")
  if (!schoolPart || !yearPart || !classPart) return null
  return {
    school: schoolPart,
    graduationYear: yearPart,
    className: classPart,
    accessCode: `${schoolPart}${yearPart}${classPart}`,
  }
}

export function saveGroupIdentity(identity: GroupIdentity) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(identity))
}

export function loadGroupIdentity(): GroupIdentity | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      const legacyCode = localStorage.getItem("memoria-group-access-code")
      if (legacyCode) return parseAccessCode(legacyCode)
      return null
    }
    return JSON.parse(raw) as GroupIdentity
  } catch {
    return null
  }
}

export function formatGraduationLine(identity: GroupIdentity): string {
  return `Class of ${identity.graduationYear} · ${identity.className}`
}

export function formatGraduationSubtitle(identity: GroupIdentity): string {
  return `${identity.graduationYear} Graduation`
}
