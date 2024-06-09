const { EmbedBuilder } = require('discord.js');
const ms = require('ms');

module.exports = {
    name: 'nowplaying',
    description: 'Current Playing Song',
    inVoice: false,
    sameVoice: false,
    player: false,

    run: (client, interaction) => {
        const player = client.riffy.players.get(interaction.guild.id);

        if (!player || !player.current) {
            const embed = new EmbedBuilder()
                .setColor('#2f3136')
                .setTitle('Now Playing')
                .setThumbnail('https://i.imgur.com/ibWt3FD.png')
                .setDescription('There is nothing currently being played.')
            	.setURL('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
                .setFooter({ text: 'Queue length: 0 tracks by PPR' });

            return interaction.reply({ embeds: [embed] });
        }

        const queue = player.queue.length > 9 ? player.queue.slice(0, 9) : player.queue;
        const embed = new EmbedBuilder()
            .setColor('#2f3136')
            .setTitle('Now Playing')
            .setThumbnail(player.current.info.thumbnail)
            .setDescription(`[${player.current.info.title}](${player.current.info.uri}) [${ms(player.current.info.length)}]`)
            .setFooter({ text: `Queue length: ${player.queue.length} tracks by PPR` });

        return interaction.reply({ embeds: [embed] });
    }
};
