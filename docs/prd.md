# Product Requirements Document (PRD)

> Requirement IDs should remain stable after approval so downstream ARD and feature specifications retain traceability.

## Document Metadata

- **Product/Application:** Gym Management Platform
- **Document ID:** PRD-GMP
- **Version:** 0.1
- **Status:** Draft
- **Owner:** TBD
- **Contributors:** TBD
- **Last Updated:** 2026-11-17

---

## 1. Executive Summary

The Gym Management Platform is a multi-app solution for a mid-market gym business operating as a single brand with centrally managed multiple branches. It includes a Member Mobile App, Front-Desk/Trainer App, and Management Portal launched together with equal priority.

The MVP will replace fragmented tools, spreadsheets, and manual reconciliation across memberships, renewals, payments, class bookings, QR check-ins, notifications, lead management, and real-time reporting. The expected value is reduced manual administrative effort, clearer branch-level visibility, and smoother day-to-day operations for members, staff, trainers, managers, and owners.

Advanced trainer commissions and advanced business automation are planned for a later release and are not required in the MVP.

## 2. Problem Statement

Gym staff currently use fragmented tools and spreadsheets with manual reconciliation across key operations including memberships, payments, bookings, and reporting. This creates operational overhead, inconsistent branch execution, delayed management visibility, and avoidable friction for members and staff.

## 3. Product Vision

Create a centralized gym management platform where members can self-serve core gym interactions, staff and trainers can manage daily operations efficiently, and owners/managers can monitor branches, leads, revenue, attendance, and operational performance in real time from one system.

## 4. Goals and Success Measures

### 4.1 Goals

- Reduce manual admin work and reconciliation effort across memberships, payments, bookings, leads, and reporting.
- Launch Member Mobile App, Front-Desk/Trainer App, and Management Portal together for the MVP.
- Centralize multi-branch management for a single gym brand.
- Support online and front-desk recorded offline payments with reconciliation visibility.
- Provide real-time dashboards for memberships, revenue, bookings, check-ins, leads, and branch performance.

### 4.2 Success Measures

| ID | Measure | Baseline | Target | Measurement Method |
|---|---|---:|---:|---|
| KPI-001 | Manual admin and reconciliation effort | TBD | TBD | Compare staff-reported time spent on admin/reconciliation before and after MVP adoption |

## 5. Scope

### 5.1 In Scope

- Member Mobile App for renewals, online payments, class bookings, QR check-ins, notifications, and member self-service.
- Front-Desk/Trainer App for daily operations, payment visibility, offline payment recording, booking rosters, attendance, QR validation, and trainer schedules.
- Management Portal for centralized multi-branch management, real-time dashboards, lead management, reporting, and role-based administration.
- Membership lifecycle management including active, expired, frozen, and unpaid states.
- Online payments and front-desk recorded offline payments with reconciliation reports.
- Fixed-capacity class bookings with staff-visible rosters and attendance marking.
- In-app, email, and SMS notifications.
- Lead capture, assignment, status tracking, follow-up logging, and conversion to member.
- Pilot launch at one branch followed by phased rollout to all branches.

### 5.2 Out of Scope

- Advanced trainer commission management for MVP.
- Advanced automated business operations for MVP.
- Full CRM capabilities such as campaign automation, lead scoring, source ROI analytics, and advanced pipeline automation.
- Enterprise-grade custom workflows, advanced analytics, forecasting, and commission projections.
- Multi-tenant support for multiple independent gym brands.

## 6. Personas and Users

### PERSONA-001 — Gym Member

- **Description:** A gym customer using the mobile app to manage membership, payments, class bookings, check-ins, and notifications.
- **Primary Need:** Convenient self-service for gym interactions without relying on staff.
- **Key Pain Point:** Manual or fragmented booking, payment, renewal, and check-in experiences.

### PERSONA-002 — Front-Desk Staff

- **Description:** Branch staff responsible for member support, payments, check-ins, class rosters, attendance, and lead follow-up.
- **Primary Need:** Efficient daily operations with clear member, payment, booking, and lead status.
- **Key Pain Point:** Manual reconciliation and fragmented tools across operational workflows.

### PERSONA-003 — Trainer

- **Description:** Gym trainer using the staff app to view schedules, rosters, and attendance-related information.
- **Primary Need:** Visibility into assigned schedules and class participation.
- **Key Pain Point:** Lack of centralized schedule and roster access.

### PERSONA-004 — Branch Manager

