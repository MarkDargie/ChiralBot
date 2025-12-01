import pg from "pg";
import { ConnectionPool } from "./config/db-config.js";

/**
 * Fetches all reminders from the database.
 * Uses the shared ConnectionPool to run a SELECT query on chiral.reminder.
 * Logs the result rows and returns them, or logs an error if the query fails.
 */
export async function GetRemindersAsync() {
  try {
    const result = await ConnectionPool.query("SELECT * FROM chiral.get_reminders()");
    console.log("[DATABASE] Calling Reminders: ", result.rows);
    return result.rows;
  } catch (e) {
    console.log(
      "[ERROR] error processing database request for [GetRemindersAsync]",
      e
    );
  }
}

/**
 * Inserts multiple reminders into the database using a stored procedure.
 * Maps the incoming reminders to the expected shape, converts them to JSON,
 * and calls chiral.insert_reminders_proc(jsonb) with that payload.
 * Logs any errors that occur during the insert process.
 *
 * @param {Array} reminders - Array of reminder objects with value, userid, and serverid.
 */
export async function InsertRemindersAsync(reminders) {
  try {
    const mappedReminders = reminders.map((x) => ({
      body: x.body,
      timestamp: x.timestamp,
      createduserid: x.userid,
      createdserverid: x.serverid,
      active: true,
    }));

    const remindersJson = JSON.stringify(mappedReminders);
    const query = "CALL chiral.insert_reminders($1::json);";

    console.log("[DATABASE] Inserting Reminders: ", remindersJson);

    await ConnectionPool.query(query, [remindersJson]);
  } catch (e) {
    console.log(
      "[ERROR] error processing database request for [InsertRemindersAsync]",
      e
    );
  }
}

