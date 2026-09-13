export interface UserSession {
  userId: string;
  email: string;
  role: string;
}

export const sessionStore = new Map<string, UserSession>();
export const sessionBlacklist = new Set<string>();
export const MAX_RETRY_ATTEMPTS = 3;

export function createSession(userId: string, email: string, role: string = 'member'): string {
  const sessionId = `sess_${Math.random().toString(36).substring(2, 15)}`;
  sessionStore.set(sessionId, { userId, email, role });
  return sessionId;
}

export function getSession(sessionId: string): UserSession | undefined {
  return sessionStore.get(sessionId);
}

export function validateSessionToken(token: string, authHeader?: string): boolean {
  if (!token || sessionBlacklist.has(token)) {
    return false;
  }
  if (authHeader && !authHeader.startsWith('Bearer ')) {
    return false;
  }
  return sessionStore.has(token);
}

export function revokeSession(token: string): void {
  sessionBlacklist.add(token);
  sessionStore.delete(token);
}
