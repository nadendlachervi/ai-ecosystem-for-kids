import type React from "react"
import { useAccessibility } from "../../context/AccessibilityContext"

const AccessibilitySettings: React.FC = () => {
  const { fontSize, highContrast, setFontSize, setHighContrast } = useAccessibility()

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Accessibility Settings</h2>
      <div className="mb-4">
        <label className="block mb-2">Font Size:</label>
        <select value={fontSize} onChange={(e) => setFontSize(e.target.value)} className="w-full p-2 border rounded">
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={highContrast}
            onChange={(e) => setHighContrast(e.target.checked)}
            className="mr-2"
          />
          High Contrast Mode
        </label>
      </div>
    </div>
  )
}

export default AccessibilitySettings

