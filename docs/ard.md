# Architecture Requirements Document (ARD)

> Replace all `<PLACEHOLDER>` values. Every material architecture decision or constraint should have a stable ID that feature specifications can reference.

## Document Metadata

- **Product/Application:** Gym Management Platform
- **Document ID:** ARD-GMP
- **Version:** 0.1
- **Status:** Draft
- **Architecture Owner:** TBD; owner tracked in ARC-OQ-001
- **Contributors:** Product Owner, Engineering Lead, Security Reviewer; named contributors tracked in ARC-OQ-002
- **Last Updated:** 2026-11-17
- **Reference PRD:** `PRD.md`

---

## 1. Architecture Summary

The Gym Management Platform will be implemented as a multi-app, managed-cloud platform for a single gym brand with centrally managed branches. The MVP includes a React Native Member Mobile App, React responsive web applications for the Front-Desk/Trainer App and Management Portal, and a Node.js/TypeScript modular monolith backend hosted on managed cloud containers. PostgreSQL is the primary system of record.

The backend will separate business domains into modules for membership, payments, bookings, QR check-ins, trainer schedules, leads, reporting, notifications, branch administration, and access control. Apps will integrate through versioned REST APIs under `/api/v1`; external payment and notification providers will be isolated behind provider adapter interfaces. Real-time dashboards will use operational read models or materialized views updated transactionally or near-real-time.

Key architecture drivers are MVP delivery across three applications, strong security and privacy controls, role- and branch-scoped access, online and offline payment reconciliation, QR-based operational workflows, provider flexibility, measurable performance, and pilot-first rollout.

## 2. Architecture Drivers

- PRD-FR-001 — Centralized membership lifecycle management must drive consistent member state decisions across renewals, bookings, and check-ins.
- PRD-FR-002 — Online and staff-recorded offline payments must share a consistent transaction and status model.
- PRD-FR-003 — Payment reconciliation must combine online and offline payments by branch, member, status, and date.
- PRD-FR-004 — Fixed-capacity class booking requires reliable capacity enforcement and staff-visible rosters.
- PRD-FR-005 — QR check-ins require fast membership validation and check-in recording at branch entry.
- PRD-FR-006 — Notifications require in-app, email, and SMS delivery through configurable providers.
- PRD-FR-007 — Lead management requires capture, assignment, follow-up logging, and conversion to member records.
- PRD-FR-008 — Real-time dashboards require timely operational reporting across memberships, revenue, bookings, check-ins, leads, and branches.
- PRD-FR-009 — Centralized multi-branch management requires branch-scoped data modeling and cross-branch administration.
- PRD-FR-010 — Role-based access control must protect member, staff, payment, lead, booking, check-in, and branch data.
- PRD-FR-011 — Trainer schedules require staff app access to assigned schedules and rosters.
- PRD-NFR-001 — Security and privacy controls require authenticated access and server-side role and branch authorization.
- PRD-NFR-002 — Member, lead, payment, and branch information must be visible only to authorized users.
- CON-001 — The Member Mobile App, Front-Desk/Trainer App, and Management Portal must launch together with equal MVP priority.
- CON-002 — The platform must support one gym brand with centrally managed branches, not independent multi-tenant brands.
- CON-003 — Rollout must begin with a pilot branch before phased rollout to all branches.
- CON-004 — Online payments depend on payment gateway availability and integration readiness.
- CON-005 — Email and SMS notifications depend on configured provider availability.
- CON-006 — Advanced commissions and advanced automation are excluded from the MVP.

## 3. Architecture Principles

1. Protect member, payment, staff, lead, and branch data through least-privilege server-side authorization.
2. Keep provider integrations replaceable through internal adapter interfaces and environment-level configuration.
3. Reuse established repository and platform patterns where appropriate.
4. Keep presentation, orchestration, domain, integration, and persistence concerns separated.
5. Prefer modular monolith boundaries for MVP delivery speed while preserving future extraction paths.
6. Keep operational reporting close to the transactional system until scale requires a separate analytics platform.

## 4. System Context

### 4.1 Actors

- Gym Member — Uses the Member Mobile App to renew memberships, make online payments, book classes, receive notifications, and present QR codes for check-in.
- Front-Desk Staff — Uses the Front-Desk/Trainer App to manage member operations, record offline payments, validate QR check-ins, view rosters, mark attendance, and manage leads.
- Trainer — Uses the Front-Desk/Trainer App to view assigned schedules and related class rosters.
- Branch Manager — Uses the Management Portal to monitor assigned branch operations, leads, payments, bookings, check-ins, and reports.
- Owner/Admin — Uses the Management Portal to manage branches, roles, users, and cross-branch performance.
- Payment Gateway — Processes member-initiated online payments and sends payment status callbacks.
- Email Provider — Sends customer email notifications for operational events.
- SMS Provider — Sends customer SMS notifications for operational events.
- Identity Service — Authenticates users and issues tokens for app access.
- Mobile Device Camera/Scanner — Captures QR codes for check-in validation in the staff app.

### 4.2 External Systems

| ID | System | Purpose | Interface | Owner |
|---|---|---|---|---|
| EXT-001 | Payment Gateway | Process online membership and renewal payments; publish payment status callbacks | REST/Webhook | Provider TBD; owner tracked in ARC-OQ-004 |
| EXT-002 | Email Provider | Send email notifications and return delivery status when available | REST/Event/Webhook | Provider TBD; owner tracked in ARC-OQ-004 |
| EXT-003 | SMS Provider | Send SMS notifications and return delivery status when available | REST/Event/Webhook | Provider TBD; owner tracked in ARC-OQ-004 |
| EXT-004 | Identity Service | Provide OIDC/JWT authentication for all apps | OIDC/REST | Provider TBD; owner tracked in ARC-OQ-004 |
| EXT-005 | Mobile Device Camera/Scanner | Capture member QR codes for check-in | Device API | User device / app platform |
| EXT-006 | Managed Cloud Platform | Host containers, database, storage, networking, secrets, logs, metrics, and deployment infrastructure | Cloud APIs | Cloud provider TBD; owner tracked in ARC-OQ-005 |

## 5. Technology Stack

