CREATE SCHEMA IF NOT EXISTS private;

CREATE OR REPLACE FUNCTION private.is_team_member(team_slug TEXT)
RETURNS BOOLEAN
LANGUAGE PLPGSQL
SECURITY DEFINER
AS $$
begin
  RETURN EXISTS (
    SELECT 1
    FROM members
    INNER JOIN profiles ON members.member = profiles.slug
    WHERE members.team = team_slug AND members.role IN ('host', 'member') AND profiles.user_id = auth.uid()
  );
end;
$$;

CREATE OR REPLACE FUNCTION private.is_team_host(team_slug TEXT)
RETURNS BOOLEAN
LANGUAGE PLPGSQL
SECURITY DEFINER
AS $$
begin
  RETURN EXISTS (
    SELECT 1
    FROM members
    INNER JOIN profiles ON members.member = profiles.slug
    WHERE members.team = team_slug AND members.role = 'host' AND profiles.user_id = auth.uid()
  );
end;
$$;

CREATE OR REPLACE FUNCTION private.is_current_member(member_slug TEXT)
RETURNS BOOLEAN
LANGUAGE PLPGSQL
SECURITY DEFINER
AS $$
begin
  RETURN EXISTS (
    SELECT 1
    FROM profiles
    WHERE profiles.slug = member_slug AND profiles.user_id = auth.uid()
  );
end;
$$;