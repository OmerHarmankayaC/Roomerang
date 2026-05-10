const ROLE_KEY = 'roomerang_role';
const TIME_KEY = 'roomerang_login_time';
const SESSION_MS = 30 * 60 * 1000;

export type UserRole = 'staff' | 'admin';

export function setSession(role: UserRole): void {
  localStorage.setItem(ROLE_KEY, role);
  localStorage.setItem(TIME_KEY, String(Date.now()));
}

export function getRole(): UserRole | null {
  const role = localStorage.getItem(ROLE_KEY) as UserRole | null;
  const raw = localStorage.getItem(TIME_KEY);
  if (!role || !raw) return null;
  if (Date.now() - Number(raw) > SESSION_MS) {
    clearSession();
    return null;
  }
  localStorage.setItem(TIME_KEY, String(Date.now()));
  return role;
}

export function clearSession(): void {
  localStorage.removeItem(ROLE_KEY);
  localStorage.removeItem(TIME_KEY);
}
