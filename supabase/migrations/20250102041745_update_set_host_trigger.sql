CREATE OR REPLACE FUNCTION private.set_user_as_team_host_after_insert() RETURNS trigger
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
DECLARE
    team_slug TEXT;
    member_slug TEXT;
BEGIN
-- Generate the base slug
    team_slug := NEW.slug;
    select slug into member_slug from profiles where user_id = NEW.created_by;

    INSERT INTO members (team, member, role) VALUES (team_slug, member_slug, 'host');
    RETURN NEW;
END
$$;

CREATE OR REPLACE TRIGGER "t_teams_host_insert" AFTER INSERT ON "teams" FOR EACH ROW WHEN (NEW.slug IS NOT NULL AND NEW.created_by IS NOT NULL)
EXECUTE PROCEDURE private.set_user_as_team_host_after_insert();

DROP FUNCTION IF EXISTS public.set_user_as_team_host_after_insert();