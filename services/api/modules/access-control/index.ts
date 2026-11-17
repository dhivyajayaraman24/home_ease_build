export {
  PLATFORM_ROLES,
  ROLE_DEFINITIONS,
  type PlatformRole,
  hasOwnerAdminRole,
  hasRole,
  isBranchScopedRole,
  isPlatformRole,
  normalizeRoles
} from "./roles";

export {
  type AccessDecision,
  type AuthorizationGuard,
  type AuthorizationPolicy,
  assertGuard,
  authorize,
  canAccessBranch,
  canUseRole,
  requireAnyRole,
  requireAuthorization,
  requireBranchScope,
  requireRoleForBranch
} from "./authorization";

export {
  type AuthenticatedPrincipal,
  type AuthenticationContext,
  type AuthenticationDependencies,
  type JwtClaims,
  type JwtVerifier,
  type OidcJwtVerifierConfig,
  type UserAccessRecord,
  type UserAccessRepository,
  authenticateBearerToken,
  authenticateRequest,
  createDatabaseUserAccessRepository,
  createOidcJwtVerifier,
  getBearerToken
} from "./authMiddleware";
