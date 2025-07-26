"use client"

import { signToken, verifyToken, type JWTPayload } from "./jwt"

export function setClientToken(payload: Omit<JWTPayload, "exp">) {
  const token = signToken(payload)
  if (typeof window !== "undefined") {
    localStorage.setItem("auth-token", token)
  }
  return token
}

export function getClientToken(): JWTPayload | null {
  if (typeof window === "undefined") return null

  const token = localStorage.getItem("auth-token")
  if (!token) return null

  return verifyToken(token)
}

export function removeClientToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth-token")
  }
}