| Layer | Technology | Version/Constraint | Rationale |
|---|---|---|---|
| Frontend | React Native for Member Mobile App; React for Front-Desk/Trainer App and Management Portal | Current stable/LTS versions selected at implementation; exact versions tracked in ARC-OQ-003 | Supports cross-platform member app and responsive web apps while sharing frontend engineering patterns |
| Backend | Node.js with TypeScript modular monolith | Node.js LTS; exact framework/version tracked in ARC-OQ-003 | Fits REST API delivery, modular domain boundaries, provider adapters, and efficient MVP implementation |
| Data | PostgreSQL | Managed PostgreSQL; exact version tracked in ARC-OQ-003 | Relational integrity supports memberships, payments, bookings, leads, branch scoping, and reporting read models |
| Hosting | Managed cloud containers | Cloud provider TBD; managed container runtime required | Provides operational control, scalability, CI/CD compatibility, and rollback options without self-managed servers |
| Identity | OIDC/JWT-capable central identity service | Provider TBD; must support roles/claims or application role mapping | Enables consistent authentication across mobile and web apps |
| Observability | Managed logging, metrics, tracing, and alerting stack | Provider/tooling TBD; must support structured logs and sensitive-data restrictions | Required for production operations and measurable reliability validation |
| CI/CD | Automated build, test, scan, migration, and deployment pipeline | Tooling TBD; must support dev/test/stage/prod promotion | Required for controlled pilot and phased rollout |
| Infrastructure | Infrastructure as code | Tool TBD; must provision cloud, database, secrets, networking, and observability resources | Required for repeatable environments and auditability |

## 6. Logical Architecture

### 6.1 Components

#### COMP-001 — Member Mobile App

- **Responsibility:** Provide member self-service for membership status, renewals, online payments, class booking, QR code presentation, and notifications.
- **Inputs:** Member actions, authentication tokens, membership/payment/booking/notification API responses.
- **Outputs:** API requests for renewals, payments, bookings, QR display data, and notification reads.
- **Dependencies:** COMP-004, COMP-005, EXT-004, device storage, device camera/display capabilities.
- **Repository Area:** `apps/member-mobile`

#### COMP-002 — Front-Desk/Trainer App

- **Responsibility:** Support daily staff and trainer workflows including member lookup, offline payment recording, QR validation, class roster viewing, attendance marking, lead follow-up, and trainer schedule visibility.
- **Inputs:** Staff/trainer actions, QR scan data, authentication tokens, operational API responses.
- **Outputs:** API requests for payments, check-ins, attendance, lead updates, and schedule queries.
- **Dependencies:** COMP-004, COMP-005, EXT-004, EXT-005.
- **Repository Area:** `apps/staff-web`

#### COMP-003 — Management Portal

- **Responsibility:** Provide owner/admin and branch manager workflows for branch management, role administration, reports, dashboards, reconciliation, and lead oversight.
- **Inputs:** Management actions, authentication tokens, dashboard/report API responses.
- **Outputs:** API requests for branch/user administration, reporting filters, lead assignment, and reconciliation views.
- **Dependencies:** COMP-004, COMP-005, EXT-004.
- **Repository Area:** `apps/management-web`

#### COMP-004 — API Gateway and Backend Application

- **Responsibility:** Expose versioned REST APIs, enforce authentication and authorization, orchestrate domain modules, validate requests, and coordinate transactions.
- **Inputs:** REST requests from apps, provider webhooks, authentication tokens.
- **Outputs:** REST responses, domain events/internal notifications, persistence operations, provider adapter calls.
- **Dependencies:** COMP-005, COMP-006 through COMP-014, EXT-001, EXT-002, EXT-003, EXT-004.
- **Repository Area:** `services/api`

#### COMP-005 — PostgreSQL Operational Database

- **Responsibility:** Store core system-of-record data for branches, users, roles, members, memberships, payments, bookings, check-ins, leads, notifications, schedules, and reporting read models.
- **Inputs:** Persistence commands from backend modules, migration scripts.
- **Outputs:** Transactional query results, reporting read model results, audit records.
- **Dependencies:** Managed PostgreSQL on EXT-006.
- **Repository Area:** `services/api/db`

#### COMP-006 — Membership Module

- **Responsibility:** Manage member profiles, plans, renewal status, and membership states.
- **Inputs:** Member/staff/admin requests, payment status updates, migration imports.
- **Outputs:** Membership records, status flags, eligibility decisions for bookings and check-ins.
- **Dependencies:** COMP-005, COMP-010, COMP-014.
- **Repository Area:** `services/api/modules/membership`

#### COMP-007 — Payment and Reconciliation Module

- **Responsibility:** Manage online payment initiation, payment callbacks, offline payment recording, payment status, and reconciliation reports.
- **Inputs:** Member payment requests, staff offline payment records, payment gateway webhooks.
- **Outputs:** Payment transactions, reconciliation report rows, membership renewal status updates, notification events.
- **Dependencies:** COMP-005, COMP-006, COMP-012, COMP-014, EXT-001.
- **Repository Area:** `services/api/modules/payments`

#### COMP-008 — Booking and Attendance Module

- **Responsibility:** Manage fixed-capacity classes, bookings, rosters, and attendance marking.
- **Inputs:** Member booking requests, staff roster and attendance actions, membership eligibility checks.
- **Outputs:** Booking records, roster views, attendance records, notification events.
- **Dependencies:** COMP-005, COMP-006, COMP-012, COMP-014.
- **Repository Area:** `services/api/modules/bookings`

#### COMP-009 — QR Check-In Module

- **Responsibility:** Validate QR check-ins against member identity, branch context, and membership state, then record check-in outcomes.
- **Inputs:** QR scan payloads, staff branch context, membership eligibility data.
- **Outputs:** Successful check-in records or blocked/flagged check-in results.
- **Dependencies:** COMP-005, COMP-006, COMP-014, EXT-005.
- **Repository Area:** `services/api/modules/checkins`

#### COMP-010 — Branch and Access Control Module

- **Responsibility:** Manage branches, users, roles, branch assignments, and server-side authorization policies.
- **Inputs:** Authenticated user claims, admin role assignments, branch management actions.
- **Outputs:** Authorization decisions, user/role/branch records, audit events.
- **Dependencies:** COMP-005, EXT-004.
- **Repository Area:** `services/api/modules/access-control`

#### COMP-011 — Lead Management Module

- **Responsibility:** Capture leads, assign staff ownership, track status, log follow-ups, and convert leads into member records.
- **Inputs:** Staff lead records, lead assignment actions, follow-up updates, conversion requests.
- **Outputs:** Lead records, follow-up history, member creation requests, dashboard metrics.
- **Dependencies:** COMP-005, COMP-006, COMP-010, COMP-014.
- **Repository Area:** `services/api/modules/leads`

