export interface User {
  id: number
  email: string
  name: string
  avatar_url?: string
  created_at: string
}

export interface Team {
  id: number
  name: string
  description?: string
  owner_id: number
  created_at: string
  member_count?: number
  task_count?: number
  owner_name?: string
}

export interface TeamMember {
  id: number
  team_id: number
  user_id: number
  role: "owner" | "admin" | "member"
  joined_at: string
  user_name: string
  user_email: string
}

export interface Task {
  id: number
  title: string
  description?: string
  team_id: number
  assigned_to?: number
  created_by: number
  status: "todo" | "in_progress" | "completed"
  priority: "low" | "medium" | "high"
  due_date?: string
  created_at: string
  updated_at: string
  team_name?: string
  assigned_to_name?: string
  created_by_name?: string
}

export interface JWTPayload {
  userId: number
  email: string
  name: string
  exp: number
}
