-- Run this in your Supabase SQL editor to set up passkeys + profiles + user registry

CREATE TABLE IF NOT EXISTS user_registry (
  discord_id  TEXT PRIMARY KEY,
  username    TEXT NOT NULL,
  avatar_url  TEXT,
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  verified_at TIMESTAMPTZ,
  last_login  TIMESTAMPTZ
);

ALTER TABLE user_registry DISABLE ROW LEVEL SECURITY;

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

-- RLS: only the owner can read/write their own rows
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE passkeys ENABLE ROW LEVEL SECURITY;
ALTER TABLE passkey_challenges ENABLE ROW LEVEL SECURITY;

-- Note: these policies use service_role which bypasses RLS.
-- Since the API routes use the anon key, you may need to add
-- permissive policies or switch to a service role key.
-- For a personal site, the simplest option is to disable RLS:
-- ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE passkeys DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE passkey_challenges DISABLE ROW LEVEL SECURITY;
