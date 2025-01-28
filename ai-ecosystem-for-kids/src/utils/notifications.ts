import type { UserProfile } from "../context/UserContext"

export const checkNotifications = (profile: UserProfile): string[] => {
  const notifications: string[] = []

  // Check for inactivity
  const lastActivity = new Date(profile.lastActivity)
  const daysSinceLastActivity = (Date.now() - lastActivity.getTime()) / (1000 * 3600 * 24)
  if (daysSinceLastActivity > 2) {
    notifications.push("It's been a while! Come back and continue your learning journey.")
  }

  // Check for achievements
  if (profile.points >= 1000 && !profile.badges.includes("points_1000")) {
    notifications.push("Congratulations! You've earned over 1000 points!")
  }

  // Check for companion progress
  Object.entries(profile.progress).forEach(([companion, progress]) => {
    if (progress >= 0.5 && !profile.badges.includes(`${companion}_master`)) {
      notifications.push(`You're halfway to mastering ${companion}! Keep it up!`)
    }
  })

  return notifications
}

