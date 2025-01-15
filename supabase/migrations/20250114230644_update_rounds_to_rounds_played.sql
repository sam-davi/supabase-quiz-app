ALTER TABLE "categories" RENAME COLUMN "rounds" TO "rounds_played";--> statement-breakpoint
ALTER TABLE "scores" RENAME COLUMN "rounds" TO "rounds_played";--> statement-breakpoint

CREATE OR REPLACE FUNCTION public.generate_category_and_score_stats() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_min_percent_score REAL;
    v_max_percent_score REAL;
    v_average_percent_score REAL;
    v_total_score REAL;
    v_total_out_of REAL;
    v_rounds INTEGER;
BEGIN
-- update category stats
    SELECT
        MIN(rounds.percent_score),
        MAX(rounds.percent_score),
        AVG(rounds.percent_score),
        COUNT(*)
    INTO
        v_min_percent_score,
        v_max_percent_score,
        v_average_percent_score,
        v_rounds
    FROM
        rounds
    WHERE
        rounds.category = NEW.category AND
        rounds.team = NEW.team;
    
    UPDATE categories
    SET
        min_percent_score = v_min_percent_score,
        max_percent_score = v_max_percent_score,
        average_percent_score = v_average_percent_score,
        rounds_played = v_rounds
    WHERE
        categories.slug = NEW.category AND
        categories.team = NEW.team;

-- update old category if needed
    IF OLD.category != NEW.category AND OLD.category IS NOT NULL THEN
        SELECT
            MIN(rounds.percent_score),
            MAX(rounds.percent_score),
            AVG(rounds.percent_score),
            COUNT(*)
        INTO
            v_min_percent_score,
            v_max_percent_score,
            v_average_percent_score,
            v_rounds
        FROM
            rounds
        WHERE
            rounds.category = OLD.category AND
            rounds.team = OLD.team;
        
        UPDATE categories
        SET
            min_percent_score = v_min_percent_score,
            max_percent_score = v_max_percent_score,
            average_percent_score = v_average_percent_score,
            rounds_played = v_rounds
        WHERE
            categories.slug = OLD.category AND
            categories.team = OLD.team;
    END IF;

-- update score stats
    SELECT
        SUM(rounds.total_score),
        SUM(rounds.total_out_of),
        COUNT(*)
    INTO
        v_total_score,
        v_total_out_of,
        v_rounds
    FROM
        rounds
    WHERE
        rounds.location = NEW.location AND
        rounds.quiz_date = NEW.quiz_date AND
        rounds.team = NEW.team;
    
    UPDATE scores
    SET
        score = v_total_score,
        out_of = v_total_out_of,
        rounds_played = v_rounds
    WHERE
        scores.location = NEW.location AND
        scores.quiz_date = NEW.quiz_date AND
        scores.team = NEW.team;

-- update old score if needed
    IF (OLD.location != NEW.location AND OLD.location IS NOT NULL) OR (OLD.quiz_date != NEW.quiz_date AND OLD.quiz_date IS NOT NULL) THEN
        SELECT
            SUM(rounds.total_score),
            SUM(rounds.total_out_of),
            COUNT(*)
        INTO
            v_total_score,
            v_total_out_of,
            v_rounds
        FROM
            rounds
        WHERE
            rounds.location = OLD.location AND
            rounds.quiz_date = OLD.quiz_date AND
            rounds.team = OLD.team;
        
        UPDATE scores
        SET
            score = COALESCE(v_total_score, 0),
            out_of = COALESCE(v_total_out_of, 10),
            rounds_played = v_rounds
        WHERE
            scores.location = OLD.location AND
            scores.quiz_date = OLD.quiz_date AND
            scores.team = OLD.team;
    END IF;

    RETURN NEW;

END
$$;