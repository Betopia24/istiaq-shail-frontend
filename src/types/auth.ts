/** Roles from the API (`AuthResult.role`). `super_admin` runs the platform; the others belong to an agency. */
export type AuthRole = "owner" | "administrator" | "valuer" | "negotiator" | "super_admin";

/** What the browser knows about the signed-in user. No tokens: those stay in httpOnly cookies. */
export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: AuthRole | null;
  agencyId: string | null;
}

/** API error body (`Error` in openapi.yaml). */
export interface ApiErrorBody {
  code: string;
  message: string;
  fields?: Record<string, string>;
}

export const isSuperAdmin = (user: Pick<SessionUser, "role"> | null | undefined) => user?.role === "super_admin";

export const ROLE_LABEL: Record<AuthRole, string> = {
  owner: "Owner",
  administrator: "Administrator",
  valuer: "Valuer",
  negotiator: "Negotiator",
  super_admin: "Super Admin",
};
