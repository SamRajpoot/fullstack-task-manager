"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Users, Plus, Search, Crown, Calendar, CheckSquare } from "lucide-react"
import { getAuthToken } from "@/lib/auth"
import { getDemoTeams } from "@/lib/demo-data" // Use getDemoTeams
import type { Team } from "@/lib/types"

export default function TeamsPage() {
  const [user, setUser] = useState<any>(null)
  const [teams, setTeams] = useState<Team[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const authUser = getAuthToken()
    setUser(authUser)
    // Load demo teams using the new getter function
    setTeams(getDemoTeams())
  }, [])

  const filteredTeams = teams.filter(
    (team) =>
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (!user) return null

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Teams</h1>
          <p className="text-gray-600 mt-2">Manage your teams and collaborate with members</p>
        </div>
        <Link href="/dashboard/teams/new">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Create Team
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search teams..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeams.map((team) => (
          <Card key={team.id} className="border-0 shadow-md hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                {team.owner_id === user.id && (
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    <Crown className="h-3 w-3 mr-1" />
                    Owner
                  </Badge>
                )}
              </div>
              <CardTitle className="text-xl">{team.name}</CardTitle>
              <CardDescription className="line-clamp-2">
                {team.description || "No description provided"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{team.member_count} members</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckSquare className="h-4 w-4" />
                    <span>{team.task_count} tasks</span>
                  </div>
                </div>

                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Created {new Date(team.created_at).toLocaleDateString()}</span>
                </div>

                <div className="flex space-x-2">
                  <Link href={`/dashboard/teams/${team.id}`} className="flex-1">
                    <Button variant="outline" className="w-full bg-transparent">
                      View Team
                    </Button>
                  </Link>
                  <Link href={`/dashboard/teams/${team.id}/tasks`}>
                    <Button variant="ghost" size="sm">
                      Tasks
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTeams.length === 0 && (
        <Card className="border-0 shadow-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">{searchTerm ? "No teams found" : "No teams yet"}</h3>
            <p className="text-gray-600 text-center mb-6 max-w-md">
              {searchTerm
                ? "Try adjusting your search terms to find the team you're looking for."
                : "Create your first team to start collaborating with your colleagues and managing tasks together."}
            </p>
            {!searchTerm && (
              <Link href="/dashboard/teams/new">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Team
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
