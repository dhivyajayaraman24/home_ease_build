import { authenticationRequired, invalidToken } from "../../shared/errors";
import { type QueryableDatabase } from "../../db/client";
import { type PlatformRole, normalizeRoles } from "./roles";

export interface JwtClaims {
  sub?: string;
  iss?: string;
  aud?: string | string[];
  exp?: number;
  nbf?: number;
  iat?: number;
  email?: string;
  name?: string;
  roles?: string[];
  branch_ids?: string[];
  branchIds?: string[];
  [claim: string]: unknown;
}

export interface JwtVerifier {
  verify(token: string): Promise<JwtClaims>;
}

export interface OidcJwtVerifierConfig {
  issuer: string;
  audience: string;
  clockSkewSeconds?: number;
  verifySignature?: (token: string, header: Record<string, unknown>, claims: JwtClaims) => Promise<void>;
}

export interface UserAccessRecord {
  userId: string;
  subject: string;
  email: string;
  displayName: string;
  status: "invited" | "active" | "disabled";
  roles: PlatformRole[];
  branchIds: string[];
  homeBranchId?: string;
}

export interface UserAccessRepository {
  findByIdentitySubject(subject: string): Promise<UserAccessRecord | null>;
}

export interface AuthenticatedPrincipal {
  userId?: string;
  subject: string;
  email?: string;
  displayName?: string;
  roles: PlatformRole[];
  branchIds: string[];
  homeBranchId?: string;
  claims: JwtClaims;
}

export interface AuthenticationContext {
  principal: AuthenticatedPrincipal;
  token: string;
}

export interface AuthenticationDependencies {
  jwtVerifier: JwtVerifier;
  users?: UserAccessRepository;
}

export interface HeaderCarrier {
  headers?: Record<string, string | string[] | undefined>;
}

interface UserAccessRow {
  user_id: string;
  subject: string;
  email: string;
  display_name: string;
  status: "invited" | "active" | "disabled";
  home_branch_id: string | null;
  roles: string[] | null;
  branch_ids: string[] | null;
}

function base64UrlDecode(value: string): string {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");

  return Buffer.from(padded, "base64").toString("utf8");
}

function parseJwtSegment<T>(segment: string): T {
  try {
    return JSON.parse(base64UrlDecode(segment)) as T;
  } catch {
    throw invalidToken();
  }
}

function toArray(value: unknown): string[] {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.filter((entry): entry is string => typeof entry === "string");
  }

  return typeof value === "string" ? [value] : [];
}

function assertClaimSet(token: string): { header: Record<string, unknown>; claims: JwtClaims } {
  const segments = token.split(".");

  if (segments.length !== 3) {
    throw invalidToken();
  }

  return {
    header: parseJwtSegment<Record<string, unknown>>(segments[0]),
    claims: parseJwtSegment<JwtClaims>(segments[1])
  };
}

function assertIssuerAndAudience(claims: JwtClaims, config: OidcJwtVerifierConfig): void {
  if (claims.iss !== config.issuer) {
    throw invalidToken();
  }

  const audiences = toArray(claims.aud);
  if (!audiences.includes(config.audience)) {
    throw invalidToken();
  }
}

function assertTokenWindow(claims: JwtClaims, clockSkewSeconds: number): void {
  const nowSeconds = Math.floor(Date.now() / 1000);

  if (claims.exp !== undefined && claims.exp + clockSkewSeconds < nowSeconds) {
    throw invalidToken();
  }

  if (claims.nbf !== undefined && claims.nbf - clockSkewSeconds > nowSeconds) {
    throw invalidToken();
  }
}

export function createOidcJwtVerifier(config: OidcJwtVerifierConfig): JwtVerifier {
  return {
    async verify(token: string): Promise<JwtClaims> {
      const { header, claims } = assertClaimSet(token);
      assertIssuerAndAudience(claims, config);
      assertTokenWindow(claims, config.clockSkewSeconds ?? 60);
      await config.verifySignature?.(token, header, claims);

      if (!claims.sub) {
        throw invalidToken();
      }

      return claims;
    }
  };
}

export function getBearerToken(authorizationHeader?: string | string[]): string {
  const headerValue = Array.isArray(authorizationHeader) ? authorizationHeader[0] : authorizationHeader;

  if (!headerValue?.startsWith("Bearer ")) {
    throw authenticationRequired();
  }

  const token = headerValue.slice("Bearer ".length).trim();
  if (!token) {
    throw authenticationRequired();
  }

  return token;
}

export async function authenticateBearerToken(
  authorizationHeader: string | string[] | undefined,
  dependencies: AuthenticationDependencies
): Promise<AuthenticationContext> {
  const token = getBearerToken(authorizationHeader);
  const claims = await dependencies.jwtVerifier.verify(token);

  if (!claims.sub) {
    throw invalidToken();
  }

  const user = await dependencies.users?.findByIdentitySubject(claims.sub);
  if (user?.status === "disabled") {
    throw invalidToken("The user account is disabled.");
  }

  const claimBranchIds = [...toArray(claims.branch_ids), ...toArray(claims.branchIds)];
  const principal: AuthenticatedPrincipal = user
    ? {
        userId: user.userId,
        subject: user.subject,
        email: user.email,
        displayName: user.displayName,
        roles: user.roles,
        branchIds: user.branchIds,
        homeBranchId: user.homeBranchId,
        claims
      }
    : {
        subject: claims.sub,
        email: typeof claims.email === "string" ? claims.email : undefined,
        displayName: typeof claims.name === "string" ? claims.name : undefined,
        roles: normalizeRoles(toArray(claims.roles)),
        branchIds: [...new Set(claimBranchIds)],
        claims
      };

  return { principal, token };
}

export async function authenticateRequest(
  request: HeaderCarrier,
  dependencies: AuthenticationDependencies
): Promise<AuthenticationContext> {
  return authenticateBearerToken(request.headers?.authorization, dependencies);
}

export function createDatabaseUserAccessRepository(database: QueryableDatabase): UserAccessRepository {
  return {
    async findByIdentitySubject(subject: string): Promise<UserAccessRecord | null> {
      const result = await database.query<UserAccessRow>(
        `SELECT
          users.id::text AS user_id,
          users.identity_subject AS subject,
          users.email,
          users.display_name,
          users.status,
          users.home_branch_id::text,
          COALESCE(array_agg(DISTINCT roles.key) FILTER (WHERE roles.key IS NOT NULL), '{}') AS roles,
          COALESCE(
            array_agg(DISTINCT branch_assignments.branch_id::text)
              FILTER (WHERE branch_assignments.assignment_status = 'active'),
            '{}'
          ) AS branch_ids
        FROM users
        LEFT JOIN user_roles ON user_roles.user_id = users.id
        LEFT JOIN roles ON roles.id = user_roles.role_id
        LEFT JOIN branch_assignments ON branch_assignments.user_id = users.id
        WHERE users.identity_subject = $1
        GROUP BY users.id`,
        [subject]
      );
      const row = result.rows[0];

      if (!row) {
        return null;
      }

      return {
        userId: row.user_id,
        subject: row.subject,
        email: row.email,
        displayName: row.display_name,
        status: row.status,
        homeBranchId: row.home_branch_id ?? undefined,
        roles: normalizeRoles(row.roles ?? []),
        branchIds: [...new Set(row.branch_ids ?? [])]
      };
    }
  };
}
