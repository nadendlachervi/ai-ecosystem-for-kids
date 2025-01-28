import type React from "react"
import { Link } from "react-router-dom"
import { useUser } from "../../context/UserContext"

const Header: React.FC = () => {
  const { user } = useUser()

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          AI Ecosystem for Kids
        </Link>
        {user ? (
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Welcome, {user.name}!</span>
            <span className="bg-yellow-400 text-yellow-800 py-1 px-3 rounded-full text-sm font-semibold">
              {user.points} points
            </span>
          </div>
        ) : (
          <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">Sign In</button>
        )}
      </div>
    </header>
  )
}

export default Header