#### COMP-012 — Notification Module

- **Responsibility:** Create in-app notifications and send email/SMS messages for operational events.
- **Inputs:** Domain notification events, provider delivery callbacks, user communication preferences where available.
- **Outputs:** In-app notifications, email/SMS requests, delivery status records.
- **Dependencies:** COMP-005, EXT-002, EXT-003.
- **Repository Area:** `services/api/modules/notifications`

#### COMP-013 — Reporting Module

- **Responsibility:** Provide dashboard and report APIs for memberships, revenue, bookings, check-ins, leads, branch performance, and reconciliation.
- **Inputs:** Operational data changes, report filters, branch/role context.
- **Outputs:** Dashboard summaries, filtered reports, read model refreshes.
- **Dependencies:** COMP-005, COMP-010.
- **Repository Area:** `services/api/modules/reporting`

#### COMP-014 — Audit Logging Module

- **Responsibility:** Record security-sensitive and business-critical actions including authentication-relevant events, role changes, payment changes, membership changes, branch administration, and data access decisions where required.
- **Inputs:** Domain audit events, authorization outcomes, provider callback processing events.
- **Outputs:** Immutable or append-only audit log records available to authorized administrators.
- **Dependencies:** COMP-005, COMP-010.
- **Repository Area:** `services/api/modules/audit`

#### COMP-015 — Trainer Schedule Module

- **Responsibility:** Store and expose trainer schedule and roster visibility for assigned classes.
- **Inputs:** Staff/admin schedule records, trainer queries, class roster links.
- **Outputs:** Trainer schedule views and related roster data.
- **Dependencies:** COMP-005, COMP-008, COMP-010.
- **Repository Area:** `services/api/modules/trainer-schedules`

### 6.2 Data Flow

1. A user authenticates through EXT-004 and receives an OIDC/JWT token for the appropriate app.
2. COMP-001, COMP-002, or COMP-003 sends a versioned REST request to COMP-004 with the token and branch/app context.
3. COMP-004 validates the token and calls COMP-010 to enforce role-based and branch-scoped authorization.
4. The relevant domain module validates business rules and reads/writes data in COMP-005.
5. COMP-007 calls EXT-001 through a payment adapter for online payment initiation and handles payment gateway webhooks through `/api/v1/webhooks/payments/{provider}`.
6. COMP-012 creates in-app notifications and calls EXT-002 or EXT-003 through notification adapters for email and SMS delivery.
7. COMP-009 validates QR scan payloads against membership state and branch context, then records successful, blocked, or flagged check-in outcomes.
8. COMP-013 reads operational data and reporting read models from COMP-005, applying branch-scoped authorization filters before returning dashboards.
9. COMP-014 records audit logs for sensitive actions and security-relevant events.

## 7. Architecture Decisions

### ARD-DEC-001 — Use a Modular Monolith Backend for MVP

- **Status:** Accepted
- **Related Requirements:** PRD-FR-001, PRD-FR-002, PRD-FR-004, PRD-FR-005, PRD-FR-007, PRD-FR-008, PRD-FR-009, PRD-FR-010, PRD-FR-011, PRD-NFR-001

**Decision**

Implement the backend as a Node.js/TypeScript modular monolith with explicit domain modules for membership, payments, bookings, check-ins, trainer schedules, leads, reporting, notifications, branch administration, access control, and audit logging.

**Rationale**

The MVP must launch three apps together while supporting multiple workflows. A modular monolith reduces distributed-system complexity, simplifies transactional consistency, and still preserves domain boundaries for future extraction if scale or team structure requires it.

**Consequences**

- Simplifies MVP delivery, deployment, local development, and transactional workflows.
- Requires disciplined module boundaries to avoid tight coupling.
- Future service extraction remains possible but is not optimized from day one.

**Alternatives Considered**

- Microservices per domain capability from day one — rejected because it increases delivery, testing, deployment, and observability complexity for MVP.
- Serverless functions by workflow — rejected because cross-domain consistency and role/branch authorization would be harder to keep uniform.
- Backend-as-a-service first — rejected because the domain workflows and security requirements require explicit server-side control.

### ARD-DEC-002 — Use Cross-Platform Mobile and Responsive Web Frontends

- **Status:** Accepted
- **Related Requirements:** PRD-FR-001, PRD-FR-004, PRD-FR-005, PRD-FR-008, PRD-FR-010, PRD-FR-011

**Decision**

Use React Native for the Member Mobile App and React responsive web applications for the Front-Desk/Trainer App and Management Portal.

**Rationale**

The member experience benefits from a mobile app for QR presentation and self-service, while staff/trainer and management workflows are well-suited to responsive web apps used at desks, tablets, or laptops.

**Consequences**

- Supports app-specific UX while sharing frontend skills and patterns.
- Requires coordinated release management across mobile and web surfaces.
- Native mobile store release timing may affect member app rollout.

**Alternatives Considered**

- Native iOS and Android apps — rejected for MVP because it increases build and release effort.
- Single responsive web/PWA for all personas — rejected because QR presentation and member mobile engagement benefit from a dedicated mobile app.

### ARD-DEC-003 — Use Managed Cloud Containers and PostgreSQL

- **Status:** Accepted
- **Related Requirements:** PRD-FR-001, PRD-FR-002, PRD-FR-003, PRD-FR-008, PRD-FR-009, PRD-NFR-001, PRD-NFR-002

**Decision**

Host the backend on managed cloud containers and use managed PostgreSQL as the primary system of record.

**Rationale**

Managed containers provide deployment control and portability, while PostgreSQL provides relational integrity for branch-scoped operational data, payment reconciliation, bookings, and reporting read models.

**Consequences**

- Reduces infrastructure operations compared with self-managed VMs.
- Requires cloud provider selection and IaC implementation before build-out.
- PostgreSQL schema design must account for branch scoping, indexes, and reporting views.

**Alternatives Considered**

- Self-hosted virtual machines — rejected because they increase operational burden.
- Serverless with NoSQL — rejected because relational workflows and reconciliation reporting benefit from transactional relational modeling.

### ARD-DEC-004 — Isolate External Providers Behind Adapters

- **Status:** Accepted
- **Related Requirements:** PRD-FR-002, PRD-FR-006, PRD-FR-005

**Decision**

