export interface ApiRoute {
  method: "*" | "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  module: string;
}

export const apiV1Routes: ApiRoute[] = [
  { method: "GET", path: "/api/v1", module: "platform" },
  { method: "GET", path: "/api/v1/access-control", module: "access-control" },
  { method: "GET", path: "/api/v1/audit", module: "audit" }
];

export function createApiApp() {
  return {
    name: "Pulse Fit API",
    version: "v1",
    healthPath: "/health",
    apiRoot: "/api/v1",
    routes: apiV1Routes
  };
}
