"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getAuthToken, type AuthUser } from "@/lib/auth"
import { DashboardNav } from "@/components/dashboard-nav"
import { LoadingSpinner } from "@/components/loading-spinner"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const authUser = getAuthToken()
    if (!authUser) {
      router.push("/auth/login")
    } else {
      setUser(authUser)
    }
    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav user={user} />
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
