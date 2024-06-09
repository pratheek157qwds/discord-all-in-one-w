const { Client, CommandInteraction, ApplicationCommandOptionType, PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'voicemove',
    description: 'Move a member to a selected voice channel',
    options: [
        {
            name: 'member',
            description: 'The member to move',
            type: ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: 'channel',
            description: 'The voice channel to move the member to',
            type: ApplicationCommandOptionType.Channel,
            channelTypes: ['GUILD_VOICE'],
            required: true,
        }
    ],

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */
    run: async (client, interaction) => {
        const member = interaction.options.getMember('member');
        const channel = interaction.options.getChannel('channel');

        const abusiveReplies = [
            "Who do you think you are, trying to use this command?",
            "Nice try, but you don't have the power here.",
            "Stick to your lane, buddy. You're not allowed to use this command.",
            "Don't even think about it. You can't use this command.",
            "Know your place! This command isn't for you.",
            "Back off! You don't have the permissions to use this.",
            "Stay in your lane! You can't use this command."
        ];

        // Check if the user has the move members permission
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.MoveMembers)) {
            const abusiveReply = abusiveReplies[Math.floor(Math.random() * abusiveReplies.length)];
            return interaction.reply({ content: abusiveReply, ephemeral: true });
        }

        // Acknowledge the interaction immediately
        await interaction.deferReply();

        try {
            // Fetch the bot's member object
            const botMember = await interaction.guild.members.fetch(client.user.id);

            // Check if bot has necessary permissions
            if (!botMember.permissions.has(PermissionsBitField.Flags.MoveMembers)) {
                return interaction.followUp({
                    embeds: [{
                        color: 0xFF0000,
                        title: 'Error',
                        description: `I don't have permission to move members.`,
                    }]
                });
            }

            // Check if the member is in a voice channel
            if (!member.voice.channel) {
                return interaction.followUp({
                    embeds: [{
                        color: 0xFF0000,
                        title: 'Error',
                        description: `${member.user.tag} is not in a voice channel.`,
                    }]
                });
            }

            // Move the member to the specified voice channel
            await member.voice.setChannel(channel);
            await interaction.followUp({
                embeds: [{
                    color: 0x00FF00,
                    title: 'Member Moved',
                    description: `${member.user.tag} has been moved to ${channel.name}.`,
                }]
            });

        } catch (error) {
            console.error('An error occurred while processing the voicemove command:', error);
            await interaction.followUp({
                embeds: [{
                    color: 0xFF0000,
                    title: 'Error',
                    description: `An error occurred while processing your request.`,
                }]
            });
        }
    },
};
