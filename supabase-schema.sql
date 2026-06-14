-- Run this in your Supabase SQL editor to set up passkeys + profiles + user registry
-- API routes use SUPABASE_SERVICE_ROLE_KEY which bypasses RLS server-side.
-- RLS is enabled as a safety net so the anon key (public) can't read/write anything.

CREATE TABLE IF NOT EXISTS user_registry (
  discord_id  TEXT PRIMARY KEY,
  username    TEXT NOT NULL,
  avatar_url  TEXT,
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  verified_at TIMESTAMPTZ,
  last_login  TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS profiles (
  user_id      TEXT PRIMARY KEY,
  display_name TEXT,
  bio          TEXT,
  website      TEXT,
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS passkeys (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       TEXT NOT NULL,
  credential_id TEXT NOT NULL UNIQUE,
  public_key    TEXT NOT NULL,
  counter       BIGINT NOT NULL DEFAULT 0,
  device_name   TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS passkey_challenges (
  user_id    TEXT PRIMARY KEY,
  challenge  TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables (anon key has zero access; service role bypasses RLS)
ALTER TABLE user_registry     ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles           ENABLE ROW LEVEL SECURITY;
ALTER TABLE passkeys           ENABLE ROW LEVEL SECURITY;
ALTER TABLE passkey_challenges ENABLE ROW LEVEL SECURITY;

-- No RLS policies needed: the service role key used by API routes bypasses RLS,
-- and the public anon key is intentionally blocked by the absence of policies.
