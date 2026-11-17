import { createServer } from "node:http";

const port = Number.parseInt(process.env.PORT ?? "3000", 10);

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, { "content-type": "application/json" });
  response.end(JSON.stringify(payload));
}

export function createServerHandler() {
  return function handleRequest(request, response) {
    const url = new URL(request.url ?? "/", `http://${request.headers.host ?? "localhost"}`);

    if (request.method === "GET" && url.pathname === "/health") {
      sendJson(response, 200, { status: "ok", service: "api" });
      return;
    }

    if (request.method === "GET" && url.pathname === "/api/v1") {
      sendJson(response, 200, {
        name: "Pulse Fit API",
        version: "v1",
        routes: ["/api/v1/access-control", "/api/v1/audit"]
      });
      return;
    }

    if (request.method === "GET" && url.pathname.startsWith("/api/v1/")) {
      sendJson(response, 200, {
        namespace: "/api/v1",
        path: url.pathname,
        status: "mounted"
      });
      return;
    }

    sendJson(response, 404, { error: "not_found" });
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const server = createServer(createServerHandler());
  server.listen(port, () => {
    console.log(`Pulse Fit API listening on http://localhost:${port}`);
  });
}