- **Description:** Manager responsible for branch-level operations, performance, leads, attendance, and reporting.
- **Primary Need:** Real-time operational visibility for assigned branch performance.
- **Key Pain Point:** Delayed or manually compiled branch reporting.

### PERSONA-005 — Owner/Admin

- **Description:** Central management user overseeing all branches, reports, roles, leads, revenue, and operational performance.
- **Primary Need:** Centralized control and real-time visibility across the gym brand.
- **Key Pain Point:** Inconsistent branch-level execution and fragmented performance reporting.

## 7. Assumptions and Dependencies

### Assumptions

- ASM-001 — The platform serves a single gym brand with multiple centrally managed branches.
- ASM-002 — Member, staff/trainer, and management experiences will launch together in the MVP.
- ASM-003 — Advanced commissions and advanced automation are deferred to later releases.
- ASM-004 — Baseline and target values for manual admin/reconciliation reduction are not yet available and will be finalized before approval.

### Dependencies

- DEP-001 — Payment gateway integration for online payments and renewals.
- DEP-002 — SMS and email provider integration for customer notifications.
- DEP-003 — QR code scanning capability for member check-ins.
- DEP-004 — Branch pilot readiness before phased rollout to all branches.

## 8. Functional Requirements

### PRD-FR-001 — Membership Lifecycle Management

- **Priority:** Must
- **Feature:** FEAT-001
- **Persona:** PERSONA-002

**Requirement**

The system shall manage member profiles, membership plans, renewal status, and membership states including active, expired, frozen, and unpaid.

**Business Rationale**

Centralized membership lifecycle management reduces manual tracking and enables consistent access decisions across bookings, payments, and check-ins.

**Acceptance Criteria**

1. Staff can create, view, update, and renew a member membership from the operational app or management portal.
2. The system displays each member’s current membership state as active, expired, frozen, or unpaid.
3. Expired, frozen, or unpaid memberships are visibly flagged on member profiles, bookings, and check-in screens.

---

### PRD-FR-002 — Online and Offline Payment Handling

- **Priority:** Must
- **Feature:** FEAT-002
- **Persona:** PERSONA-001

**Requirement**

The system shall support member-initiated online payments and staff-recorded offline payments with payment status visibility.

**Business Rationale**

Supporting both payment modes reflects gym operations while reducing manual reconciliation across member payments and renewals.

**Acceptance Criteria**

1. Members can initiate online payment for eligible memberships or renewals from the mobile app.
2. Front-desk staff can record an offline payment against a member account.
3. Staff and managers can view whether a payment is pending, paid, or failed/recorded as unsuccessful.
4. Payment records are linked to the relevant member and membership transaction.

---

### PRD-FR-003 — Payment Reconciliation Reports

- **Priority:** Must
- **Feature:** FEAT-002
- **Persona:** PERSONA-004

**Requirement**

The system shall provide reconciliation reporting for online payments and front-desk recorded offline payments.

**Business Rationale**

Reconciliation visibility is required to reduce manual admin effort and replace fragmented payment tracking.

**Acceptance Criteria**

1. Managers can view online and offline payment records in a single reconciliation report.
2. The report identifies payment method, member, branch, transaction status, and transaction date.
3. The report can be filtered by branch and date.

---

### PRD-FR-004 — Fixed-Capacity Class Booking

- **Priority:** Must
- **Feature:** FEAT-003
- **Persona:** PERSONA-001

**Requirement**

The system shall allow members to book fixed-capacity classes and allow staff to view rosters and mark attendance.

**Business Rationale**

Class booking self-service reduces staff workload and gives branches operational visibility into planned attendance.

**Acceptance Criteria**

1. Members can view available classes with capacity status in the mobile app.
2. Members can book a class only when capacity is available and their membership is eligible.
3. Staff can view the roster for each class.
4. Staff can mark attendance for booked members.

---

### PRD-FR-005 — QR Check-In Validation

- **Priority:** Must
- **Feature:** FEAT-004
- **Persona:** PERSONA-001

**Requirement**

The system shall support QR-based member check-ins and validate membership status at check-in.

**Business Rationale**

QR check-ins streamline branch entry while preventing or flagging access issues tied to expired, frozen, or unpaid memberships.

**Acceptance Criteria**

1. Members can present a QR code from the mobile app for check-in.
2. Staff can scan or validate the QR code using the Front-Desk/Trainer App.
3. Active memberships result in a successful check-in record.
4. Expired, frozen, or unpaid memberships are blocked or flagged during QR check-in.

