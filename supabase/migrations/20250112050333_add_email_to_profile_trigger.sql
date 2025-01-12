CREATE OR REPLACE FUNCTION private.set_unique_slug_from_profile_name() RETURNS trigger
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
DECLARE
    base_slug TEXT;
    new_slug TEXT;
    counter INTEGER := 1;
BEGIN
-- Generate the base slug
    base_slug := slugify(NEW.name);
    new_slug := base_slug;

-- Check if the slug already exists
    WHILE EXISTS (SELECT 1 FROM profiles WHERE slug = new_slug) LOOP
-- If it exists, append a number and increment
        new_slug := base_slug || '-' || counter;
        counter := counter + 1;
    END LOOP;

    NEW.slug := new_slug;

    NEW.email := (SELECT email FROM auth.users WHERE id = NEW.user_id);
    RETURN NEW;
END
$$;

CREATE OR REPLACE TRIGGER "t_profiles_insert" BEFORE INSERT ON "profiles" FOR EACH ROW WHEN (NEW.name IS NOT NULL AND NEW.slug IS NULL)
EXECUTE PROCEDURE private.set_unique_slug_from_profile_name();

-- Update email for existing users
UPDATE public.profiles
SET email = auth.users.email
FROM auth.users
WHERE public.profiles.user_id = auth.users.id
AND public.profiles.email IS NULL;