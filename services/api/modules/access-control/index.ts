export type PlatformRole = "owner-admin" | "branch-manager" | "front-desk" | "trainer" | "member";

export interface AccessDecision {
  allowed: boolean;
  reason: string;
}

export function canAccessBranch(userBranchIds: string[], requestedBranchId: string): AccessDecision {
  const allowed = userBranchIds.includes(requestedBranchId);
  return {
    allowed,
    reason: allowed ? "branch_scope_matched" : "branch_scope_denied"
  };
}
