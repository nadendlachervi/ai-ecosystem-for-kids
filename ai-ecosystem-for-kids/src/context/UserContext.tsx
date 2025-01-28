import type React from "react"
import { createContext, useState, useEffect, useContext, type ReactNode } from "react"
import type { User as FirebaseUser } from "firebase/auth"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { auth, db } from "../firebase/config"
import { checkAndAwardBadges } from "../utils/badgeSystem"
import { signInWithEmailAndPassword, signOut as firebaseSignOut, createUserWithEmailAndPassword } from "firebase/auth"

interface UserProfile {
  id: string
  name: string
  points: number
  badges: string[]
  progress: Record<string, number>
}

interface UserContextType {
  user: FirebaseUser | null
  profile: UserProfile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  updateProfile: (data: Partial<UserProfile>) => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      setUser(firebaseUser)
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid))
        if (userDoc.exists()) {
          setProfile(userDoc.data() as UserProfile)
        } else {
          const newProfile: UserProfile = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || "New User",
            points: 0,
            badges: [],
            progress: {},
          }
          await setDoc(doc(db, "users", firebaseUser.uid), newProfile)
          setProfile(newProfile)
        }
      } else {
        setProfile(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      console.error("Error signing in:", error)
      throw error
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const newUser = userCredential.user
      const newProfile: UserProfile = {
        id: newUser.uid,
        name: name,
        points: 0,
        badges: [],
        progress: {},
      }
      await setDoc(doc(db, "users", newUser.uid), newProfile)
      setProfile(newProfile)
    } catch (error) {
      console.error("Error signing up:", error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
      setUser(null)
      setProfile(null)
    } catch (error) {
      console.error("Error signing out:", error)
      throw error
    }
  }

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (user && profile) {
      const updatedProfile = { ...profile, ...data }

      // Check for new badges
      const newBadges = checkAndAwardBadges(updatedProfile)
      if (newBadges.length > 0) {
        updatedProfile.badges = [...updatedProfile.badges, ...newBadges]
        // You could also add points for earning badges
        updatedProfile.points += newBadges.length * 50
      }

      await setDoc(doc(db, "users", user.uid), updatedProfile)
      setProfile(updatedProfile)
    }
  }

  return (
    <UserContext.Provider value={{ user, profile, loading, signIn, signUp, signOut, updateProfile }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}

