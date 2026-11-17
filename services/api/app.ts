import { type AuthorizationPolicy } from "./modules/access-control/authorization";
import { PLATFORM_ROLES } from "./modules/access-control/roles";

export interface ApiRoute {
  method: "*" | "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  module: string;
  protected: boolean;
  authorization?: AuthorizationPolicy;
}

export const apiV1Routes: ApiRoute[] = [
  { method: "GET", path: "/api/v1", module: "platform", protected: false },
  {
    method: "GET",
    path: "/api/v1/access-control",
    module: "access-control",
    protected: true,
    authorization: { roles: PLATFORM_ROLES }
  },
  {
    method: "GET",
    path: "/api/v1/audit",
    module: "audit",
    protected: true,
    authorization: { roles: ["owner-admin", "branch-manager"] }
  }
];

export function createApiApp() {
  return {
    name: "Pulse Fit API",
    version: "v1",
    healthPath: "/health",
    apiRoot: "/api/v1",
    auth: {
      scheme: "Bearer",
      provider: "OIDC/JWT"
    },
    routes: apiV1Routes
  };
}
