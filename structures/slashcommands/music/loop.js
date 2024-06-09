const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'loop',
    description: 'loops the queue of songs',
    inVoice: false,
    sameVoice: false,
    player: false,

    run: (client, interaction) => {
        const embed = new EmbedBuilder()
            .setColor(0x2f3136) // Use hexadecimal integer format
            .setTitle('Compatibility Issue')
            .setDescription('There is a compatibility issue with the bot\'s voice functionalities. We are currently working on resolving it and expect it to be available within 2 days. Thank you for your patience.');

        return interaction.reply({ embeds: [embed] });
    },
};
