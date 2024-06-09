const client = require("../../client");
const { PermissionsBitField } = require("discord.js");
const { client_prefix, developers } = require("../../configuration/index");
const { logger } = require("../../functions/logger");
// Assuming your data is in a separate file

client.on("messageCreate", async (message) => {
  try {
    if (message.author.bot || !message.guild || !message.content.startsWith(client_prefix)) {
      return;
    }

    const args = message.content.slice(client_prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    if (cmd.length === 0) return;

    let command = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd)); // Existing command handling

    if (command) {
      // Existing command access and permission checks

      if (command) command.run(client, message, args); // Existing command execution
    } else { // Handle counting logic if no command matches
      const guildId = message.guild.id;

      // Check if counting is enabled for this guild (optional)
      if (!countingData[guildId]) {
        return; // Don't handle counting if not enabled
      }

      // Existing counting logic (adapted from counting.js)
      if (message.channel.id !== countingData[guildId].channel) return;

      const content = message.content.trim();
      const number = parseInt(content);

      if (isNaN(number)) {
        // Handle invalid input (e.g., reset counter)
        return; // Implement logic for handling invalid input (optional)
      }

      const expectedNumber = countingData[guildId].current_number + 1;

      if (number === expectedNumber) {
        // Update counting data
        countingData[guildId].current_number = number;
        countingData[guildId].last_user = message.author.id;

        // Write updated data back to the file
        require('fs').writeFileSync(path.join(__dirname, 'counting_data.json'), JSON.stringify(countingData, null, 2)); // Assuming counting_data.json is in the same directory

        // Send confirmation message (optional)
        message.channel.send(`Correct! Current number is ${number}.`);
      } else {
        // Reset counting due to incorrect number
        countingData[guildId].current_number = 0;
        countingData[guildId].last_user = '';

        require('fs').writeFileSync(path.join(__dirname, 'counting_data.json'), JSON.stringify(countingData, null, 2));

        message.channel.send('Counting reset due to incorrect number.');
      }
    }
  } catch (err) {
    logger("An error occurred while executing the messageCreate event:", "error");
    console.log(err);

    return message.channel.send(`An error occurred while executing the messageCreate event:\n${err}`);
  }
});
