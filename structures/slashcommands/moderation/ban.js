const { Client, CommandInteraction, ApplicationCommandOptionType, PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'ban',
    description: 'Ban a member from the server',
    options: [
        {
            name: 'member',
            description: 'The member to ban',
            type: ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: 'reason',
            description: 'The reason for banning the member',
            type: ApplicationCommandOptionType.String,
            required: false,
        }
    ],

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     * @param {String[]} args
     * @returns 
     */
    run: async (client, interaction) => {
        const member = interaction.options.getMember('member');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        const abusiveReplies = [
            "Who do you think you are, trying to use this command?",
            "Nice try, but you don't have the power here.",
            "Stick to your lane, buddy. You're not allowed to use this command.",
            "Don't even think about it. You can't use this command.",
            "Know your place! This command isn't for you.",
            "Back off! You don't have the permissions to use this.",
            "Stay in your lane! You can't use this command."
        ];

        // Check if the user has the ban members permission
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            const abusiveReply = abusiveReplies[Math.floor(Math.random() * abusiveReplies.length)];
            return interaction.reply({
                embeds: [{
                    color: 0xFF0000,
                    title: 'Permission Denied',
                    description: abusiveReply,
                }],
                ephemeral: true
            });
        }

        // Acknowledge the interaction immediately
        await interaction.deferReply();

        try {
            // Fetch the bot's member object
            const botMember = await interaction.guild.members.fetch(client.user.id);

            // Check if bot has necessary permissions
            if (!botMember.permissions.has(PermissionsBitField.Flags.BanMembers)) {
                return interaction.followUp({
                    embeds: [{
                        color: 0xFF0000,
                        title: 'Error',
                        description: `I don't have permission to ban members.`,
                    }]
                });
            }

            // Check if the member is bannable by the bot
            if (!member || !member.bannable) {
                return interaction.followUp({
                    embeds: [{
                        color: 0xFF0000,
                        title: 'Error',
                        description: `I cannot ban ${member ? member.user.tag : 'this user'} because they have a higher role or I lack permissions.`,
                    }]
                });
            }

            // Ban the member
            await member.ban({ reason });
            await interaction.followUp({
                embeds: [{
                    color: 0x00FF00,
                    title: 'Member Banned',
                    description: `${member.user.tag} has been banned from the server.\nReason: ${reason}`,
                }]
            });

        } catch (error) {
            console.error('An error occurred while processing the ban command:', error);
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
