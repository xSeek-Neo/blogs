import { authConfig } from '../config/auth'

const AUTH_SESSION_KEY = 'kb_s'
const authListeners = new Set<() => void>()

function notifyAuthChange(): void {
  authListeners.forEach((listener) => listener())
}

export function subscribeAuthSession(listener: () => void): () => void {
  authListeners.add(listener)
  return () => authListeners.delete(listener)
}

export function getDefaultUsername(): string {
  return authConfig.username
}

export function verifyCredentials(username: string, password: string): boolean {
  return username.trim() === authConfig.username && password === authConfig.password
}

export function setAuthSession(): void {
  if (typeof window === 'undefined') {
    return
  }
  sessionStorage.setItem(
    AUTH_SESSION_KEY,
    btoa(`${Date.now()}:${Math.random().toString(36).slice(2)}`),
  )
  notifyAuthChange()
}

export function clearAuthSession(): void {
  if (typeof window === 'undefined') {
    return
  }
  sessionStorage.removeItem(AUTH_SESSION_KEY)
  notifyAuthChange()
}

export function hasAuthSession(): boolean {
  if (typeof window === 'undefined') {
    return false
  }
  return Boolean(sessionStorage.getItem(AUTH_SESSION_KEY))
}

export const LOGIN_REDIRECT = authConfig.redirect
