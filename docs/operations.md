# Pulse Fit Operations

## Local Setup

Use Node.js 20 or newer from the repository root.

```bash
npm install
npm run lint
npm run typecheck
npm test
npm run build
```

Run the API locally with:

```bash
npm run start:api
```

The API migration runner requires PostgreSQL connection settings:

```bash
DATABASE_URL=postgres://pulse_fit:local@localhost:5432/pulse_fit npm run db:migrate --workspace @pulse-fit/api
```

Use `DATABASE_SSL=true` only for hosted databases that require TLS.

## Quality Gates

Pull requests and pushes to `main` run GitHub Actions quality gates for linting, type surface checks, tests,
builds, migration validation, a high-severity npm audit hook, and CycloneDX SBOM generation.

Run the main local CI path with:

```bash
npm run ci
```

Migration validation checks that SQL migration files are present, consistently named, non-empty, uniquely
versioned, and continue to maintain `schema_migrations`.

## Secrets Handling

Keep secrets in the deployment environment or the GitHub Actions secret store. Do not commit `.env` files,
database URLs, OIDC client secrets, bearer tokens, payment processor secrets, card data, or unrestricted member
contact details.

Logs must use `services/api/shared/logger.ts`. The logger emits structured JSON with correlation IDs and redacts
sensitive keys such as tokens, secrets, passwords, payment fields, emails, phone numbers, addresses, and generic
contact payloads. User and branch IDs are hashed before logging so operators can correlate events without exposing
raw identity values.

Use request or correlation IDs when investigating incidents, then pivot to audit records for authorized actor and
branch context. Audit logs should store only the minimum scoped identifiers required for accountability.
