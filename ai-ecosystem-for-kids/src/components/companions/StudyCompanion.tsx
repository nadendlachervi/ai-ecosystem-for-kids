import type React from "react"
import BaseCompanion from "./BaseCompanion"

const StudyCompanion: React.FC = () => (
  <BaseCompanion
    id="study"
    name="Study Companion"
    icon="📚"
    prompt="You are a helpful study assistant. Provide concise and clear explanations to help the student understand the topic. "
  />
)

export default StudyCompanion

