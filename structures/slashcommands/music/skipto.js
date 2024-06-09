const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'skipto',
    description: 'Skips to a specific track number in the queue',
    inVoice: true,
    sameVoice: true,
    player: true,
    options: [
        {
            name: 'number',
            type: 4, // Correct type for INTEGER
            description: 'The number of tracks to skip',
            required: true,
        }
    ],
    run: (client, interaction) => {
        const player = client.riffy.players.get(interaction.guild.id);
        const skipNumber = interaction.options.getInteger('number');

        if (skipNumber < 1 || skipNumber > 99) {
            const embed = new EmbedBuilder()
                .setColor('#2f3136')
                .setTitle('Error')
                .setDescription('Please provide a valid number between 1 and 99.');
            return interaction.reply({ embeds: [embed] });
        }

        const queueLength = player.queue.length;

        if (skipNumber > queueLength) {
            const embed = new EmbedBuilder()
                .setColor('#2f3136')
                .setTitle('Error')
                .setDescription('Are you dumb? You can\'t skip more songs than are in the queue.');
            return interaction.reply({ embeds: [embed] });
        }

        player.queue.splice(0, skipNumber - 1);
        player.stop();

        const embed = new EmbedBuilder()
            .setColor('#2f3136')
            .setTitle('Skipped')
            .setDescription(`Skipped ${skipNumber} track(s).`);
        return interaction.reply({ embeds: [embed] });
    },
};