---

### PRD-FR-006 — Customer Notifications

- **Priority:** Must
- **Feature:** FEAT-005
- **Persona:** PERSONA-001

**Requirement**

The system shall send customer notifications through in-app, email, and SMS channels for operational events.

**Business Rationale**

Notifications reduce manual customer follow-up and keep members informed about membership, payment, booking, and check-in-related events.

**Acceptance Criteria**

1. The system can send an in-app notification to a member account.
2. The system can send email and SMS notifications using configured providers.
3. Notification records show channel, recipient, event type, and delivery status when available.
4. Members receive notifications for applicable membership, renewal, payment, and booking events.

---

### PRD-FR-007 — Lead Management Workflow

- **Priority:** Must
- **Feature:** FEAT-006
- **Persona:** PERSONA-002

**Requirement**

The system shall allow staff to capture leads, assign them to staff, track lead status, log follow-ups, and convert leads to members.

**Business Rationale**

Lead management prevents lead leakage and centralizes the enquiry-to-membership workflow within the gym platform.

**Acceptance Criteria**

1. Staff can create a lead with contact details and source/status fields.
2. Staff or managers can assign a lead to a staff member.
3. Staff can log follow-up activity against a lead.
4. Staff can convert a lead into a member record without re-entering captured lead details.

---

### PRD-FR-008 — Real-Time Management Dashboards

- **Priority:** Must
- **Feature:** FEAT-007
- **Persona:** PERSONA-005

**Requirement**

The system shall provide real-time dashboards for memberships, revenue, bookings, check-ins, leads, and branch performance.

**Business Rationale**

Real-time reporting gives owners and managers centralized visibility and reduces manually compiled reports.

**Acceptance Criteria**

1. Owners/admins can view dashboard summaries for memberships, revenue, bookings, check-ins, leads, and branch performance.
2. Branch managers can view dashboard data for their assigned branch.
3. Owners/admins can filter dashboard views by branch.
4. Dashboard values update after relevant operational records are created or changed in the system.

---

### PRD-FR-009 — Centralized Multi-Branch Management

- **Priority:** Must
- **Feature:** FEAT-008
- **Persona:** PERSONA-005

**Requirement**

The system shall support centralized management of multiple branches under one gym brand.

**Business Rationale**

Centralized multi-branch management enables consistent operations, reporting, and administrative oversight across the gym business.

**Acceptance Criteria**

1. Owners/admins can create and manage branch records.
2. Members, staff, leads, payments, bookings, and check-ins can be associated with a branch.
3. Owners/admins can view cross-branch data from the management portal.
4. Branch managers can access data for assigned branches according to role permissions.

---

### PRD-FR-010 — Role-Based Access Control

- **Priority:** Must
- **Feature:** FEAT-009
- **Persona:** PERSONA-005

**Requirement**

The system shall enforce role-based access for member, front-desk, trainer, branch manager, and owner/admin roles.

**Business Rationale**

Role-based access protects member, payment, branch, and operational data while enabling each user group to complete its workflows.

**Acceptance Criteria**

1. Users can be assigned one of the supported roles: member, front-desk, trainer, branch manager, or owner/admin.
2. Members cannot access staff, trainer, manager, or owner/admin functions.
3. Branch managers can access only assigned branch data unless granted owner/admin access.
4. Owner/admin users can manage users, roles, and branches centrally.

---

### PRD-FR-011 — Trainer Schedule Visibility

- **Priority:** Must
- **Feature:** FEAT-010
- **Persona:** PERSONA-003

**Requirement**

The system shall allow trainers to view their schedules and related class roster information.

**Business Rationale**

Trainer schedule visibility supports daily operations and reduces coordination overhead between staff and trainers.

**Acceptance Criteria**

1. Trainers can view assigned schedules in the Front-Desk/Trainer App.
2. Trainers can view rosters for classes associated with their schedule.
3. Trainers cannot view unrelated branch or management data unless granted additional permissions.

## 9. Non-Functional Requirements

### PRD-NFR-001 — Security and Privacy Controls

- **Category:** Security
- **Priority:** Must

**Requirement**

The system shall protect member profiles, payment records, staff roles, and branch data through authenticated access and role-based authorization.

**Acceptance Criteria**

1. Unauthenticated users cannot access member, payment, staff, lead, booking, check-in, or branch management data.
2. A user without the required role cannot access restricted screens or actions for that role.
3. A branch-scoped user cannot view another branch’s operational data unless assigned permission that allows cross-branch access.

