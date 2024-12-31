CREATE OR REPLACE FUNCTION public.get_location_and_category_from_name() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    location_slug TEXT;
    category_slug TEXT;
BEGIN
-- Generate the base slugs
    location_slug := slugify(NEW.location);
    category_slug := slugify(NEW.category);

    IF NOT EXISTS (SELECT 1 FROM locations WHERE slug = location_slug and team = NEW.team) THEN
-- Create location if it doesn't exist
        INSERT INTO locations (name, team) VALUES (NEW.location, NEW.team) RETURNING slug INTO location_slug;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM categories WHERE slug = category_slug and team = NEW.team) THEN
-- Create category if it doesn't exist
        INSERT INTO categories (name, team) VALUES (NEW.category, NEW.team) RETURNING slug INTO category_slug;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM scores WHERE location = location_slug and team = NEW.team and quiz_date = NEW.quiz_date) THEN
-- Create score if it doesn't exist
        INSERT INTO scores (location, team, quiz_date, score) VALUES (location_slug, NEW.team, NEW.quiz_date, 0);
    END IF;

    NEW.location := location_slug;
    NEW.category := category_slug;
    RETURN NEW;
END
$$;

CREATE OR REPLACE TRIGGER "t_rounds_before_insert" BEFORE INSERT ON "rounds" FOR EACH ROW WHEN (NEW.location IS NOT NULL AND NEW.category IS NOT NULL)
EXECUTE PROCEDURE get_location_and_category_from_name();
