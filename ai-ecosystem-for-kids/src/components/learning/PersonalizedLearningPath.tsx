import type React from "react"
import { useState, useEffect } from "react"
import { useUser } from "../../context/UserContext"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../../firebase/config"
import { query } from "../../utils/huggingfaceApi"

interface LearningMaterial {
  id: string
  title: string
  content: string
  subject: string
}

const PersonalizedLearningPath: React.FC = () => {
  const { profile } = useUser()
  const [learningPath, setLearningPath] = useState<string>("")
  const [materials, setMaterials] = useState<LearningMaterial[]>([])

  useEffect(() => {
    fetchMaterials()
  }, [])

  const fetchMaterials = async () => {
    const querySnapshot = await getDocs(collection(db, "learningMaterials"))
    const fetchedMaterials: LearningMaterial[] = []
    querySnapshot.forEach((doc) => {
      fetchedMaterials.push({ id: doc.id, ...doc.data() } as LearningMaterial)
    })
    setMaterials(fetchedMaterials)
  }

  const generateLearningPath = async () => {
    if (profile && materials.length > 0) {
      const userProgress = Object.entries(profile.progress)
        .map(([subject, progress]) => `${subject}: ${(progress * 100).toFixed(0)}%`)
        .join(", ")

      const materialsList = materials.map((material) => `${material.title} (${material.subject})`).join(", ")

      const prompt = `
        Based on the user's progress (${userProgress}) and the available learning materials (${materialsList}),
        generate a personalized learning path. The path should focus on areas where the user's progress is lower
        and suggest relevant materials to study. Format the response as a numbered list of steps.
      `

      try {
        const result = await query({ inputs: prompt })
        setLearningPath(result[0].generated_text)
      } catch (error) {
        console.error("Error generating learning path:", error)
        setLearningPath("Error generating learning path. Please try again later.")
      }
    }
  }

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Personalized Learning Path</h2>
      <button
        onClick={generateLearningPath}
        className="mb-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Generate Learning Path
      </button>
      {learningPath && (
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-xl font-bold mb-2">Your Learning Path:</h3>
          <div dangerouslySetInnerHTML={{ __html: learningPath.replace(/\n/g, "<br>") }} />
        </div>
      )}
    </div>
  )
}

export default PersonalizedLearningPath

