export const PLATFORM_ROLES = [
  "owner-admin",
  "branch-manager",
  "front-desk",
  "trainer",
  "member"
] as const;

export type PlatformRole = (typeof PLATFORM_ROLES)[number];

export interface RoleDefinition {
  key: PlatformRole;
  name: string;
  description: string;
  branchScoped: boolean;
}

export const ROLE_DEFINITIONS: Record<PlatformRole, RoleDefinition> = {
  "owner-admin": {
    key: "owner-admin",
    name: "Owner/Admin",
    description: "Central administrator with cross-branch access.",
    branchScoped: false
  },
  "branch-manager": {
    key: "branch-manager",
    name: "Branch Manager",
    description: "Manager for assigned branch operations and reporting.",
    branchScoped: true
  },
  "front-desk": {
    key: "front-desk",
    name: "Front Desk",
    description: "Front-desk staff for branch member and payment workflows.",
    branchScoped: true
  },
  trainer: {
    key: "trainer",
    name: "Trainer",
    description: "Trainer for branch class, roster, and schedule workflows.",
    branchScoped: true
  },
  member: {
    key: "member",
    name: "Member",
    description: "Gym member with self-service access to their own records.",
    branchScoped: true
  }
};

const platformRoleSet = new Set<string>(PLATFORM_ROLES);

export function isPlatformRole(value: string): value is PlatformRole {
  return platformRoleSet.has(value);
}

export function normalizeRoles(values: readonly string[] = []): PlatformRole[] {
  return [...new Set(values.filter(isPlatformRole))];
}

export function isBranchScopedRole(role: PlatformRole): boolean {
  return ROLE_DEFINITIONS[role].branchScoped;
}

export function hasRole(userRoles: readonly PlatformRole[], allowedRoles: readonly PlatformRole[]): boolean {
  return allowedRoles.some((role) => userRoles.includes(role));
}

export function hasOwnerAdminRole(userRoles: readonly PlatformRole[]): boolean {
  return userRoles.includes("owner-admin");
}
