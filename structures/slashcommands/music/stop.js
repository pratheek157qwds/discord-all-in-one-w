module.exports = {
    name: 'stop',
    description: 'Stops the music and clears the queue',
    inVoice: true,
    sameVoice: true,
    player: true,
    run: async (client, interaction) => {
        const player = client.riffy.players.get(interaction.guild.id);

        if (!player) {
            const embed = {
                color: 0xff0000,
                description: "Are you dumb? There's nothing playing to stop."
            };
            return await interaction.reply({ embeds: [embed] });
        }
        
        player.stop();
        player.queue.clear();
        player.disconnect();

        const embed = {
            color: 0x00ff00,
            description: 'Stopped the music and cleared the queue.'
        };
        return await interaction.reply({ embeds: [embed] });
    },
};
