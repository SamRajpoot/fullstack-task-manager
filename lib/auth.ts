"use client"

export interface AuthUser {
  id: number
  email: string
  name: string
}

export function setAuthToken(user: AuthUser): void {
  if (typeof window !== "undefined") {
    const tokenData = {
      ...user,
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    }
    localStorage.setItem("auth-token", JSON.stringify(tokenData))
  }
}

export function getAuthToken(): AuthUser | null {
  if (typeof window === "undefined") return null

  try {
    const token = localStorage.getItem("auth-token")
    if (!token) return null

    const tokenData = JSON.parse(token)

    // Check if token is expired
    if (Date.now() > tokenData.exp) {
      localStorage.removeItem("auth-token")
      return null
    }

    return {
      id: tokenData.id,
      email: tokenData.email,
      name: tokenData.name,
    }
  } catch {
    return null
  }
}

export function removeAuthToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth-token")
  }
}

export function isAuthenticated(): boolean {
  return getAuthToken() !== null
}

// This function is a placeholder for potential server-side authentication.
// In the current client-side auth setup, it will always return null.
export async function getCurrentUser(): Promise<AuthUser | null> {
  return null
}
