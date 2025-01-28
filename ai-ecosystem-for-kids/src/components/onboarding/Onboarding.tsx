import type React from "react"
import { useState } from "react"
import { useUser } from "../../context/UserContext"

const steps = [
  {
    title: "Welcome to AI Ecosystem for Kids!",
    content: "Embark on an exciting learning journey with our AI companions.",
  },
  {
    title: "Meet Your Companions",
    content: "Explore various subjects with our friendly AI companions.",
  },
  {
    title: "Track Your Progress",
    content: "Earn points, unlock badges, and watch your knowledge grow!",
  },
  {
    title: "Stay Safe",
    content: "Remember to always be kind and respectful in your interactions.",
  },
]

const Onboarding: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const { updateProfile } = useUser()

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      updateProfile({ onboardingCompleted: true })
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">{steps[currentStep].title}</h2>
      <p className="mb-6">{steps[currentStep].content}</p>
      <div className="flex justify-between">
        <button
          onClick={() => setCurrentStep(currentStep - 1)}
          disabled={currentStep === 0}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <button onClick={handleNext} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          {currentStep === steps.length - 1 ? "Finish" : "Next"}
        </button>
      </div>
    </div>
  )
}

export default Onboarding

