import type React from "react"
import { useState, useEffect } from "react"
import { useUser } from "../../context/UserContext"
import { checkNotifications } from "../../utils/notifications"

const Notifications: React.FC = () => {
  const { profile } = useUser()
  const [notifications, setNotifications] = useState<string[]>([])

  useEffect(() => {
    if (profile) {
      const newNotifications = checkNotifications(profile)
      setNotifications(newNotifications)
    }
  }, [profile])

  if (notifications.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 max-w-md">
      {notifications.map((notification, index) => (
        <div key={index} className="bg-blue-500 text-white p-4 rounded-lg shadow-lg mb-2">
          {notification}
        </div>
      ))}
    </div>
  )
}

export default Notifications

