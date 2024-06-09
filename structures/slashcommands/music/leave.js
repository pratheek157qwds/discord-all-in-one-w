const { EmbedBuilder } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
    name: 'leave',
    description: 'Leaves the voice channel',
    inVoice: false,
    sameVoice: true,  // Ensures the user is in the same voice channel as the bot
    player: false,

    run: async (client, interaction) => {
        const player = client.riffy.players.get(interaction.guild.id);
        const voiceChannel = interaction.member.voice.channel;

        if (!voiceChannel) {
            const embed = new EmbedBuilder()
                .setColor(0x2f3136)
                .setTitle('Error')
                .setDescription('Are you dumb? Join a voice channel before using this command.');
            return interaction.reply({ embeds: [embed] });
        }

        if (player && player.voiceChannel !== voiceChannel.id) {
            const embed = new EmbedBuilder()
                .setColor(0x2f3136)
                .setTitle('Error')
                .setDescription('You must be in the same voice channel as the bot to use this command.');
            return interaction.reply({ embeds: [embed] });
        }

        if (!player) {
            const embed = new EmbedBuilder()
                .setColor(0x2f3136)
                .setTitle('Left Voice Channel')
                .setDescription('Left the voice channel as there was nothing being played.');
            return interaction.reply({ embeds: [embed] });
        } else if (!player.current) {
            player.destroy();

            const embed = new EmbedBuilder()
                .setColor(0x2f3136)
                .setTitle('Left Voice Channel')
                .setDescription('Left the voice channel as there was nothing being played.');
            return interaction.reply({ embeds: [embed] });
        } else {
            const embed = new EmbedBuilder()
                .setColor(0x2f3136)
                .setTitle('Leaving After Current Track')
                .setDescription('Will leave the voice channel after the current song is completed.');
            await interaction.reply({ embeds: [embed] });

            player.once('trackEnd', async () => {
                player.destroy();

                const leaveEmbed = new EmbedBuilder()
                    .setColor(0x2f3136)
                    .setTitle('Left Voice Channel')
                    .setDescription('Left the voice channel after the current song finished.');
                await interaction.followUp({ embeds: [leaveEmbed] });
            });
        }
    },
};
