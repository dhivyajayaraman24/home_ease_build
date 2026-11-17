BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS schema_migrations (
  version text PRIMARY KEY,
  name text NOT NULL,
  checksum text NOT NULL,
  applied_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS branches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  status text NOT NULL DEFAULT 'planned',
  timezone text NOT NULL DEFAULT 'UTC',
  address_line1 text,
  address_line2 text,
  city text,
  region text,
  postal_code text,
  country_code char(2) NOT NULL DEFAULT 'US',
  is_pilot boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT branches_status_check CHECK (status IN ('planned', 'pilot', 'active', 'inactive'))
);

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  identity_subject text NOT NULL UNIQUE,
  email text NOT NULL UNIQUE,
  display_name text NOT NULL,
  status text NOT NULL DEFAULT 'active',
  home_branch_id uuid REFERENCES branches(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT users_status_check CHECK (status IN ('invited', 'active', 'disabled'))
);

CREATE TABLE IF NOT EXISTS roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  name text NOT NULL,
  description text NOT NULL,
  branch_scoped boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_roles (
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id uuid NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
  assigned_at timestamptz NOT NULL DEFAULT now(),
  assigned_by_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  PRIMARY KEY (user_id, role_id)
);

CREATE TABLE IF NOT EXISTS branch_assignments (
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  branch_id uuid NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  role_id uuid REFERENCES roles(id) ON DELETE SET NULL,
  assignment_status text NOT NULL DEFAULT 'active',
  assigned_at timestamptz NOT NULL DEFAULT now(),
  assigned_by_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  PRIMARY KEY (user_id, branch_id),
  CONSTRAINT branch_assignments_status_check CHECK (assignment_status IN ('active', 'inactive'))
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  occurred_at timestamptz NOT NULL DEFAULT now(),
  actor_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  branch_id uuid REFERENCES branches(id) ON DELETE SET NULL,
  action text NOT NULL,
  target_type text NOT NULL,
  target_id text NOT NULL,
  authorization_outcome text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  request_id text,
  CONSTRAINT audit_logs_authorization_outcome_check
    CHECK (authorization_outcome IS NULL OR authorization_outcome IN ('allowed', 'denied'))
);

CREATE INDEX IF NOT EXISTS idx_users_home_branch_id ON users(home_branch_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON user_roles(role_id);
CREATE INDEX IF NOT EXISTS idx_branch_assignments_branch_id ON branch_assignments(branch_id);
CREATE INDEX IF NOT EXISTS idx_branch_assignments_role_id ON branch_assignments(role_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_branch_occurred_at ON audit_logs(branch_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_occurred_at ON audit_logs(actor_user_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_target ON audit_logs(target_type, target_id);

COMMENT ON TABLE branches IS 'Centrally managed gym brand branches.';
COMMENT ON TABLE users IS 'Application users mapped to external OIDC/JWT identity subjects.';
COMMENT ON TABLE roles IS 'Application-managed RBAC roles.';
COMMENT ON TABLE branch_assignments IS 'Branch-scoped user access assignments.';
COMMENT ON TABLE audit_logs IS 'Append-oriented audit records for sensitive and administrative actions.';
COMMENT ON COLUMN users.home_branch_id IS 'Default branch context for users with branch-owned workflows.';
COMMENT ON COLUMN branch_assignments.branch_id IS 'Branch scope for staff, trainers, and managers.';
COMMENT ON COLUMN audit_logs.branch_id IS 'Branch scope for branch-owned auditable events when applicable.';

COMMIT;
