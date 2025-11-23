import { SlashCommandBuilder, AttachmentBuilder } from "discord.js";
import config from "../../../config/config.json" with { type: "json" };

const { MagicConchURL } = config;

export default {
  data: new SlashCommandBuilder()
    .setName("magicconch")
    .setDescription("Replies with the magic conch."),

  async execute(interaction) {
    try {
      const file = new AttachmentBuilder(MagicConchURL, {
        name: "MagicConch.png", // proper image filename
      });

      const number = Math.floor(Math.random() * 2);

      if (file) {
        number == 1
          ? await interaction.reply({
              content: "Yes.",
              files: [file],
            })
          : await interaction.reply({
              content: "No.",
              files: [file],
            });
      }
    } catch (e) {
      console.log("[ERROR] - Error processing user command - [blackjesus]", e);
    }
  },
};

/*
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣀⡤⠖⠒⠒⣦⠖⠒⠒⢦⠤⠤⢤⡀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⣀⣀⡴⠋⠀⠈⡄⠀⠀⠀⠸⡄⠀⠀⠀⡇⠀⠀⠙⡖⠲⢄⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⣠⠞⠁⠙⣄⠀⠀⠀⠘⠀⠀⠀⠀⠹⡀⠀⠀⢱⠀⠀⠀⠃⠀⠈⡷⣄⠀⠀
⠀⠀⠀⠀⡤⠒⢧⡀⠀⠀⠘⠄⠀⠀⠀⠱⡄⠀⠀⠀⢧⠀⠀⠘⠀⠀⠀⢀⠀⠀⡧⠈⣇⠀
⠀⠀⠀⣾⠀⠀⠀⠑⣄⠀⠀⠈⢂⠀⠀⠀⠸⡄⠀⠀⠘⡄⠀⠀⡆⠀⠀⠈⠀⢀⠇⢀⠟⡆
⠀⠀⣠⠟⢄⠀⠀⠀⠈⢦⡀⠀⠀⠓⡀⠀⠀⠸⡀⠀⠀⠃⠀⠀⠇⠀⠀⠀⠀⢸⠄⡾⡰⣇
⠀⢰⠃⠀⠈⠳⣄⠀⠀⠀⠑⡄⠀⠀⠀⣄⠀⠀⠱⡀⠀⢘⠀⠀⢸⠀⠀⡃⠀⡜⠀⡱⡱⡝
⠀⢸⡄⠀⠀⠀⠈⠣⡀⠀⠀⠘⠢⠀⠀⠈⠀⠀⠀⠱⡀⠀⢇⠀⢸⠀⠀⠇⠀⡏⢠⢣⣿⡇
⢰⡇⠈⠓⠄⠀⠀⠀⠈⠢⡀⠀⠀⠐⣄⠀⠀⠠⡀⠀⠳⠀⠀⡀⠀⡄⠀⡇⢰⠀⡜⢜⡞⠀
⠀⢳⠀⠀⠀⠀⠀⠀⠀⠀⠈⠒⠀⠀⠈⠂⠀⠀⠱⡀⠀⢣⠀⠁⠀⡃⠀⡇⡞⢠⢁⡞⠀⠀
⠀⢯⠉⠲⢄⡀⠀⠀⠀⢀⡀⠀⠀⠳⣄⠀⠀⠀⠀⠑⡄⠈⢧⠀⠀⢸⠀⡇⠃⣜⡞⣧⡀⠀
⠀⠈⢢⣄⠀⠉⠒⠂⠀⠀⠉⠒⢄⡀⠈⠳⢄⠀⠀⠀⠘⠄⠈⢆⠀⠈⠀⡇⢰⣟⡴⠉⣱⠀
⠀⠀⠘⢦⡉⠒⠤⠄⣀⠀⠀⠀⠀⠈⠓⠀⡀⠑⠦⡀⢀⠀⢀⠘⠀⠀⠇⢀⣿⠞⡠⠊⡹⡄
⠀⠀⠀⠀⠹⣍⡑⠒⠀⠀⠤⠤⢀⣀⡀⠀⠀⠉⠲⢌⠈⠳⣄⠃⡀⠀⡇⣸⠋⣨⣴⡮⠖⠃
⠀⠀⠀⠀⠀⠈⠙⠫⠭⣍⣉⣒⣒⣒⣂⣬⣭⣶⣦⣤⣍⣢⣄⡲⢵⣄⢀⠿⠛⠋⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠉⠁⠀⠸⡉⠁⠀⣀⡉⠭⠭⣿⣿⠟⠛⠉⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢹⣁⡠⠤⠖⢊⡽⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠣⠖⠋⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
**/
