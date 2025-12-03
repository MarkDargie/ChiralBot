import { Events, ActivityType, Collection } from "discord.js";
import { CustomEvent } from "../config/event.type.js";
import { GetRemindersAsync } from "../database/database-handler.js";
import { MapRemindersToCollection, CheckCurrentValidReminders } from "../library/modules/reminders/reminder-handler.js";

export default {
  name: Events.ClientReady,
  customType: CustomEvent.Reminder,
  async execute(client) {
    try {
      console.log(`[READY] Awaiting Server Reminder Events.`);

      const reminders = client.reminders;

      if (!reminders.has("server-reminders")) {
        reminders.set("server-reminders", new Collection());
      }

      const serverReminders = client.reminders.get("server-reminders");

      console.log("[READY] Ready with reminder: ", serverReminders)

      const databaseReminders = await GetRemindersAsync();

      if(databaseReminders && databaseReminders.length > 0){
        const mappedCollection = MapRemindersToCollection(databaseReminders, serverReminders);
        reminders.set("server-reminders", mappedCollection);
      }

      // setInterval(async () => {
      //   console.log('[INTERVAL] Current Reminders Collection Size: ', serverReminders.size);
      //   const dueReminders = CheckCurrentValidReminders(serverReminders);
      //   if(dueReminders && dueReminders.length > 0){

      //   }
      // }, 5000); // check every minute for actual go-live
    } catch (e) {
      console.log(
        "[ERROR] error processing event handler logic [ClientReady-ReminderEventHandler]",
        e
      );
    }
  },
};
