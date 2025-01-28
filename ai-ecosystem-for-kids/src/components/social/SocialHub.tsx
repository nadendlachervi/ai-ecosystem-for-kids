import type React from "react"
import { useState, useEffect } from "react"
import { collection, query, orderBy, limit, addDoc, onSnapshot } from "firebase/firestore"
import { db } from "../../firebase/config"
import { useUser } from "../../context/UserContext"

interface Post {
  id: string
  userId: string
  userName: string
  content: string
  timestamp: Date
}

const SocialHub: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const [newPost, setNewPost] = useState("")
  const { user, profile } = useUser()

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("timestamp", "desc"), limit(20))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedPosts: Post[] = []
      querySnapshot.forEach((doc) => {
        fetchedPosts.push({ id: doc.id, ...doc.data() } as Post)
      })
      setPosts(fetchedPosts)
    })

    return () => unsubscribe()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPost.trim() && user && profile) {
      await addDoc(collection(db, "posts"), {
        userId: user.uid,
        userName: profile.name,
        content: newPost,
        timestamp: new Date(),
      })
      setNewPost("")
    }
  }

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Social Hub</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          className="w-full p-2 border rounded"
          rows={3}
          placeholder="Share your thoughts or achievements..."
        ></textarea>
        <button type="submit" className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Post
        </button>
      </form>
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-white p-4 rounded shadow">
            <p className="font-bold">{post.userName}</p>
            <p>{post.content}</p>
            <p className="text-sm text-gray-500">{post.timestamp.toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SocialHub

