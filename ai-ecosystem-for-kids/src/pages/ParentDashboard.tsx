import type React from "react"
import { useState, useEffect } from "react"
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore"
import { db } from "../firebase/config"
import { useUser } from "../context/UserContext"
import { getBadgeDetails } from "../utils/badgeSystem"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

interface ChildProgress {
  id: string
  name: string
  points: number
  progress: Record<string, number>
  badges: string[]
  goals: Record<string, number>
}

const ParentDashboard: React.FC = () => {
  const { user } = useUser()
  const [children, setChildren] = useState<ChildProgress[]>([])
  const [selectedChild, setSelectedChild] = useState<string | null>(null)

  useEffect(() => {
    const fetchChildren = async () => {
      if (user) {
        const q = query(collection(db, "users"), where("parentId", "==", user.uid))
        const querySnapshot = await getDocs(q)
        const childrenData: ChildProgress[] = []
        querySnapshot.forEach((doc) => {
          childrenData.push({ id: doc.id, ...doc.data() } as ChildProgress)
        })
        setChildren(childrenData)
        if (childrenData.length > 0) {
          setSelectedChild(childrenData[0].id)
        }
      }
    }

    fetchChildren()
  }, [user])

  const handleGoalUpdate = async (childId: string, subject: string, goal: number) => {
    const childRef = doc(db, "users", childId)
    await updateDoc(childRef, {
      [`goals.${subject}`]: goal,
    })
    setChildren(
      children.map((child) =>
        child.id === childId ? { ...child, goals: { ...child.goals, [subject]: goal } } : child,
      ),
    )
  }

  const renderProgressChart = (child: ChildProgress) => {
    const data = {
      labels: Object.keys(child.progress),
      datasets: [
        {
          label: "Progress",
          data: Object.values(child.progress).map((p) => p * 100),
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
        {
          label: "Goals",
          data: Object.keys(child.progress).map((subject) => (child.goals[subject] || 0) * 100),
          borderColor: "rgb(255, 99, 132)",
          tension: 0.1,
        },
      ],
    }

    return (
      <Line
        data={data}
        options={{
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              title: {
                display: true,
                text: "Progress (%)",
              },
            },
          },
        }}
      />
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Parent Dashboard</h1>
      {children.length > 0 && (
        <div className="mb-4">
          <label htmlFor="childSelect" className="block text-sm font-medium text-gray-700">
            Select Child:
          </label>
          <select
            id="childSelect"
            value={selectedChild || ""}
            onChange={(e) => setSelectedChild(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            {children.map((child) => (
              <option key={child.id} value={child.id}>
                {child.name}
              </option>
            ))}
          </select>
        </div>
      )}
      {selectedChild &&
        children.map(
          (child) =>
            child.id === selectedChild && (
              <div key={child.id} className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-2xl font-semibold mb-4">{child.name}</h2>
                <p className="mb-2">
                  Total Points: <span className="font-bold text-blue-600">{child.points}</span>
                </p>

                <h3 className="text-xl font-semibold mb-2">Progress and Goals:</h3>
                {renderProgressChart(child)}

                {Object.entries(child.progress).map(([subject, progress]) => (
                  <div key={subject} className="mb-2">
                    <p className="text-lg">
                      {subject}: {(progress * 100).toFixed(0)}%
                    </p>
                    <div className="flex items-center">
                      <div className="h-2 bg-gray-200 rounded-full flex-grow">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${progress * 100}%` }}></div>
                      </div>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={(child.goals[subject] || 0) * 100}
                        onChange={(e) => handleGoalUpdate(child.id, subject, Number(e.target.value) / 100)}
                        className="ml-2 w-16 p-1 border rounded"
                      />
                      <span className="ml-1">%</span>
                    </div>
                  </div>
                ))}

                <h3 className="text-xl font-semibold mt-4 mb-2">Badges:</h3>
                <div className="flex flex-wrap gap-2">
                  {child.badges.map((badgeId) => {
                    const badge = getBadgeDetails(badgeId)
                    return badge ? (
                      <div key={badgeId} className="flex items-center bg-yellow-100 rounded-full px-3 py-1">
                        <span className="mr-2">{badge.icon}</span>
                        <span>{badge.name}</span>
                      </div>
                    ) : null
                  })}
                </div>
              </div>
            ),
        )}
    </div>
  )
}

export default ParentDashboard

