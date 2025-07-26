"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Users, ArrowLeft, CheckCircle } from "lucide-react"

export default function NewTeamPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const name = formData.get("name") as string
    const description = formData.get("description") as string

    if (!name) {
      setError("Team name is required")
      setIsLoading(false)
      return
    }

    try {
      // Simulate team creation delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // For demo, just redirect back to teams
      router.push("/dashboard/teams")
    } catch (error) {
      setError("Failed to create team. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/dashboard/teams">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Teams
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Team</h1>
          <p className="text-gray-600 mt-2">Set up a new team to collaborate and manage tasks together</p>
        </div>
      </div>

      {/* Form */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-xl">Team Details</CardTitle>
              <CardDescription>Provide basic information about your new team</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Team Name *</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter team name (e.g., Development Team)"
                className="h-11"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe what this team does and its purpose..."
                className="min-h-[100px] resize-none"
              />
            </div>

            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex space-x-4 pt-4">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 flex-1" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creating Team...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>Create Team</span>
                  </div>
                )}
              </Button>
              <Link href="/dashboard/teams">
                <Button type="button" variant="outline" className="bg-transparent">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card className="border-0 shadow-md bg-blue-50">
        <CardContent className="p-6">
          <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Your team will be created and you'll be set as the owner</li>
            <li>• You can invite members by email or username</li>
            <li>• Start creating tasks and assigning them to team members</li>
            <li>• Use the team dashboard to track progress and collaborate</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
