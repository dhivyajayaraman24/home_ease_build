BEGIN;

INSERT INTO roles (key, name, description, branch_scoped)
VALUES
  ('owner-admin', 'Owner/Admin', 'Central administrator with cross-branch access.', false),
  ('branch-manager', 'Branch Manager', 'Manager for assigned branch operations and reporting.', true),
  ('front-desk', 'Front Desk', 'Front-desk staff for branch member and payment workflows.', true),
  ('trainer', 'Trainer', 'Trainer for branch class, roster, and schedule workflows.', true),
  ('member', 'Member', 'Gym member with self-service access to their own records.', true)
ON CONFLICT (key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  branch_scoped = EXCLUDED.branch_scoped,
  updated_at = now();

INSERT INTO branches (
  code,
  name,
  status,
  timezone,
  address_line1,
  city,
  region,
  postal_code,
  country_code,
  is_pilot
)
VALUES
  (
    'PF-DOWNTOWN-PILOT',
    'Pulse Fit Downtown Pilot',
    'pilot',
    'America/New_York',
    '100 Market Street',
    'Columbus',
    'OH',
    '43215',
    'US',
    true
  ),
  (
    'PF-NORTH-ROLL-OUT',
    'Pulse Fit North',
    'planned',
    'America/New_York',
    '2400 North High Street',
    'Columbus',
    'OH',
    '43202',
    'US',
    false
  ),
  (
    'PF-RIVERSIDE-ROLL-OUT',
    'Pulse Fit Riverside',
    'planned',
    'America/New_York',
    '18 Riverside Drive',
    'Dublin',
    'OH',
    '43017',
    'US',
    false
  )
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  status = EXCLUDED.status,
  timezone = EXCLUDED.timezone,
  address_line1 = EXCLUDED.address_line1,
  city = EXCLUDED.city,
  region = EXCLUDED.region,
  postal_code = EXCLUDED.postal_code,
  country_code = EXCLUDED.country_code,
  is_pilot = EXCLUDED.is_pilot,
  updated_at = now();

COMMIT;
