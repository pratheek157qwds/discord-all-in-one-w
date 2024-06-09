const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'join',
    description: 'Joins the voice channel you are in',
    inVoice: false,
    sameVoice: false,
    player: false,

    run: async (client, interaction) => {
        const userVoiceChannel = interaction.member.voice.channel;
        const player = client.riffy.players.get(interaction.guild.id);

        if (!userVoiceChannel) {
            const embed = new EmbedBuilder()
                .setColor(0x2f3136)
                .setTitle('Error')
                .setDescription('Are you dumb? Join a voice channel before using this command.');
            return interaction.reply({ embeds: [embed] });
        }

        if (player && player.voiceChannel !== userVoiceChannel.id) {
            if (player.current) {
                const embed = new EmbedBuilder()
                    .setColor(0x2f3136)
                    .setTitle('Will Join After Current Track')
                    .setDescription('Will join your voice channel after the current song is completed.');
                await interaction.reply({ embeds: [embed] });

                player.once('trackEnd', async () => {
                    player.destroy(); // Destroy the current player

                    const newPlayer = client.riffy.createConnection({
                        guildId: interaction.guild.id,
                        voiceChannel: userVoiceChannel.id,
                        textChannel: interaction.channel.id,
                        deaf: true,
                    });

                    const joinEmbed = new EmbedBuilder()
                        .setColor(0x00ff00)
                        .setTitle('Joined Voice Channel')
                        .setDescription(`Joined **${userVoiceChannel.name}**.`);
                    await interaction.followUp({ embeds: [joinEmbed] });
                });
            } else {
                player.destroy(); // Destroy the current player

                const newPlayer = client.riffy.createConnection({
                    guildId: interaction.guild.id,
                    voiceChannel: userVoiceChannel.id,
                    textChannel: interaction.channel.id,
                    deaf: true,
                });

                const embed = new EmbedBuilder()
                    .setColor(0x2f3136)
                    .setTitle('Joined Voice Channel')
                    .setDescription(`Joined **${userVoiceChannel.name}**.`);
                return interaction.reply({ embeds: [embed] });
            }
        } else {
            client.riffy.createConnection({
                guildId: interaction.guild.id,
                voiceChannel: userVoiceChannel.id,
                textChannel: interaction.channel.id,
                deaf: true,
            });

            const embed = new EmbedBuilder()
                .setColor(0x2f3136)
                .setTitle('Joined Voice Channel')
                .setDescription(`Joined **${userVoiceChannel.name}**.`);
            return interaction.reply({ embeds: [embed] });
        }
    },
};
