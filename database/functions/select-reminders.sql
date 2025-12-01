CREATE OR REPLACE FUNCTION chiral.get_reminders()
RETURNS TABLE (
    id              uuid,
    body            text,
	"timestamp"		text,
    userid		    text,
    serverid		text
)
LANGUAGE sql
AS $$
  SELECT 
  	id, 
	body, 
	"timestamp", 
	createduserid as "userid", 
	createdserverid as "serverid"
  FROM 
  	chiral.reminder
  WHERE 
  	active = TRUE;
$$;