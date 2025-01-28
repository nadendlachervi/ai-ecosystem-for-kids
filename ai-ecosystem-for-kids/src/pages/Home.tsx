import type React from "react"
import Dashboard from "../components/dashboard/Dashboard"
import AuthForm from "../components/auth/AuthForm"
import Onboarding from "../components/onboarding/Onboarding"
import { useUser } from "../context/UserContext"

const Home: React.FC = () => {
  const { user, profile, loading } = useUser()

  if (loading) {
    return <div>Loading...</div>
  }

  if (user && profile) {
    if (!profile.onboardingCompleted) {
      return <Onboarding />
    }
    return <Dashboard />
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-center text-blue-800">Welcome to Your AI Learning Adventure!</h1>
      <div className="max-w-md mx-auto">
        <AuthForm />
      </div>
    </div>
  )
}

export default Home

