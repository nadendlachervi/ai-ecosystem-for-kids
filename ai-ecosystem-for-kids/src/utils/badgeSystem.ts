import type { UserProfile } from "../context/UserContext"

interface Badge {
  id: string
  name: string
  description: string
  icon: string
  condition: (profile: UserProfile) => boolean
}

const badges: Badge[] = [
  {
    id: "first_step",
    name: "First Step",
    description: "Complete your first interaction with any companion",
    icon: "🏅",
    condition: (profile) => Object.values(profile.progress).some((progress) => progress > 0),
  },
  {
    id: "math_whiz",
    name: "Math Whiz",
    description: "Reach 50% progress in Math Companion",
    icon: "🧮",
    condition: (profile) => (profile.progress.math || 0) >= 0.5,
  },
  {
    id: "polyglot",
    name: "Polyglot",
    description: "Reach 30% progress in Language Companion",
    icon: "🌍",
    condition: (profile) => (profile.progress.language || 0) >= 0.3,
  },
  // Add more badges as needed
]

export const checkAndAwardBadges = (profile: UserProfile): string[] => {
  const newBadges = badges.filter((badge) => !profile.badges.includes(badge.id) && badge.condition(profile))

  return newBadges.map((badge) => badge.id)
}

export const getBadgeDetails = (badgeId: string): Badge | undefined => {
  return badges.find((badge) => badge.id === badgeId)
}

