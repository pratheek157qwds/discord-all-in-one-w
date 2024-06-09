const { EmbedBuilder } = require('discord.js');
const ms = require('ms');

module.exports = {
    name: 'queue',
    description: 'Shows the current queue',
    inVoice: true,
    sameVoice: true,
    player: true,

    run: (client, interaction) => {
        const player = client.riffy.players.get(interaction.guild.id);

        if (!player.queue.length && !player.current) {
            return interaction.reply('There is nothing in the queue.');
        }

        const queue = player.queue.length > 9 ? player.queue.slice(0, 9) : player.queue;

        const embed = new EmbedBuilder()
            .setColor('#2f3136')
            .setTitle('Now Playing')
            .setThumbnail(player.current.info.thumbnail)
            .setDescription(`[${player.current.info.title}](${player.current.info.uri}) [${ms(player.current.info.length)}]`);

        if (queue.length) {
            embed.addFields([
                {
                    name: 'Up Next',
                    value: queue.map((track, index) => `**${index + 1}.** [${track.info.title}](${track.info.uri})`).join('\n'),
                },
            ]);
        }
        
        // Autoplay Status
        const autoplayEnabled = player.autoplay;
        let autoplayStatus = autoplayEnabled ? 'Enabled' : 'Disabled';

        if (autoplayEnabled && player.queue.length === 0) {
            autoplayStatus += ' (Waiting for next track)';
        }

        embed.addField('Autoplay', autoplayStatus); 

        embed.setFooter({ text: `Queue length: ${player.queue.length} tracks` });

        return interaction.reply({ embeds: [embed.toJSON()] });
    },
};
