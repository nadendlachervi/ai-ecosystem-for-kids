import type React from "react"
import BaseCompanion from "./BaseCompanion"

const LanguageCompanion: React.FC = () => (
  <BaseCompanion
    id="language"
    name="Language Companion"
    icon="🗣️"
    prompt="You are a language learning assistant. Help the user learn new languages by providing translations, explanations of grammar rules, and examples of usage. "
  />
)

export default LanguageCompanion

