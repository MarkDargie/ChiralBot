CREATE OR REPLACE PROCEDURE chiral.insert_reminders(reminders json)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO chiral.reminder (value, createduserid, createdserverid, active)
    SELECT
        r.value,
        r.createduserid,
        r.createdserverid,
        COALESCE(r.active, TRUE)
    FROM json_to_recordset(reminders) AS r(
        value            text,
        createduserid    text,
        createdserverid  text,
        active           boolean
    );
END;
$$;