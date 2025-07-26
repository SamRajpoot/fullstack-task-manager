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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckSquare, ArrowLeft, Plus } from "lucide-react"
import { demoTeams, demoUsers } from "@/lib/demo-data"

export default function NewTaskPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedTeam, setSelectedTeam] = useState("")
  const router = useRouter()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const teamId = formData.get("team") as string
    const assignedTo = formData.get("assignedTo") as string
    const priority = formData.get("priority") as string

    if (!title || !teamId) {
      setError("Title and team are required")
      setIsLoading(false)
      return
    }

    try {
      // Simulate task creation delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // For demo, just redirect back to tasks
      router.push("/dashboard/tasks")
    } catch (error) {
      setError("Failed to create task. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/dashboard/tasks">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tasks
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Task</h1>
          <p className="text-gray-600 mt-2">Add a new task and assign it to team members</p>
        </div>
      </div>

      {/* Form */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckSquare className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-xl">Task Details</CardTitle>
              <CardDescription>Provide information about the new task</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Task Title *</Label>
              <Input
                id="title"
                name="title"
                type="text"
                placeholder="Enter task title (e.g., Implement user authentication)"
                className="h-11"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe what needs to be done, requirements, and any additional context..."
                className="min-h-[100px] resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="team">Team *</Label>
                <Select name="team" value={selectedTeam} onValueChange={setSelectedTeam} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a team" />
                  </SelectTrigger>
                  <SelectContent>
                    {demoTeams.map((team) => (
                      <SelectItem key={team.id} value={team.id.toString()}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="assignedTo">Assign To</Label>
                <Select name="assignedTo">
                  <SelectTrigger>
                    <SelectValue placeholder="Select team member" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    {demoUsers.map((user) => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select name="priority" defaultValue="medium">
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input id="dueDate" name="dueDate" type="date" className="h-11" />
              </div>
            </div>

            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex space-x-4 pt-4">
              <Button type="submit" className="bg-green-600 hover:bg-green-700 flex-1" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creating Task...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>Create Task</span>
                  </div>
                )}
              </Button>
              <Link href="/dashboard/tasks">
                <Button type="button" variant="outline" className="bg-transparent">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="border-0 shadow-md bg-green-50">
        <CardContent className="p-6">
          <h3 className="font-semibold text-green-900 mb-2">Task Creation Tips</h3>
          <ul className="text-sm text-green-800 space-y-1">
            <li>• Be specific and clear in your task title</li>
            <li>• Include acceptance criteria in the description</li>
            <li>• Set realistic due dates to help with planning</li>
            <li>• Assign tasks to team members for accountability</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
