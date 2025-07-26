"use server"

import { signToken } from "@/lib/jwt"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { demoUsers } from "@/lib/demo-data"

export async function simpleRegisterAction(formData: FormData) {
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
    const token = signToken({
      userId: Date.now(), // Use timestamp as unique ID
      email: email,
      name: name,
    })

    // Set cookie with proper error handling
    try {
      const cookieStore = await cookies()
      cookieStore.set("auth-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      })
    } catch (cookieError) {
      console.error("Cookie error:", cookieError)
      // Continue without setting cookie for now
    }

    // Use a delay before redirect to ensure cookie is set
    await new Promise((resolve) => setTimeout(resolve, 100))
  } catch (error) {
    console.error("Registration error:", error)
    return { error: "Failed to create account" }
  }

  // Redirect outside of try-catch to avoid issues
  redirect("/dashboard")
}

export async function simpleLoginAction(formData: FormData) {
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
    const token = signToken({
      userId: user.id,
      email: user.email,
      name: user.name,
    })

    // Set cookie with proper error handling
    try {
      const cookieStore = await cookies()
      cookieStore.set("auth-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      })
    } catch (cookieError) {
      console.error("Cookie error:", cookieError)
      // Continue without setting cookie for now
    }

    // Use a delay before redirect to ensure cookie is set
    await new Promise((resolve) => setTimeout(resolve, 100))
  } catch (error) {
    console.error("Login error:", error)
    return { error: "Failed to login" }
  }

  // Redirect outside of try-catch to avoid issues
  redirect("/dashboard")
}

export async function logoutAction() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete("auth-token")
  } catch (error) {
    console.error("Logout cookie error:", error)
  }
  redirect("/")
}
