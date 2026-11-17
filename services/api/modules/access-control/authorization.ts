import { branchScopeForbidden, forbidden } from "../../shared/errors";
import { type AuthenticatedPrincipal } from "./authMiddleware";
import { type PlatformRole, hasOwnerAdminRole, hasRole } from "./roles";

export interface AccessDecision {
  allowed: boolean;
  reason: string;
}

export interface AuthorizationPolicy {
  roles?: readonly PlatformRole[];
  branchId?: string;
}

export type AuthorizationGuard = (principal: AuthenticatedPrincipal) => AccessDecision;

export function canUseRole(
  principal: AuthenticatedPrincipal,
  allowedRoles: readonly PlatformRole[]
): AccessDecision {
  const allowed = hasRole(principal.roles, allowedRoles);

  return {
    allowed,
    reason: allowed ? "role_allowed" : "role_denied"
  };
}

export function canAccessBranch(principal: AuthenticatedPrincipal, branchId: string): AccessDecision {
  if (hasOwnerAdminRole(principal.roles)) {
    return { allowed: true, reason: "owner_admin_cross_branch" };
  }

  const allowed = principal.branchIds.includes(branchId);

  return {
    allowed,
    reason: allowed ? "branch_scope_matched" : "branch_scope_denied"
  };
}

export function authorize(principal: AuthenticatedPrincipal, policy: AuthorizationPolicy): AccessDecision {
  if (policy.roles) {
    const roleDecision = canUseRole(principal, policy.roles);
    if (!roleDecision.allowed) {
      return roleDecision;
    }
  }

  if (policy.branchId) {
    return canAccessBranch(principal, policy.branchId);
  }

  return { allowed: true, reason: "authorized" };
}

export function requireAuthorization(principal: AuthenticatedPrincipal, policy: AuthorizationPolicy): void {
  const decision = authorize(principal, policy);

  if (decision.allowed) {
    return;
  }

  if (decision.reason === "branch_scope_denied") {
    throw branchScopeForbidden();
  }

  throw forbidden();
}

export function requireAnyRole(...roles: PlatformRole[]): AuthorizationGuard {
  return (principal) => canUseRole(principal, roles);
}

export function requireBranchScope(branchId: string): AuthorizationGuard {
  return (principal) => canAccessBranch(principal, branchId);
}

export function requireRoleForBranch(roles: readonly PlatformRole[], branchId: string): AuthorizationGuard {
  return (principal) => authorize(principal, { roles, branchId });
}

export function assertGuard(principal: AuthenticatedPrincipal, guard: AuthorizationGuard): void {
  const decision = guard(principal);

  if (decision.allowed) {
    return;
  }

  if (decision.reason === "branch_scope_denied") {
    throw branchScopeForbidden();
  }

  throw forbidden();
}
