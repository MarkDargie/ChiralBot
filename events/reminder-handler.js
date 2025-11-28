import { Events, ActivityType } from "discord.js";
import { CustomEvent } from '../config/event.type.js';

export default {
  // This event file handles the "ClientReady" event
  name: Events.MessageCreate, // The event name this module listens for
  customType: CustomEvent.Reminder,
  async execute(interaction, reminders) {
    console.log(`[READY] Awaiting Server Reminder Events.`);

    if(interaction){
        console.log('[REMINDER] Test Interaction: ', interaction.id);
        console.log('[REMINDER] Test Reminders: ', reminders);
    }



  },
};
