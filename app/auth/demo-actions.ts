"use server"
import { signToken } from "@/lib/jwt"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { demoUsers } from "@/lib/demo-data"

export async function demoRegisterAction(formData: FormData) {
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
    // In demo mode, just create a token for any registration
    const token = signToken({
      userId: 1,
      email: email,
      name: name,
    })

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    redirect("/dashboard")
  } catch (error) {
    console.error("Demo registration error:", error)
    return { error: "Failed to create demo account" }
  }
}

export async function demoLoginAction(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  try {
    // Demo login - accept demo@example.com with password123, or any other credentials
    let user = demoUsers.find((u) => u.email === email)

    if (email === "demo@example.com" && password === "password123") {
      user = demoUsers[0]
    } else {
      // For demo purposes, accept any credentials
      user = { id: 1, name: "Demo User", email: email, password: "" }
    }

    // Create JWT token
    const token = signToken({
      userId: user.id,
      email: user.email,
      name: user.name,
    })

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    redirect("/dashboard")
  } catch (error) {
    console.error("Demo login error:", error)
    return { error: "Failed to login to demo" }
  }
}
