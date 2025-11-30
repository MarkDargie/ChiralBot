import moment from "moment";
import { GetRemindersAsync, InsertRemindersAsync } from "../../../database/database-handler.js";
// setting contant formats to use for mapping
const momentDateFormats = ["DD-MM-YYYY", "DD-MM-YY", "DD-MM"];
const momentTimeFormats = ["HH:mm", "HHmm", "HH"];
const momentExportFormat = "DD-MM-YYYY HH:mm";

/**
 * Parses and combines a reminder date and optional time using Moment.js.
 * Accepts multiple input formats for date and time, merges them into a single Moment,
 * normalizes the time (or leaves it at default if none provided), and returns
 * a formatted date-time string using momentExportFormat. Logs errors if parsing fails.
 *
 * @param {string} reminderDate - The user-provided date string to parse.
 * @param {string} [reminderTime] - Optional user-provided time string to merge with the date.
 * @returns {string|undefined} A formatted date-time string, or undefined if an error occurs.
 */
export const ProcessReminderDate = (reminderDate, reminderTime) => {
  try {
    let formattedDate;
    let formattedTime;

    formattedDate = moment(reminderDate, momentDateFormats);

    if (reminderTime) {
      formattedTime = moment(reminderTime, momentTimeFormats);
      formattedDate.set({
        hour: formattedTime.hour(),
        minute: formattedTime.minute(),
        second: 0,
        millisecond: 0,
      });
    }

    return formattedDate.format(momentExportFormat).toString();
  } catch (e) {
    console.log(
      "[REMINDER-HANDLER] error processing reminder date and time",
      e
    );
  }
};

/**
 * Wrapper around GetRemindersAsync to fetch all reminders.
 * Delegates to the database layer and returns the retrieved reminders,
 * logging an error if the underlying async call fails.
 *
 * @returns {Promise<Array|undefined>} A promise resolving to an array of reminders, or undefined on error.
 */
export const GetReminders = async () => {
  try{
    return await GetRemindersAsync();
  }
  catch(e){
    console.log(
      "[REMINDER-HANDLER] error processing get reminders request",
      e
    );
  }
}

/**
 * Wrapper around InsertRemindersAsync to insert one or more reminders.
 * Forwards the provided reminders to the database layer and logs any error
 * that occurs during the insert operation.
 *
 * @param {Array} reminders - Array of reminder objects to be inserted.
 * @returns {Promise<void>} A promise that resolves when the insert completes or logs an error on failure.
 */
export const InsertReminders = async (reminders) => {
  try{
    await InsertRemindersAsync(reminders);
  }
  catch(e){
    console.log(
      "[REMINDER-HANDLER] error processing get reminders request",
      e
    );
  }
}

/**
 * Validates a reminder date string against the allowed Moment.js date formats.
 * Attempts to parse the supplied date using momentDateFormats and returns whether
 * the resulting Moment instance is considered valid.
 *
 * @param {string} reminderDate - The user-provided date string to validate.
 * @returns {boolean} True if the date parses as a valid Moment, otherwise false.
 */
export const CheckValidReminderDate = (reminderDate) => {
  try {
    const formattedDate = moment(reminderDate, momentDateFormats);
    return formattedDate.isValid();
  } catch (e) {
    console.log(
      "[REMINDER-HANDLER] error processing reminder valid date check",
      e
    );
    return false;
  }
};

/**
 * Validates a reminder time string against the allowed Moment.js time formats.
 * Attempts to parse the supplied time using momentTimeFormats and returns whether
 * the resulting Moment instance is considered valid.
 *
 * @param {string} reminderTime - The user-provided time string to validate.
 * @returns {boolean} True if the time parses as a valid Moment, otherwise false.
 */
export const CheckValidReminderTime = (reminderTime) => {
  try {
    const formattedTime = moment(reminderTime, momentTimeFormats);
    return formattedTime.isValid();
  } catch (e) {
    console.log(
      "[REMINDER-HANDLER] error processing reminder valid time check",
      e
    );
    return false;
  }
};
