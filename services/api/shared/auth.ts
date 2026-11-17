export interface AuthenticatedPrincipal {
  subject: string;
  roles: string[];
  branchIds: string[];
}

export function requireBearerToken(authorizationHeader?: string) {
  if (!authorizationHeader?.startsWith("Bearer ")) {
    throw new Error("Authorization bearer token is required");
  }

  return authorizationHeader.slice("Bearer ".length);
}
