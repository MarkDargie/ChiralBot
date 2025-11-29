import moment from "moment";

const momentDateFormats = ["DD-MM-YYYY", "DD-MM-YY", "DD-MM"];
const momentTimeFormats = ["HH:mm", "HHmm", "HH"];
const momentExportFormat = "DD-MM-YYYY HH:mm";

export const ProcessReminderDate = (reminderDate, reminderTime) => {
  try {
    let formattedDate;
    let formattedTime;

    formattedDate = moment(reminderDate, momentDateFormats);

    console.log("Processed Date Step 1: ", formattedDate);

    if (reminderTime) {
      formattedTime = moment(reminderTime, momentTimeFormats);
      formattedDate.set({
        hour: formattedTime.hour(),
        minute: formattedTime.minute(),
        second: 0,
        millisecond: 0,
      });
    }

    console.log("Processed Date Step 2: ", formattedDate);

    console.log("Processed Date Step 3: ", formattedDate.format(momentExportFormat).toString());

    return formattedDate.format(momentExportFormat).toString()
  } catch (e) {
    console.log(
      "[REMINDER-HANDLER] error processing reminder date and time",
      e
    );
  }
};

export const CheckValidReminderDate = (reminderDate) => {
  try {
    //const formattedDate = new Date(reminderDate);

    //const formattedDate = moment().format(reminderDate);
    const formattedDate = moment(reminderDate, momentDateFormats);

    console.log("VALID DATE", formattedDate.toString());

    if (formattedDate && formattedDate instanceof Date && !isNaN(formattedDate))
      return true;

    return false;
  } catch (e) {
    console.log(
      "[REMINDER-HANDLER] error processing reminder valid date check",
      e
    );
  }
};

export const CheckValidReminderTime = (reminderTime) => {
  try {
    let date = new Date();

    //console.log('VALID TIME BEFORE', date);

    date.setHours(reminderTime);

    //console.log('VALID TIME AFTER', date);
  } catch (e) {
    console.log(
      "[REMINDER-HANDLER] error processing reminder valid time check",
      e
    );
  }
};
