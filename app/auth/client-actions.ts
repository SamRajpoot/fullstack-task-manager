"use client"

import { setClientToken, removeClientToken } from "@/lib/client-auth"
import { demoUsers } from "@/lib/demo-data"

export async function clientRegisterAction(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!name || !email || !password) {
    return { error: "All fields are required" }
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters" }
  }

  try {
    // For demo purposes, create a token for any registration
    setClientToken({
      userId: Date.now(), // Use timestamp as unique ID
      email: email,
      name: name,
    })

    // Simulate async operation
    await new Promise((resolve) => setTimeout(resolve, 500))

    return { success: true }
  } catch (error) {
    console.error("Registration error:", error)
    return { error: "Failed to create account" }
  }
}

export async function clientLoginAction(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  try {
    let user = { id: 1, name: "Demo User", email: email }

    // Check for demo credentials
    if (email === "demo@example.com" && password === "password123") {
      user = demoUsers[0]
    } else {
      // For demo purposes, accept any credentials
      user = { id: Date.now(), name: email.split("@")[0], email: email }
    }

    // Create token
    setClientToken({
      userId: user.id,
      email: user.email,
      name: user.name,
    })

    // Simulate async operation
    await new Promise((resolve) => setTimeout(resolve, 500))

    return { success: true }
  } catch (error) {
    console.error("Login error:", error)
    return { error: "Failed to login" }
  }
}

export function clientLogoutAction() {
  removeClientToken()
}
