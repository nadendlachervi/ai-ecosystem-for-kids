import type React from "react"
import { useState, useEffect } from "react"
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore"
import { db } from "../../firebase/config"

interface LearningMaterial {
  id: string
  title: string
  content: string
  subject: string
}

const ContentManager: React.FC = () => {
  const [materials, setMaterials] = useState<LearningMaterial[]>([])
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [subject, setSubject] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (title && content && subject) {
      if (editingId) {
        await updateDoc(doc(db, "learningMaterials", editingId), {
          title,
          content,
          subject,
        })
        setEditingId(null)
      } else {
        await addDoc(collection(db, "learningMaterials"), {
          title,
          content,
          subject,
        })
      }
      setTitle("")
      setContent("")
      setSubject("")
      fetchMaterials()
    }
  }

  const handleEdit = (material: LearningMaterial) => {
    setTitle(material.title)
    setContent(material.content)
    setSubject(material.subject)
    setEditingId(material.id)
  }

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "learningMaterials", id))
    fetchMaterials()
  }

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Content Manager</h2>
      <form onSubmit={handleSubmit} className="mb-8">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full p-2 mb-2 border rounded"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
          className="w-full p-2 mb-2 border rounded"
          rows={4}
        ></textarea>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Subject"
          className="w-full p-2 mb-2 border rounded"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          {editingId ? "Update" : "Add"} Material
        </button>
      </form>
      <div className="space-y-4">
        {materials.map((material) => (
          <div key={material.id} className="bg-white p-4 rounded shadow">
            <h3 className="text-xl font-bold">{material.title}</h3>
            <p className="text-gray-600">{material.subject}</p>
            <p className="mt-2">{material.content}</p>
            <div className="mt-2">
              <button onClick={() => handleEdit(material)} className="mr-2 text-blue-500 hover:text-blue-700">
                Edit
              </button>
              <button onClick={() => handleDelete(material.id)} className="text-red-500 hover:text-red-700">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ContentManager

