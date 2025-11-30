import { SlashCommandBuilder } from "discord.js";
import {
  ProcessReminderDate,
  InsertReminders,
} from "../../modules/reminders/reminder-handler.js";

/* 
    reminders todo - 
    reminder frequency (weekly, montthy ect and every X days)
    add user/users to @ when the remidner pops if possible
    allow to delete reminder by id ? (show unique id in the response when created)
    list all reminders 
    store the string as json in the collection ?
*/
export default {
  cooldown: 10,
  // Slash command data that gets registered with Discord
  data: new SlashCommandBuilder()
    .setName("remind") // /ask
    .setDescription("Set reminders...")
    .addStringOption((option) =>
      option
        .setName("reminder")
        .setDescription("Content of the reminder")
        .setRequired(true)
    )
    // needs to handle dd-mm-yyyy / dd-mm or ddmm or dd
    .addStringOption((option) =>
      option
        .setName("date")
        .setDescription("Accepts formats: dd-mm-yyy / dd-mm / dd ")
        .setRequired(true)
        .setMaxLength(10)
        .setMinLength(2)
    )
    // needs to allow hours and minutes (14:30 or 1430 or just 14)
    .addStringOption((option) =>
      option
        .setName("time")
        .setDescription("Accepts formats: 14:30 / 1440 / 14")
        .setRequired(true)
        .setMaxLength(5)
        .setMinLength(2)
    ),
  async execute(interaction) {
    try {
      const { client } = interaction;
      if (interaction && client) {
        const reminder = interaction.options.getString("reminder");
        const date = interaction.options.getString("date");
        const time = interaction.options.getString("time");
        let serverReminders = [];

        const normalisedReminder = interaction.options
          .getString("reminder")
          .replace(/[^a-zA-Z0-9 ]/g, "");

        console.log("[REMINDER] Processing Reminder: ", reminder, date, time);

        const formattedDate = ProcessReminderDate(date, time);

        if (client.reminders) {
          const currentServerReminders = client.reminders.get("server-reminders");
          const userId = interaction.member.id;
          const serverId = process.env.GUILD;
          const serverReminder = {
            value: formattedDate,
            userid: userId,
            serverid: serverId,
          };
          // TODO need to figure out how we want to store these
          // tb needs to store both value of reminder nad the datetime stamp
          // 
          serverReminders.push(serverReminder);
          currentServerReminders.set(userId, serverReminders);
        }

        await interaction.reply({
          content: `Reminder Set: ${formattedDate} :calendar_spiral:`,
        });

        if (serverReminders && serverReminders.length) {
          await InsertReminders(serverReminders);
        }
      }
    } catch (e) {
      console.log("[ERROR] Error processing user command - [remind]", e);
    }
  },
};
