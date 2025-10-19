export interface UrlItem {
  id: string;
  originalUrl: string;
  shortCode: string;
  createdById: string;
}

export interface AuthUser {
  id: string;
  username: string;
  isAdmin: boolean;
}
