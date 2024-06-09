// File: commands/autoplay.js
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('autoplay')
    .setDescription('Toggle autoplay mode.'),

  inVoice: true,
  sameVoice: true,
  player: true,

  run: async (client, interaction) => {
    const player = client.riffy.players.get(interaction.guild.id);

    // Toggle autoplay
    player.autoplay = !player.autoplay;

    // Check and start autoplay
    if (player.autoplay && player.queue.length === 0) {
      await player.autoplayNext();
    }

    // Finals (Autoplay Reply)
    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(player.autoplay ? '#2ECC71' : '#E74C3C')  // Green if enabled, red if disabled
          .setTitle('Autoplay')
          .setDescription(`Autoplay is now ${player.autoplay ? 'enabled' : 'disabled'}.`)
      ],
      ephemeral: true  // Make the message temporary
    });
  },
};
