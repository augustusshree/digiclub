import { SignJWT, jwtVerify, type JWTPayload } from 'jose'
import { createSecretKey } from 'crypto'
import bcrypt from 'bcryptjs'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'digiclub-dev-jwt-secret-key-2026')
const SECRET_KEY = createSecretKey(JWT_SECRET)

export interface TokenPayload extends JWTPayload {
  sub: string
  role: string
  email?: string
}

export async function signToken(payload: { userId: string; role: string; email?: string }): Promise<string> {
  return new SignJWT({ sub: payload.userId, role: payload.role, email: payload.email })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SECRET_KEY)
}

export async function verifyToken(token: string): Promise<TokenPayload> {
  const { payload } = await jwtVerify(token, SECRET_KEY)
  return payload as unknown as TokenPayload
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}
