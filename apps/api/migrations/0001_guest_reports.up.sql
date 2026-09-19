CREATE TABLE guest_sessions (
  id uuid PRIMARY KEY,
  token_hash char(64) NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE content_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id uuid NOT NULL REFERENCES guest_sessions(id) ON DELETE CASCADE,
  content_id varchar(120) NOT NULL,
  content_version integer NOT NULL CHECK (content_version > 0),
  reason varchar(20) NOT NULL CHECK (reason IN ('answer', 'explanation', 'typo', 'prompt')),
  reported_at timestamptz NOT NULL,
  received_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (guest_id, content_id, content_version, reason)
);

CREATE INDEX content_reports_received_at_idx ON content_reports (received_at DESC);