### PRD-NFR-002 — Privacy for Member and Operational Data

- **Category:** Privacy
- **Priority:** Must

**Requirement**

The system shall limit access to member, lead, payment, and branch information to authorized users based on role and branch assignment.

**Acceptance Criteria**

1. Member and lead records are visible only to authorized staff, branch managers, and owner/admin users.
2. Payment records are visible only to authorized operational and management users.
3. Role and branch restrictions are consistently applied across the mobile app, staff app, and management portal.

## 10. User Journeys

### JOURNEY-001 — Member Renews and Checks In

1. Member opens the mobile app and views membership renewal status.
2. Member completes an online renewal payment.
3. Member presents the mobile QR code at the branch.
4. Staff scans the QR code and the system validates active membership.
5. The system records a successful check-in.

**Related Requirements:** PRD-FR-001, PRD-FR-002, PRD-FR-005, PRD-NFR-001

### JOURNEY-002 — Staff Records Offline Payment

1. Front-desk staff opens a member profile.
2. Staff records an offline payment for a membership or renewal.
3. The system updates payment status and links the transaction to the member.
4. Manager views the transaction in reconciliation reporting.

**Related Requirements:** PRD-FR-001, PRD-FR-002, PRD-FR-003, PRD-NFR-001

### JOURNEY-003 — Member Books a Class

1. Member views available fixed-capacity classes in the mobile app.
2. Member books an eligible class with available capacity.
3. Staff views the updated roster.
4. Staff marks member attendance for the class.

**Related Requirements:** PRD-FR-004, PRD-FR-006, PRD-NFR-001

### JOURNEY-004 — Lead Converts to Member

1. Staff captures a new lead.
2. Manager or staff assigns the lead to a staff member.
3. Staff logs follow-up activity and updates lead status.
4. Staff converts the lead to a member record.

**Related Requirements:** PRD-FR-007, PRD-FR-009, PRD-FR-010, PRD-NFR-001

### JOURNEY-005 — Owner Reviews Branch Performance

1. Owner/admin opens the management portal.
2. Owner/admin views real-time dashboards for memberships, revenue, bookings, check-ins, leads, and branches.
3. Owner/admin filters dashboard data by branch.
4. Owner/admin uses the data to monitor branch performance.

**Related Requirements:** PRD-FR-008, PRD-FR-009, PRD-FR-010, PRD-NFR-001

## 11. Feature Breakdown

### FEAT-001 — Membership Management

- **Summary:** Manage member profiles, plans, renewals, and membership status across branches.
- **Priority:** Must
- **Related Requirements:** PRD-FR-001, PRD-FR-005, PRD-NFR-001
- **Expected Spec File:** `specs/FEAT-001-membership-management.spec.md`

### FEAT-002 — Payments and Reconciliation

- **Summary:** Support online payments, front-desk recorded offline payments, and reconciliation reporting.
- **Priority:** Must
- **Related Requirements:** PRD-FR-002, PRD-FR-003, PRD-NFR-001
- **Expected Spec File:** `specs/FEAT-002-payments-and-reconciliation.spec.md`

### FEAT-003 — Class Booking and Attendance

- **Summary:** Enable fixed-capacity class booking, roster visibility, and attendance marking.
- **Priority:** Must
- **Related Requirements:** PRD-FR-004, PRD-NFR-001
- **Expected Spec File:** `specs/FEAT-003-class-booking-and-attendance.spec.md`

### FEAT-004 — QR Check-Ins

- **Summary:** Enable QR-based check-ins with membership state validation.
- **Priority:** Must
- **Related Requirements:** PRD-FR-005, PRD-NFR-001
- **Expected Spec File:** `specs/FEAT-004-qr-check-ins.spec.md`

### FEAT-005 — Customer Notifications

- **Summary:** Send in-app, email, and SMS notifications for operational customer events.
- **Priority:** Must
- **Related Requirements:** PRD-FR-006
- **Expected Spec File:** `specs/FEAT-005-customer-notifications.spec.md`

### FEAT-006 — Lead Management

- **Summary:** Capture, assign, track, follow up, and convert leads to members.
- **Priority:** Must
- **Related Requirements:** PRD-FR-007, PRD-NFR-001
- **Expected Spec File:** `specs/FEAT-006-lead-management.spec.md`

### FEAT-007 — Real-Time Reporting Dashboards