Implement payment, email, SMS, and QR scanning integrations through internal adapter interfaces with provider selection configurable per environment.

**Rationale**

The PRD leaves exact providers open. Adapter boundaries allow provider selection or replacement without changing domain logic.

**Consequences**

- Reduces vendor lock-in and integration risk.
- Requires contract tests and provider-specific error mapping.
- Adapter abstractions must not hide required provider-specific security or compliance obligations.

**Alternatives Considered**

- Direct SDK/API calls inside domain modules — rejected because it couples business logic to specific providers.
- iPaaS mediation layer — rejected because it adds cost and complexity not justified by MVP scope.

### ARD-DEC-005 — Use Branch ID Scoping in a Single Database Schema

- **Status:** Accepted
- **Related Requirements:** PRD-FR-009, PRD-FR-010, PRD-NFR-001, PRD-NFR-002

**Decision**

Use a single PostgreSQL schema with `branch_id` scoping on branch-owned operational records and enforce role/branch authorization server-side.

**Rationale**

The platform serves one gym brand with centralized management, not independent tenants. Single-schema branch scoping supports cross-branch reporting while keeping authorization logic explicit.

**Consequences**

- Simplifies centralized reporting and shared administration.
- Requires consistent authorization filters in all APIs and reports.
- Requires tests for cross-branch access prevention.

**Alternatives Considered**

- Separate schema per branch — rejected because it complicates centralized reporting and administration.
- Separate database per branch — rejected because it adds unnecessary operational complexity for a single-brand platform.

### ARD-DEC-006 — Use Operational Read Models for Real-Time Dashboards

- **Status:** Accepted
- **Related Requirements:** PRD-FR-003, PRD-FR-008, PRD-FR-009

**Decision**

Support real-time dashboards with PostgreSQL operational read models/materialized views updated transactionally or near-real-time from operational data.

**Rationale**

MVP reporting needs timely operational visibility but does not require a separate analytics warehouse or event streaming platform from day one.

**Consequences**

- Reduces MVP architecture complexity.
- Dashboard freshness target must be validated through tests and monitoring.
- Heavy reporting queries require indexing and read model design to protect transactional performance.

**Alternatives Considered**

- Analytics warehouse and ETL pipeline — rejected for MVP because advanced analytics is out of scope.
- Event streaming reporting consumers — rejected because operational read models meet MVP real-time reporting needs with less complexity.

### ARD-DEC-007 — Use Central OIDC/JWT Authentication with Server-Side RBAC

- **Status:** Accepted
- **Related Requirements:** PRD-FR-010, PRD-NFR-001, PRD-NFR-002

**Decision**

Use a central identity service with OIDC/JWT authentication, application-managed RBAC roles, and branch-scoped authorization enforced on the backend.

**Rationale**

All apps need consistent authentication and role restrictions. Server-side authorization is required to protect member, payment, lead, staff, and branch data regardless of frontend behavior.

**Consequences**

- Provides consistent identity across mobile and web apps.
- Requires token validation, role mapping, branch assignment checks, and authorization tests.
- Identity provider selection remains open.

**Alternatives Considered**

- Custom username/password authentication — rejected because it increases security implementation burden.
- Separate authentication per app — rejected because it creates inconsistent identity and access-control behavior.

### ARD-DEC-008 — Use Automated CI/CD with IaC and Controlled Rollback

- **Status:** Accepted
- **Related Requirements:** PRD-NFR-001, PRD-NFR-002

**Decision**

Use dev/test/stage/prod environments with automated CI/CD, database migrations, blue-green or rolling deployment rollback, and infrastructure as code.

**Rationale**

The pilot-first rollout and privacy-sensitive workflows require repeatable deployments, controlled promotion, traceable infrastructure changes, and fast rollback.

**Consequences**

- Improves deployment reliability and auditability.
- Requires environment configuration discipline and migration rollback planning.
- Requires cloud and IaC tool decisions before implementation.

**Alternatives Considered**

- Manual deployment to dev/prod only — rejected because it increases operational risk.
- Single shared environment until pilot — rejected because it does not support safe testing or staged rollout.

## 8. API and Integration Architecture

### ARD-API-001 — Application REST API

- **Type:** REST
- **Operation/Topic:** `/api/v1/*`
- **Provider:** COMP-004
- **Consumers:** COMP-001, COMP-002, COMP-003
- **Authentication:** OIDC/JWT bearer tokens; server-side RBAC and branch authorization
- **Versioning:** URI versioning with `/api/v1`; breaking changes require a new major path

**Request/Input Contract**

JSON over HTTPS. Requests must include a bearer token. Mutating requests must include validated payloads and idempotency keys where retry could create duplicate business records, especially payment initiation and offline payment recording.

**Response/Output Contract**

JSON over HTTPS. Responses return resource representations, validation errors, authorization errors, or workflow results. List/report endpoints must apply branch and role filters before returning data.

**Error Handling**

Use consistent error codes for validation failure, authentication failure, authorization failure, not found, conflict, provider failure, and internal errors. Retriable operations must document idempotency behavior. Sensitive data must not appear in error responses.

### ARD-API-002 — Payment Gateway Integration

- **Type:** REST
- **Operation/Topic:** `/api/v1/payments`, `/api/v1/webhooks/payments/{provider}`
- **Provider:** COMP-007 / EXT-001
- **Consumers:** COMP-001, COMP-007, EXT-001
- **Authentication:** App API uses OIDC/JWT; provider callbacks use provider signature or equivalent webhook verification
- **Versioning:** Internal app API uses `/api/v1`; provider adapter maps provider-specific versions

**Request/Input Contract**

Payment initiation requests include member, membership/renewal context, branch context, amount, currency, and idempotency key. Webhooks include provider transaction ID, status, timestamp, and verification signature.

**Response/Output Contract**

Payment initiation returns payment session/redirect metadata where applicable and internal payment transaction ID. Webhook processing returns acknowledgement and updates payment status to pending, paid, failed, or recorded unsuccessful as applicable.

**Error Handling**

Payment initiation failures return provider-safe error states without exposing sensitive provider internals. Webhook handling must be idempotent by provider transaction ID and must reject invalid signatures.

### ARD-API-003 — Offline Payment Recording API

- **Type:** REST
- **Operation/Topic:** `POST /api/v1/members/{memberId}/offline-payments`
- **Provider:** COMP-007
- **Consumers:** COMP-002, COMP-003
- **Authentication:** OIDC/JWT with front-desk, branch manager, or owner/admin authorization
- **Versioning:** URI versioning with `/api/v1`

