const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'clearqueue',
    description: 'Clears all songs in the queue except the current playing song',
    inVoice: true,
    sameVoice: true,
    player: true,

    run: (client, interaction) => {
        const player = client.riffy.players.get(interaction.guild.id);

        if (!player || !player.current) {
            const embed = new EmbedBuilder()
                .setColor('#2f3136')
                .setTitle('Error')
                .setDescription('Are you dumb? There are nothing currently being played.');
            return interaction.reply({ embeds: [embed] });
        }

        player.queue.clear(); // Clears the queue while keeping the current song

        const embed = new EmbedBuilder()
            .setColor('#2f3136')
            .setTitle('Queue Cleared')
            .setDescription('The queue has been cleared, but the current song will continue playing.');
        return interaction.reply({ embeds: [embed] });
    },
};
