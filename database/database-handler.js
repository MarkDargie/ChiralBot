import pg from "pg";
import { ConnectionPool } from "./config/db-config.js";

export async function GetRemindersAsync() {
  try {
    const result = await ConnectionPool.query("SELECT * FROM chiral.reminder");
    console.log("[DATABASE] Calling Reminders: ", result.rows);
    return result.rows;
  } catch (e) {
    console.log(
      "[ERROR] error processing database request for [GetRemindersAsync]",
      e
    );
  }
}

export async function InsertRemindersAsync(reminders) {
  try {
    const mappedReminders = reminders.map((x) => ({
      value: x.value,
      createduserid: x.userid,
      createdserverid: x.serverid,
      active: true,
    }));
    const remindersJson = JSON.stringify(mappedReminders);
    const query = "CALL chiral.insert_reminders_proc($1::jsonb);";

    await pool.query(query, [remindersJson]);
  } catch (e) {
    console.log(
      "[ERROR] error processing database request for [InsertRemindersAsync]",
      e
    );
  }
}