**Request/Input Contract**

JSON payload containing membership/renewal context, branch, payment method, amount, transaction date, and optional reference. Request must include an idempotency key.

**Response/Output Contract**

Returns created payment record, status, associated member, membership transaction, branch, and audit reference.

**Error Handling**

Reject unauthorized branch access, invalid membership context, duplicate idempotency keys with conflicting payloads, and invalid amounts. Record audit events for successful and failed authorization attempts where required.

### ARD-API-004 — Booking and Attendance API

- **Type:** REST
- **Operation/Topic:** `/api/v1/classes`, `/api/v1/bookings`, `/api/v1/classes/{classId}/attendance`
- **Provider:** COMP-008
- **Consumers:** COMP-001, COMP-002, COMP-003
- **Authentication:** OIDC/JWT with member, staff, trainer, branch manager, or owner/admin authorization by operation
- **Versioning:** URI versioning with `/api/v1`

**Request/Input Contract**

Booking requests include class ID and member context derived from token. Attendance requests include class ID, member IDs, attendance status, and staff/trainer context.

**Response/Output Contract**

Class listing returns capacity status. Booking returns confirmed booking or conflict. Roster and attendance responses return branch-scoped class participation records.

**Error Handling**

Reject ineligible memberships, full classes, unauthorized branch access, and duplicate bookings. Capacity conflicts must be handled transactionally.

### ARD-API-005 — QR Check-In API

- **Type:** REST
- **Operation/Topic:** `POST /api/v1/check-ins/qr`
- **Provider:** COMP-009
- **Consumers:** COMP-002
- **Authentication:** OIDC/JWT with front-desk, trainer, branch manager, or owner/admin authorization as configured
- **Versioning:** URI versioning with `/api/v1`

**Request/Input Contract**

JSON payload containing QR token/payload, branch context, scan timestamp, and scanning user context from token.

**Response/Output Contract**

Returns check-in result: successful, blocked, or flagged, with member identity summary, membership state, branch, timestamp, and check-in record ID when created.

**Error Handling**

Reject invalid or expired QR payloads, unauthorized branch access, and malformed scans. Expired, frozen, or unpaid memberships must return blocked or flagged outcomes according to policy.

### ARD-API-006 — Notification Provider Integration

- **Type:** REST/Event
- **Operation/Topic:** `/api/v1/notifications`, `/api/v1/webhooks/notifications/{provider}`
- **Provider:** COMP-012 / EXT-002 / EXT-003
- **Consumers:** COMP-006, COMP-007, COMP-008, COMP-011, COMP-012, EXT-002, EXT-003
- **Authentication:** Internal calls use service-internal authorization; provider callbacks use provider signature or equivalent verification
- **Versioning:** Internal app API uses `/api/v1`; provider adapter maps provider-specific versions

**Request/Input Contract**

Notification requests include recipient, channel, event type, template/key, business reference, and delivery metadata. Provider callbacks include provider message ID, status, timestamp, and signature where supported.

**Response/Output Contract**

Returns notification record ID, channel, event type, queued/sent/failed status, and delivery status when available.

**Error Handling**

Retry transient provider failures using bounded retry/backoff. Do not retry invalid recipient or template errors without data correction. Store failure status for operational visibility.

### ARD-API-007 — Reporting and Dashboard API

- **Type:** REST
- **Operation/Topic:** `/api/v1/reports/*`, `/api/v1/dashboards/*`
- **Provider:** COMP-013
- **Consumers:** COMP-003
- **Authentication:** OIDC/JWT with branch manager or owner/admin authorization
- **Versioning:** URI versioning with `/api/v1`

**Request/Input Contract**

Requests include report type, date range, branch filters, and pagination/export parameters where applicable. Branch filters must be authorized against user role and assignment.

**Response/Output Contract**

Returns dashboard summaries and report rows for memberships, revenue, bookings, check-ins, leads, branch performance, and payment reconciliation.

**Error Handling**

Reject unauthorized branch filters and invalid date ranges. Long-running or expensive reports must use pagination or asynchronous export if needed in later releases.

### ARD-API-008 — Lead Management API

- **Type:** REST
- **Operation/Topic:** `/api/v1/leads`, `/api/v1/leads/{leadId}/follow-ups`, `/api/v1/leads/{leadId}/convert`
- **Provider:** COMP-011
- **Consumers:** COMP-002, COMP-003
- **Authentication:** OIDC/JWT with front-desk, branch manager, or owner/admin authorization
- **Versioning:** URI versioning with `/api/v1`

**Request/Input Contract**

Lead requests include contact details, source/status fields, branch, assignee, follow-up notes, and conversion command details.

**Response/Output Contract**

Returns lead record, assignment, follow-up history, and linked member record ID after conversion.

**Error Handling**

Reject duplicate conversion attempts, unauthorized branch access, invalid assignees, and incomplete required contact fields. Conversion must be transactional to prevent partial lead/member states.

## 9. Data Architecture

### DATA-001 — Branch

- **Purpose:** Represent gym branches under the centrally managed single gym brand.
- **System of Record:** COMP-005 PostgreSQL Operational Database
- **Classification:** Internal
- **Retention:** Retain operational records for 7 years unless policy changes; assumption tracked in ARC-OQ-006
- **Key Relationships:** Users, members, leads, payments, bookings, check-ins, classes, schedules, reports

### DATA-002 — User and Role Assignment

- **Purpose:** Represent application users, roles, and branch assignments for access control.
- **System of Record:** COMP-005 PostgreSQL Operational Database with identity references from EXT-004
- **Classification:** Restricted
- **Retention:** Retain operational records for 7 years unless policy changes; assumption tracked in ARC-OQ-006
- **Key Relationships:** Branch, audit logs, staff/trainer schedules, lead assignments, payment/check-in actions

### DATA-003 — Member Profile

- **Purpose:** Store member identity, contact details, branch association, and membership relationships.
- **System of Record:** COMP-005 PostgreSQL Operational Database
- **Classification:** Confidential
- **Retention:** Retain operational records for 7 years unless policy changes; assumption tracked in ARC-OQ-006
- **Key Relationships:** Membership, payment, booking, check-in, notification, lead conversion

### DATA-004 — Membership

