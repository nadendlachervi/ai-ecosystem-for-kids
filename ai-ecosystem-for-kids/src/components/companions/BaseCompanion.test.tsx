import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import BaseCompanion from "./BaseCompanion"
import { UserProvider } from "../../context/UserContext"

jest.mock("ai", () => ({
  generateText: jest.fn(() => Promise.resolve({ text: "AI response" })),
}))

jest.mock("@ai-sdk/openai", () => ({
  openai: jest.fn(),
}))

describe("BaseCompanion", () => {
  it("renders correctly", () => {
    render(
      <UserProvider>
        <BaseCompanion id="test" name="Test Companion" icon="🧪" prompt="Test prompt" />
      </UserProvider>,
    )

    expect(screen.getByText("Test Companion")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Ask your Test Companion a question...")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument()
  })

  it("handles user input and submission", async () => {
    render(
      <UserProvider>
        <BaseCompanion id="test" name="Test Companion" icon="🧪" prompt="Test prompt" />
      </UserProvider>,
    )

    const input = screen.getByPlaceholderText("Ask your Test Companion a question...")
    fireEvent.change(input, { target: { value: "Test question" } })
    expect(input).toHaveValue("Test question")

    const submitButton = screen.getByRole("button", { name: "Submit" })
    fireEvent.click(submitButton)

    const response = await screen.findByText("AI response")
    expect(response).toBeInTheDocument()
  })
})

