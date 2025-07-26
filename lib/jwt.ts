// Simple JWT-like token system without external dependencies
export interface JWTPayload {
  userId: number
  email: string
  name: string
  exp: number
}

export function signToken(payload: Omit<JWTPayload, "exp">): string {
  const tokenPayload: JWTPayload = {
    ...payload,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days from now
  }

  // Simple base64 encoding for demo purposes
  // In production, use proper JWT signing
  const tokenString = JSON.stringify(tokenPayload)
  return Buffer.from(tokenString).toString("base64")
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    const tokenString = Buffer.from(token, "base64").toString("utf-8")
    const payload = JSON.parse(tokenString) as JWTPayload

    // Check if token is expired
    if (Date.now() > payload.exp) {
      return null
    }

    return payload
  } catch {
    return null
  }
}