- **Purpose:** Store plan, renewal status, and membership state including active, expired, frozen, and unpaid.
- **System of Record:** COMP-005 PostgreSQL Operational Database
- **Classification:** Confidential
- **Retention:** Retain operational records for 7 years unless policy changes; assumption tracked in ARC-OQ-006
- **Key Relationships:** Member profile, payment transaction, booking eligibility, check-in validation

### DATA-005 — Payment Transaction

- **Purpose:** Store online and offline payment records, status, method, member, branch, and reconciliation attributes.
- **System of Record:** COMP-005 PostgreSQL Operational Database; payment processing reference from EXT-001
- **Classification:** Restricted
- **Retention:** Retain operational records for 7 years unless policy changes; assumption tracked in ARC-OQ-006
- **Key Relationships:** Member, membership, branch, reconciliation report, audit log, payment gateway transaction ID

### DATA-006 — Class and Booking

- **Purpose:** Store fixed-capacity class schedules, bookings, rosters, and attendance.
- **System of Record:** COMP-005 PostgreSQL Operational Database
- **Classification:** Internal
- **Retention:** Retain operational records for 7 years unless policy changes; assumption tracked in ARC-OQ-006
- **Key Relationships:** Member, trainer schedule, branch, attendance, notification

### DATA-007 — Check-In

- **Purpose:** Record QR check-in attempts and outcomes by member, branch, timestamp, and membership state.
- **System of Record:** COMP-005 PostgreSQL Operational Database
- **Classification:** Confidential
- **Retention:** Retain operational records for 7 years unless policy changes; assumption tracked in ARC-OQ-006
- **Key Relationships:** Member, membership, branch, staff user, audit log, reporting read model

### DATA-008 — Lead

- **Purpose:** Store enquiries, source/status, assignee, follow-up logs, and conversion link to member.
- **System of Record:** COMP-005 PostgreSQL Operational Database
- **Classification:** Confidential
- **Retention:** Retain operational records for 7 years unless policy changes; assumption tracked in ARC-OQ-006
- **Key Relationships:** Branch, staff assignee, follow-up records, converted member, reporting read model

### DATA-009 — Notification

- **Purpose:** Store in-app notifications and email/SMS delivery status for operational events.
- **System of Record:** COMP-005 PostgreSQL Operational Database with delivery references from EXT-002 and EXT-003
- **Classification:** Confidential
- **Retention:** Retain operational records for 7 years unless policy changes; assumption tracked in ARC-OQ-006
- **Key Relationships:** Member, event source, provider message ID, delivery status

### DATA-010 — Audit Log

- **Purpose:** Record security-sensitive and business-critical actions for traceability.
- **System of Record:** COMP-005 PostgreSQL Operational Database
- **Classification:** Restricted
- **Retention:** Retain operational records for 7 years unless policy changes; assumption tracked in ARC-OQ-006
- **Key Relationships:** User, branch, affected entity, action type, timestamp, authorization outcome

### DATA-011 — Reporting Read Model

- **Purpose:** Provide dashboard and report-optimized views for memberships, revenue, bookings, check-ins, leads, branch performance, and reconciliation.
- **System of Record:** Derived from COMP-005 operational data
- **Classification:** Confidential
- **Retention:** Retain according to source data retention and refresh policy; assumption tracked in ARC-OQ-006
- **Key Relationships:** Branch, member, payment, booking, check-in, lead, membership aggregates

### Data Migration

- **Required:** Yes
- **Approach:** Migrate required active members, branches, memberships, leads, and recent payment/booking history into PostgreSQL for pilot readiness. Validate migration through record counts, sample reconciliation, referential integrity checks, and business-owner sign-off. Exact source systems, data quality rules, and migration cutoff dates are open and tracked in ARC-OQ-007.

## 10. Security Architecture

### ARD-SEC-001 — Authentication, Authorization, and Branch Isolation

- **Related Requirements:** PRD-NFR-001, PRD-NFR-002, PRD-FR-010

The implementation must:

- Require authenticated access for member, staff, trainer, manager, and owner/admin application functions.
- Validate OIDC/JWT tokens on every protected backend API request.
- Enforce role-based authorization server-side for member, front-desk, trainer, branch manager, and owner/admin roles.
- Enforce branch-scoped access server-side for branch managers and branch-scoped staff users.
- Apply authorization filters consistently to transactional APIs, reports, dashboards, and exports.
- Record audit logs for role changes, branch assignment changes, payment changes, membership state changes, check-in decisions, and administrative actions.

The implementation must not:

- Trust frontend-only role checks as an authorization control.
- Allow branch-scoped users to query or infer another branch’s restricted operational data.
- Return restricted payment, member, lead, or branch data in unauthorized error responses.

### ARD-SEC-002 — Payment Data Protection

- **Related Requirements:** PRD-NFR-001, PRD-NFR-002, PRD-FR-002, PRD-FR-003

The implementation must:

- Use the payment gateway for online payment processing and store only gateway references/statuses required for operations and reconciliation.
- Verify payment provider webhook signatures or equivalent authenticity controls.
- Use idempotency controls for payment initiation, webhook processing, and offline payment recording.
- Restrict payment records to authorized operational and management users.

The implementation must not:

- Store raw card data or sensitive payment credentials in the platform.
- Log payment secrets, raw payment credentials, or provider signing secrets.

### ARD-SEC-003 — Secrets, Encryption, Scanning, and SBOM

- **Related Requirements:** PRD-NFR-001, PRD-NFR-002

The implementation must:

- Use TLS for data in transit and managed encryption for databases, backups, logs, and storage at rest.
- Store secrets only in managed secrets storage or equivalent secure CI/CD secret stores.
- Run dependency/CVE scanning in CI/CD and block releases with critical or high vulnerabilities unless formally risk-accepted.
- Generate an SBOM for release artifacts.
- Prevent sensitive member, lead, payment, token, and secret data from being written to application telemetry.

The implementation must not:

- Commit secrets to source control.
- Expose secrets through application configuration endpoints, logs, client bundles, or error responses.

### Security Controls

- **Authentication:** Central OIDC/JWT identity service with backend token validation for all protected APIs.
- **Authorization:** Server-side RBAC with roles for member, front-desk, trainer, branch manager, and owner/admin; branch-scoped authorization enforced on all branch-owned data.
- **Secrets Management:** Managed secrets service or CI/CD secrets store; no secrets in source control or client bundles.
- **Encryption:** TLS in transit; managed encryption at rest for PostgreSQL, backups, logs, and storage.
- **Audit Logging:** Audit sensitive administrative, payment, membership, check-in, role, branch assignment, and authorization-relevant actions.
- **Dependency/CVE Scanning:** Required in CI/CD; critical and high CVEs block release unless risk-accepted.
- **SBOM:** Required for backend, web, and mobile release artifacts.

