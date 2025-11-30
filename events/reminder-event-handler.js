import { Events, ActivityType } from "discord.js";
import { CustomEvent } from "../config/event.type.js";
import { GetRemindersAsync } from "../database/database-handler.js";

export default {
  // This event file handles the "ClientReady" event
  name: Events.ClientReady, // The event name this module listens for
  customType: CustomEvent.Reminder,
  async execute(client) {
    try {
      console.log(`[READY] Awaiting Server Reminder Events.`);

      console.log("[READY] CALLING DATABASE");

      const reminders = await GetRemindersAsync();

      setInterval(async () => {}, 5000);
    } catch (e) {
      console.log(
        "[ERROR] error processing event handler logic [ClientReady-ReminderEventHandler]",
        e
      );
    }
  },
};
