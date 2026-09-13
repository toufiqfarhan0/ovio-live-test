export interface UserSession {
  userId: string;
  email: string;
  role: string;
}

export const sessionStore = new Map<string, UserSession>();

export function createSession(userId: string, email: string, role: string = 'member'): string {
  const sessionId = `sess_${Math.random().toString(36).substring(2, 15)}`;
  sessionStore.set(sessionId, { userId, email, role });
  return sessionId;
}

export function getSession(sessionId: string): UserSession | undefined {
  return sessionStore.get(sessionId);
}