## 11. Reliability, Performance, and Scalability

### ARD-OPS-001 — API Latency for Core Workflows

- **Target:** Core workflow API endpoints for membership lookup, booking, QR check-in, offline payment recording, and dashboard summary queries should achieve p95 latency under 500 ms under expected MVP pilot load.
- **Validation Method:** Performance tests in stage using representative pilot workflows and production observability review after pilot launch.

### ARD-OPS-002 — Dashboard Freshness

- **Target:** Dashboard data for memberships, revenue, bookings, check-ins, leads, and branch performance should update within 60 seconds of relevant operational record creation or change.
- **Validation Method:** Integration tests for read model refresh plus stage tests that measure write-to-dashboard visibility time.

### ARD-OPS-003 — Production Availability

- **Target:** Production service availability target is 99.5% during defined operating hours; operating hours are TBD and tracked in ARC-OQ-008.
- **Validation Method:** Uptime monitoring, alert review, and monthly availability report.

### ARD-OPS-004 — QR Check-In Resilience

- **Target:** QR check-in validation must return a successful, blocked, or flagged result without duplicate check-in records when a scan request is retried.
- **Validation Method:** Integration and idempotency tests for valid scans, expired/frozen/unpaid memberships, malformed QR payloads, and retry scenarios.

### ARD-OPS-005 — Payment Processing Resilience

- **Target:** Payment webhook processing must be idempotent by provider transaction ID and must not create duplicate payment records on repeated callbacks.
- **Validation Method:** Contract and integration tests using repeated, out-of-order, invalid-signature, successful, and failed payment callback scenarios.

## 12. Observability

- **Logging:** Use structured application logs with correlation IDs, user/branch context where safe, operation names, provider request references, and no sensitive member, payment, token, or secret values.
- **Metrics:** Capture request rate, latency, error rate, availability, dashboard refresh lag, payment provider failures, notification delivery failures, QR check-in outcomes, and job/read-model refresh health.
- **Tracing:** Use distributed tracing for backend request paths and external provider calls to payment, email, SMS, and identity providers.
- **Alerting:** Alert on production availability degradation, elevated error rates, latency threshold breaches, payment webhook failures, notification provider failure spikes, database health issues, and dashboard freshness breaches.
- **Sensitive Data Restrictions:** Telemetry must not include raw payment credentials, secrets, tokens, full contact details unless explicitly approved, or unrestricted member/lead/payment data.

## 13. Deployment Architecture

- **Environments:** Dev, test, stage, and prod environments, with stage used for release validation and pilot readiness checks.
- **Deployment Model:** Managed cloud containers running the Node.js/TypeScript API; managed PostgreSQL database; React web apps hosted on managed web/static hosting or containerized web hosting; React Native mobile app distributed through mobile release channels.
- **CI/CD:** Automated pipeline for build, lint, unit tests, integration tests, contract tests, E2E tests where applicable, security scans, SBOM generation, database migration validation, and environment promotion.
- **Configuration Management:** Environment-specific configuration via managed configuration/secrets; provider adapters selected by environment configuration.
- **Rollback:** Blue-green or rolling deployment rollback for backend/web; database migrations must include rollback or forward-fix plans; mobile rollback uses app release controls and backend API compatibility.
- **Infrastructure as Code:** Required for cloud infrastructure, networking, container services, database, secrets, observability, and environment configuration; exact tool tracked in ARC-OQ-005.

## 14. Testing Architecture

Required test levels:

- Unit tests
- Integration tests
- Contract tests
- End-to-end tests
- Security tests
- Performance tests, where applicable

Minimum quality expectations:

- **Coverage Threshold:** 80% coverage for backend domain modules; frontend coverage policy is TBD and tracked in ARC-OQ-009.
- **Blocking Security Severity:** Critical and high CVEs block release unless formally risk-accepted.
- **Required Build/Lint Checks:** TypeScript type checks, backend build, web build, mobile build validation, lint checks, database migration validation, dependency/CVE scanning, SBOM generation, API contract tests, and role/branch authorization tests.

## 15. Architecture Constraints

- ARC-CON-001 — The MVP must launch the Member Mobile App, Front-Desk/Trainer App, and Management Portal together with equal priority.
- ARC-CON-002 — The platform supports one centrally managed gym brand with multiple branches, not independent multi-tenant gym brands.
- ARC-CON-003 — The rollout must begin with a pilot branch before phased rollout to all branches.
- ARC-CON-004 — Online payments depend on payment gateway availability and integration readiness.
- ARC-CON-005 — Email and SMS notifications depend on configured provider availability.
- ARC-CON-006 — Advanced trainer commission management is excluded from MVP architecture scope.
- ARC-CON-007 — Advanced business automation is excluded from MVP architecture scope.
- ARC-CON-008 — The system must enforce authenticated access and role-based authorization for member, payment, staff, lead, booking, check-in, and branch management data.
- ARC-CON-009 — The system must limit member, lead, payment, and branch information to authorized users based on role and branch assignment.
- ARC-CON-010 — Raw card data and sensitive payment credentials must not be stored by the platform.
- ARC-CON-011 — External providers must be integrated through configurable adapters to support unresolved provider selection.
- ARC-CON-012 — Existing data migration is required for active members, branches, memberships, leads, and recent payment/booking history; source and quality details remain open.
- ARC-CON-013 — Operational records are retained for 7 years unless the business policy changes; this is an assumption tracked in ARC-OQ-006.

## 16. Risks and Trade-offs

