CREATE OR REPLACE PROCEDURE chiral.insert_reminders(reminders json)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO chiral.reminder (body, timestamp, createduserid, createdserverid, active)
    SELECT
        r.body,
		r.timestamp,
        r.createduserid,
        r.createdserverid,
        COALESCE(r.active, TRUE)
    FROM json_to_recordset(reminders) AS r(
        body		      text,
		timestamp 		  text,
        createduserid     text,
        createdserverid   text,
        active           boolean
    );
END;
$$;