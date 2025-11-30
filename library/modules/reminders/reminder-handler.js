import moment from "moment";

const momentDateFormats = ["DD-MM-YYYY", "DD-MM-YY", "DD-MM"];
const momentTimeFormats = ["HH:mm", "HHmm", "HH"];
const momentExportFormat = "DD-MM-YYYY HH:mm";

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
