import { Events, ActivityType, Collection } from "discord.js";
import { CustomEvent } from "../config/event.type.js";
import { GetRemindersAsync } from "../database/database-handler.js";

export default {
  // This event file handles the "ClientReady" event
  name: Events.ClientReady, // The event name this module listens for
  customType: CustomEvent.Reminder,
  async execute(client) {
    try {
      console.log(`[READY] Awaiting Server Reminder Events.`);

      const reminders = client.reminders;

      console.log("[READY] Ready with reminder: ", reminders)

      if (!reminders.has("server-reminders")) {
        reminders.set("server-reminders", new Collection());
        console.log("[READY] Setting Reminders: ", reminders);
      }

      const databaseReminders = await GetRemindersAsync();

      setInterval(async () => {}, 5000);
    } catch (e) {
      console.log(
        "[ERROR] error processing event handler logic [ClientReady-ReminderEventHandler]",
        e
      );
    }
  },
};
