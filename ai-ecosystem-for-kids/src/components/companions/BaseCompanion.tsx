import type React from "react"
import { useState } from "react"
import { useUser } from "../../context/UserContext"
import { query } from "../../utils/huggingfaceApi"

interface BaseCompanionProps {
  id: string
  name: string
  icon: string
  prompt: string
}

const BaseCompanion: React.FC<BaseCompanionProps> = ({ id, name, icon, prompt }) => {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const { profile, updateProfile } = useUser()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const result = await query({ inputs: `${prompt} User input: ${input}` })

      setOutput(result[0].generated_text)

      // Update user progress
      const newProgress = { ...profile?.progress, [id]: (profile?.progress[id] || 0) + 0.1 }
      await updateProfile({ progress: newProgress, points: (profile?.points || 0) + 10 })
    } catch (error) {
      console.error("Error:", error)
      setOutput("Sorry, there was an error. Please try again.")
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <span className="text-4xl mr-2">{icon}</span>
        <h2 className="text-2xl font-bold">{name}</h2>
      </div>
      <form onSubmit={handleSubmit} className="mb-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-2 border rounded"
          rows={4}
          placeholder={`Ask your ${name} a question...`}
        ></textarea>
        <button type="submit" className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Submit
        </button>
      </form>
      {output && (
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-bold mb-2">Response:</h3>
          <p>{output}</p>
        </div>
      )}
    </div>
  )
}

export default BaseCompanion

