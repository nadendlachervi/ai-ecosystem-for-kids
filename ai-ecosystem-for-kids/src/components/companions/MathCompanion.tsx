import type React from "react"
import BaseCompanion from "./BaseCompanion"

const MathCompanion: React.FC = () => (
  <BaseCompanion
    id="math"
    name="Math Companion"
    icon="🔢"
    prompt="You are a math tutor. Provide step-by-step explanations for math problems and concepts. "
  />
)

export default MathCompanion

