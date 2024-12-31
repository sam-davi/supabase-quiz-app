CREATE OR REPLACE FUNCTION public.set_unique_slug_from_category_name() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    new_slug TEXT;
BEGIN
-- Generate the base slug
    new_slug := slugify(NEW.name);

-- Check if the slug already exists
    IF EXISTS (SELECT 1 FROM categories WHERE slug = new_slug and team = NEW.team) THEN
-- If it exists, prevent insert
        RETURN NULL;
    END IF;

    NEW.slug := new_slug;
    RETURN NEW;
END
$$;

CREATE OR REPLACE TRIGGER "t_categories_insert" BEFORE INSERT ON "categories" FOR EACH ROW WHEN (NEW.name IS NOT NULL AND NEW.slug IS NULL)
EXECUTE PROCEDURE set_unique_slug_from_category_name();