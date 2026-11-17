export interface ApiClientOptions {
  baseUrl: string;
  accessToken?: string;
}

export interface ApiClientRequest {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  body?: unknown;
}

export function createApiClient(options: ApiClientOptions) {
  const apiRoot = `${options.baseUrl.replace(/\/$/, "")}/api/v1`;

  return {
    apiRoot,
    createRequest({ method = "GET", path, body }: ApiClientRequest) {
      return {
        method,
        url: `${apiRoot}${path.startsWith("/") ? path : `/${path}`}`,
        headers: {
          "content-type": "application/json",
          ...(options.accessToken ? { authorization: `Bearer ${options.accessToken}` } : {})
        },
        body
      };
    }
  };
}
