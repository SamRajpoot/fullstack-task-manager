import Link from "next/link"
import { sql } from "@/lib/db"
import { requireAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, FolderOpen, Calendar, Users } from "lucide-react"

export default async function ProjectsPage() {
  const user = await requireAuth()

  const projects = await sql`
    SELECT 
      p.*,
      COUNT(DISTINCT t.id) as task_count,
      COUNT(DISTINCT pm.user_id) as member_count,
      COUNT(CASE WHEN t.status = 'completed' THEN 1 END) as completed_tasks
    FROM projects p
    LEFT JOIN tasks t ON p.id = t.project_id
    LEFT JOIN project_members pm ON p.id = pm.project_id
    WHERE p.owner_id = ${user.userId} OR p.id IN (
      SELECT project_id FROM project_members WHERE user_id = ${user.userId}
    )
    GROUP BY p.id
    ORDER BY p.updated_at DESC
  `

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-2">Manage and track all your projects in one place</p>
        </div>
        <Link href="/dashboard/projects/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </Link>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <FolderOpen className="h-5 w-5 text-blue-600" />
                <Badge variant={project.status === "active" ? "default" : "secondary"}>{project.status}</Badge>
              </div>
              <CardTitle className="text-lg">{project.name}</CardTitle>
              <CardDescription className="line-clamp-2">
                {project.description || "No description provided"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium">
                    {project.task_count > 0
                      ? `${Math.round((project.completed_tasks / project.task_count) * 100)}%`
                      : "0%"}
                  </span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{
                      width: project.task_count > 0 ? `${(project.completed_tasks / project.task_count) * 100}%` : "0%",
                    }}
                  />
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{project.task_count} tasks</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{project.member_count} members</span>
                  </div>
                </div>

                <Link href={`/dashboard/projects/${project.id}`}>
                  <Button variant="outline" className="w-full mt-4 bg-transparent">
                    View Project
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {projects.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FolderOpen className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
            <p className="text-gray-600 text-center mb-6">Get started by creating your first project</p>
            <Link href="/dashboard/projects/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Project
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
