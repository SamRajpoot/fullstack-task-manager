"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getClientToken } from "@/lib/client-auth"

export function ClientAuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated on client side
    const token = getClientToken()
    if (!token) {
      router.push("/auth/login")
    }
  }, [router])

  return <>{children}</>
}
