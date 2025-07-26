"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Users, Info, LogIn } from "lucide-react"
import { setAuthToken } from "@/lib/auth"
import { demoUsers } from "@/lib/demo-data"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    if (!email || !password) {
      setError("Email and password are required")
      setIsLoading(false)
      return
    }

    try {
      // Simulate login delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Check for demo users
      let user = demoUsers.find((u) => u.email === email)

      if (!user) {
        // For demo, accept any credentials
        user = {
          id: Date.now(),
          email: email,
          name: email.split("@")[0],
          created_at: new Date().toISOString(),
        }
      }

      setAuthToken({
        id: user.id,
        email: user.email,
        name: user.name,
      })

      router.push("/dashboard")
    } catch (error) {
      setError("Failed to sign in. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center space-x-2 mb-8">
          <Users className="h-8 w-8 text-blue-600" />
          <span className="text-2xl font-bold text-gray-900">TeamTasker</span>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>Sign in to your TeamTasker account</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-6 border-blue-200 bg-blue-50">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>Demo accounts:</strong> admin@taskmanager.com, john@taskmanager.com, jane@taskmanager.com
                (password: demopass)
              </AlertDescription>
            </Alert>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@taskmanager.com"
                  defaultValue="admin@taskmanager.com"
                  className="h-11"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="demopass"
                  defaultValue="demopass"
                  className="h-11"
                  required
                />
              </div>

              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Signing In...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <LogIn className="h-4 w-4" />
                    <span>Sign In</span>
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-gray-600">{"Don't have an account? "}</span>
              <Link href="/auth/register" className="text-blue-600 hover:text-blue-700 font-medium">
                Create one here
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
