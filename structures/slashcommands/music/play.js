
const { Client, CommandInteraction, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: 'play',
    description: 'Play a track',
    inVoice: true,
    options: [
        {
            name: 'query',
            description: 'The query to search for',
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     * @param {String[]} args
     * @returns 
     */
    run: async (client, interaction, args) => {
        const query = interaction.options.getString('query');

        // Acknowledge the interaction immediately
        await interaction.deferReply();

        try {
            const player = client.riffy.createConnection({
                guildId: interaction.guild.id,
                voiceChannel: interaction.member.voice.channel.id,
                textChannel: interaction.channel.id,
                deaf: true,
            });

            const resolve = await client.riffy.resolve({ query: query, requester: interaction.member });
            const { loadType, tracks, playlistInfo } = resolve;

            if (loadType === 'playlist') {
                for (const track of resolve.tracks) {
                    track.info.requester = interaction.member;
                    player.queue.add(track);
                }

                await interaction.followUp(`Added ${tracks.length} songs from ${playlistInfo.name} playlist.`);

                if (!player.playing && !player.paused) return player.play();

            } else if (loadType === 'search' || loadType === 'track') {
                const track = tracks.shift();
                track.info.requester = interaction.member;

                player.queue.add(track);

                await interaction.followUp(`Added **${track.info.title}** to the queue.`);

                if (!player.playing && !player.paused) return player.play();

            } else {
                return interaction.followUp(`There were no results found for your query.`);
            }

            // Check if loop is enabled and re-add the song to the queue if needed
            if (client.queueLoopEnabled) {
                player.queue.add(resolve.tracks[0]);
            }

        } catch (error) {
            console.error('An error occurred while processing the play command:', error);
            await interaction.followUp(`An error occurred while processing your request.`);
        }
    },
};