- **Summary:** Provide dashboards for memberships, revenue, bookings, check-ins, leads, and branch performance.
- **Priority:** Must
- **Related Requirements:** PRD-FR-008, PRD-FR-009, PRD-NFR-001
- **Expected Spec File:** `specs/FEAT-007-real-time-reporting-dashboards.spec.md`

### FEAT-008 — Multi-Branch Administration

- **Summary:** Centrally manage multiple branches under one gym brand.
- **Priority:** Must
- **Related Requirements:** PRD-FR-009, PRD-FR-010, PRD-NFR-001
- **Expected Spec File:** `specs/FEAT-008-multi-branch-administration.spec.md`

### FEAT-009 — Role-Based Access Control

- **Summary:** Enforce access by role and branch assignment across all apps.
- **Priority:** Must
- **Related Requirements:** PRD-FR-010, PRD-NFR-001, PRD-NFR-002
- **Expected Spec File:** `specs/FEAT-009-role-based-access-control.spec.md`

### FEAT-010 — Trainer Schedules

- **Summary:** Provide trainers with assigned schedule and roster visibility.
- **Priority:** Must
- **Related Requirements:** PRD-FR-011, PRD-NFR-001
- **Expected Spec File:** `specs/FEAT-010-trainer-schedules.spec.md`

## 12. Constraints

- CON-001 — The MVP must launch Member Mobile App, Front-Desk/Trainer App, and Management Portal together with equal priority.
- CON-002 — The platform must support a single gym brand with multiple centrally managed branches.
- CON-003 — The rollout must begin with a pilot at one branch before phased rollout to all branches.
- CON-004 — Online payments depend on payment gateway availability and integration readiness.
- CON-005 — Email and SMS notifications depend on configured provider availability.
- CON-006 — Advanced commissions and advanced automation are excluded from the MVP.

## 13. Risks

| ID | Risk | Impact | Likelihood | Mitigation |
|---|---|---|---|---|
| RISK-001 | Integration delays with payment gateway or notification providers | High | Medium | Validate provider readiness early and isolate integration work behind clear interfaces |
| RISK-002 | Launching three apps together increases MVP delivery complexity | High | Medium | Keep MVP limited to Must-have workflows and defer advanced commissions and automation |
| RISK-003 | Incomplete baseline data makes success measurement harder | Medium | High | Capture current admin/reconciliation effort before pilot launch |
| RISK-004 | Branch-specific operational differences may complicate phased rollout | Medium | Medium | Use the pilot branch to validate workflows before expanding to all branches |
| RISK-005 | Incorrect role or branch permissions could expose sensitive data | High | Medium | Prioritize role-based access testing across member, staff, trainer, manager, and owner/admin roles |

## 14. Open Questions

| ID | Question | Owner | Status | Decision/Due Date |
|---|---|---|---|---|
| OQ-001 | What are the baseline and target values for reducing manual admin and reconciliation effort? | Product Owner | Open | Not set |
| OQ-002 | What exact payment gateway, SMS provider, and email provider will be used? | Product Owner | Open | Not set |
| OQ-003 | Which operational notification events are required at MVP launch for membership, payment, booking, and renewal workflows? | Product Owner | Open | Not set |
| OQ-004 | Which pilot branch will launch first and what criteria determine readiness for phased rollout? | Product Owner | Open | Not set |

## 15. Release and Rollout Considerations

- **Target Release:** Not committed
- **Rollout Approach:** Pilot launch at one branch, followed by phased rollout to all branches.
- **Migration Considerations:** Existing member, payment, booking, lead, and branch data migration requirements are not yet defined and should be resolved before implementation planning.
- **Training/Support Considerations:** Training is required for front-desk staff, trainers, branch managers, and owner/admin users before pilot launch.

## 16. Definition of Product Success

The product is successful when:

- Manual admin and reconciliation effort is reduced against the agreed baseline and target.
- Members, staff/trainers, branch managers, and owners/admins can complete their Must-have MVP workflows across the three apps.
- Real-time dashboards provide centralized visibility into memberships, revenue, bookings, check-ins, leads, and branch performance.
- The pilot branch validates the operating model for phased rollout to all branches.
- All Must-priority requirements are accepted.
- Required quality, security, and compliance outcomes are evidenced.

## 17. Approval

| Role | Name | Decision | Date |
|---|---|---|---|
| Product Owner | TBD | Pending | TBD |
| Business Sponsor | TBD | Pending | TBD |