"use server"

import { hashPassword, comparePassword } from "@/lib/auth"
import { signToken } from "@/lib/jwt"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

// Import sql with error handling
let sql: any
try {
  const { sql: dbSql } = await import("@/lib/db")
  sql = dbSql
} catch (error) {
  console.error("Database connection error:", error)
}

export async function registerAction(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!name || !email || !password) {
    return { error: "All fields are required" }
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters" }
  }

  // Check if database is available
  if (!sql) {
    return { error: "Database connection not available. Please add Neon integration." }
  }

  try {
    // Check if user already exists
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email}
    `

    if (existingUser.length > 0) {
      return { error: "User already exists with this email" }
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password)
    const result = await sql`
      INSERT INTO users (name, email, password)
      VALUES (${name}, ${email}, ${hashedPassword})
      RETURNING id, name, email
    `

    const user = result[0]

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
    console.error("Registration error:", error)
    if (error instanceof Error && error.message.includes("database")) {
      return { error: "Database connection failed. Please add Neon integration to your project." }
    }
    return { error: "Failed to create account. Please try again." }
  }
}

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  // Check if database is available
  if (!sql) {
    return { error: "Database connection not available. Please add Neon integration." }
  }

  try {
    // Find user
    const result = await sql`
      SELECT id, name, email, password FROM users WHERE email = ${email}
    `

    if (result.length === 0) {
      return { error: "Invalid email or password" }
    }

    const user = result[0]

    // Verify password
    const isValid = await comparePassword(password, user.password)
    if (!isValid) {
      return { error: "Invalid email or password" }
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
    console.error("Login error:", error)
    if (error instanceof Error && error.message.includes("database")) {
      return { error: "Database connection failed. Please add Neon integration to your project." }
    }
    return { error: "Failed to login. Please try again." }
  }
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete("auth-token")
  redirect("/")
}