| ID | Risk/Trade-off | Impact | Mitigation |
|---|---|---|---|
| ARC-RISK-001 | Launching three apps together increases integration and release coordination complexity | High | Use shared REST contracts, automated CI/CD, staged validation, and strict MVP scope boundaries |
| ARC-RISK-002 | Provider selection for payments, email, SMS, identity, cloud, and observability remains open | High | Use adapter interfaces and track provider decisions in ARC-OQ-004 and ARC-OQ-005 |
| ARC-RISK-003 | Branch-scoped authorization defects could expose sensitive data | High | Enforce authorization server-side and require role/branch authorization tests in CI/CD |
| ARC-RISK-004 | Real-time dashboards on the operational database could affect transactional performance | Medium | Use read models/materialized views, indexing, query monitoring, and dashboard freshness validation |
| ARC-RISK-005 | Migration from fragmented tools/spreadsheets may have data quality gaps | Medium | Define migration rules, validate counts and samples, and obtain business sign-off before pilot |
| ARC-RISK-006 | Modular monolith can degrade into tightly coupled modules over time | Medium | Enforce module boundaries, code ownership, internal APIs, and architecture reviews |
| ARC-RISK-007 | Mobile app release processes may slow urgent fixes for member-facing flows | Medium | Maintain backward-compatible APIs and use staged mobile release controls where available |
| ARC-RISK-008 | Undefined business hours make availability reporting ambiguous | Medium | Resolve operating hours before production SLA reporting begins |

## 17. Open Architecture Questions

| ID | Question | Owner | Status | Decision/Due Date |
|---|---|---|---|---|
| ARC-OQ-001 | Who is the named Architecture Owner for ARD-GMP? | Product Owner | Open | TBD |
| ARC-OQ-002 | Who are the named contributors for architecture, engineering, security, and product review? | Product Owner | Open | TBD |
| ARC-OQ-003 | What exact versions/frameworks will be used for React Native, React, Node.js, backend web framework, PostgreSQL, and supporting libraries? | Engineering Lead | Open | TBD |
| ARC-OQ-004 | Which exact payment gateway, email provider, SMS provider, and OIDC identity provider will be used? | Product Owner / Engineering Lead | Open | TBD |
| ARC-OQ-005 | Which managed cloud provider, container platform, IaC tool, CI/CD tool, and observability tooling will be used? | Engineering Lead / DevOps Lead | Open | TBD |
| ARC-OQ-006 | Is 7-year retention for operational records approved, or should retention vary by data class and jurisdiction? | Product Owner / Security Reviewer | Open | TBD; current ARD uses 7 years as an assumption |
| ARC-OQ-007 | What are the source systems, data quality rules, migration cutoff dates, and reconciliation criteria for existing member, branch, membership, lead, payment, and booking data? | Product Owner / Data Lead | Open | TBD |
| ARC-OQ-008 | What production operating hours should be used to calculate the 99.5% availability target? | Product Owner / Operations Lead | Open | TBD |
| ARC-OQ-009 | What frontend test coverage policy should apply to React Native and React apps? | Engineering Lead | Open | TBD |
| ARC-OQ-010 | What exact notification events are required at MVP launch for membership, payment, booking, and renewal workflows? | Product Owner | Open | TBD |
| ARC-OQ-011 | Which branch will be used for pilot launch and what architecture readiness criteria must be met before phased rollout? | Product Owner / Operations Lead | Open | TBD |
| ARC-OQ-012 | What baseline and target values will be used for KPI-001 manual admin and reconciliation effort reduction? | Product Owner | Open | TBD |

## 18. Feature Mapping

| Feature | Relevant Components | Decision IDs | Interface IDs | Security IDs |
|---|---|---|---|---|
| FEAT-001 | COMP-001, COMP-002, COMP-003, COMP-004, COMP-005, COMP-006, COMP-010, COMP-014 | ARD-DEC-001, ARD-DEC-003, ARD-DEC-005, ARD-DEC-007 | ARD-API-001 | ARD-SEC-001, ARD-SEC-003 |
| FEAT-002 | COMP-001, COMP-002, COMP-003, COMP-004, COMP-005, COMP-007, COMP-012, COMP-014 | ARD-DEC-001, ARD-DEC-003, ARD-DEC-004, ARD-DEC-007 | ARD-API-001, ARD-API-002, ARD-API-003 | ARD-SEC-001, ARD-SEC-002, ARD-SEC-003 |
| FEAT-003 | COMP-001, COMP-002, COMP-003, COMP-004, COMP-005, COMP-006, COMP-008, COMP-012 | ARD-DEC-001, ARD-DEC-003, ARD-DEC-005, ARD-DEC-007 | ARD-API-001, ARD-API-004 | ARD-SEC-001, ARD-SEC-003 |
| FEAT-004 | COMP-001, COMP-002, COMP-004, COMP-005, COMP-006, COMP-009, COMP-014 | ARD-DEC-001, ARD-DEC-002, ARD-DEC-004, ARD-DEC-007 | ARD-API-001, ARD-API-005 | ARD-SEC-001, ARD-SEC-003 |
| FEAT-005 | COMP-001, COMP-004, COMP-005, COMP-012 | ARD-DEC-001, ARD-DEC-004 | ARD-API-001, ARD-API-006 | ARD-SEC-001, ARD-SEC-003 |
| FEAT-006 | COMP-002, COMP-003, COMP-004, COMP-005, COMP-006, COMP-010, COMP-011, COMP-014 | ARD-DEC-001, ARD-DEC-003, ARD-DEC-005, ARD-DEC-007 | ARD-API-001, ARD-API-008 | ARD-SEC-001, ARD-SEC-003 |
| FEAT-007 | COMP-003, COMP-004, COMP-005, COMP-010, COMP-013 | ARD-DEC-001, ARD-DEC-003, ARD-DEC-005, ARD-DEC-006, ARD-DEC-007 | ARD-API-001, ARD-API-007 | ARD-SEC-001, ARD-SEC-003 |
| FEAT-008 | COMP-003, COMP-004, COMP-005, COMP-010, COMP-013, COMP-014 | ARD-DEC-001, ARD-DEC-003, ARD-DEC-005, ARD-DEC-007 | ARD-API-001, ARD-API-007 | ARD-SEC-001, ARD-SEC-003 |
| FEAT-009 | COMP-001, COMP-002, COMP-003, COMP-004, COMP-005, COMP-010, COMP-014 | ARD-DEC-005, ARD-DEC-007 | ARD-API-001 | ARD-SEC-001, ARD-SEC-003 |
| FEAT-010 | COMP-002, COMP-004, COMP-005, COMP-008, COMP-010, COMP-015 | ARD-DEC-001, ARD-DEC-002, ARD-DEC-005, ARD-DEC-007 | ARD-API-001, ARD-API-004 | ARD-SEC-001, ARD-SEC-003 |

## 19. Approval

| Role | Name | Decision | Date |
|---|---|---|---|
| Solution Architect | TBD | Pending | TBD |
| Security Reviewer | TBD | Pending | TBD |
| Engineering Lead | TBD | Pending | TBD |