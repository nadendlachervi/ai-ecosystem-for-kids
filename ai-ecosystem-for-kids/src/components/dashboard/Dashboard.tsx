import type React from "react"
import { Link } from "react-router-dom"
import { useUser } from "../../context/UserContext"

interface CompanionCard {
  id: string
  name: string
  description: string
  icon: string
}

const companionCards: CompanionCard[] = [
  { id: "art", name: "Art Companion", description: "Create amazing art with AI", icon: "🎨" },
  { id: "study", name: "Study Companion", description: "Get help with your studies", icon: "📚" },
  { id: "language", name: "Language Companion", description: "Learn new languages", icon: "🗣️" },
  { id: "math", name: "Math Companion", description: "Master mathematics", icon: "🔢" },
  { id: "music", name: "Music Companion", description: "Explore the world of music", icon: "🎵" },
  { id: "coding", name: "Coding Companion", description: "Learn to code with AI", icon: "💻" },
]

const Dashboard: React.FC = () => {
  const { profile } = useUser()

  return (
    <div>
      <div className="mb-8 p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Your Progress</h2>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-lg">
              Total Points: <span className="font-bold text-blue-600">{profile?.points}</span>
            </p>
            <p className="text-lg">
              Badges Earned: <span className="font-bold text-green-600">{profile?.badges.length}</span>
            </p>
          </div>
          <Link to="/achievements" className="bg-yellow-400 hover:bg-yellow-500 text-yellow-800 py-2 px-4 rounded">
            View Achievements
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companionCards.map((companion) => (
          <Link
            key={companion.id}
            to={`/companion/${companion.id}`}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
          >
            <div className="text-4xl mb-4">{companion.icon}</div>
            <h2 className="text-xl font-semibold mb-2">{companion.name}</h2>
            <p className="text-gray-600 mb-4">{companion.description}</p>
            <div className="h-2 bg-gray-200 rounded-full">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${(profile?.progress[companion.id] || 0) * 100}%` }}
              ></div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Dashboard

