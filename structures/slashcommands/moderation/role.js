const { Client, CommandInteraction, ApplicationCommandOptionType, PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'role',
    description: 'Add, remove, or view a role for a member',
    options: [
        {
            name: 'action',
            description: 'Add, remove, or view the role',
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                { name: 'Add', value: 'add' },
                { name: 'Remove', value: 'remove' },
                { name: 'View', value: 'view' }
            ]
        },
        {
            name: 'role',
            description: 'The role to add, remove, or view',
            type: ApplicationCommandOptionType.Role,
            required: true,
        },
        {
            name: 'member',
            description: 'The member to modify the role for (not required for view)',
            type: ApplicationCommandOptionType.User,
            required: false,
        }
    ],

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */
    run: async (client, interaction) => {
        const action = interaction.options.getString('action');
        const role = interaction.options.getRole('role');
        const member = interaction.options.getMember('member');

        const abusiveReplies = [
            "Who do you think you are, trying to use this command?",
            "Nice try, but you don't have the power here.",
            "Stick to your lane, buddy. You're not allowed to use this command.",
            "Don't even think about it. You can't use this command.",
            "Know your place! This command isn't for you.",
            "Back off! You don't have the permissions to use this.",
            "Stay in your lane! You can't use this command."
        ];

        // Check if the user has the manage roles permission
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
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
            if (!botMember.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
                return interaction.followUp({
                    embeds: [{
                        color: 0xFF0000,
                        title: 'Error',
                        description: `I don't have permission to manage roles.`,
                    }]
                });
            }if (action === 'view') {
                // View the role permissions
                const permissionsArray = role.permissions.toArray();
                const permissionsList = permissionsArray.map(permission => `\`${permission}\``).join('\n');
                return interaction.followUp({
                    embeds: [{
                        color: 0x00FF00,
                        title: 'Role Permissions',
                        description: `The ${role.name} role has the following permissions:`,
                        fields: [
                            {
                                name: 'Permissions',
                                value: permissionsList || 'No permissions assigned.',
                            }
                        ],
                    }]
                });            
            } else if (action === 'add') {
                if (!member) {
                    return interaction.followUp({
                        embeds: [{
                            color: 0xFF0000,
                            title: 'Error',
                            description: `You must specify a member to add the role to.`,
                        }]
                    });
                }

                if (member.roles.cache.has(role.id)) {
                    return interaction.followUp({
                        embeds: [{
                            color: 0xFF0000,
                            title: 'Error',
                            description: `The member already has the ${role.name} role.`,
                        }]
                    });
                }

                await member.roles.add(role);
                await interaction.followUp({
                    embeds: [{
                        color: 0x00FF00,
                        title: 'Role Added',
                        description: `${role.name} role has been added to ${member.user.tag}.`,
                    }]
                });
            } else if (action === 'remove') {
                if (!member) {
                    return interaction.followUp({
                        embeds: [{
                            color: 0xFF0000,
                            title: 'Error',
                            description: `You must specify a member to remove the role from.`,
                        }]
                    });
                }

                if (!member.roles.cache.has(role.id)) {
                    return interaction.followUp({
                        embeds: [{
                            color: 0xFF0000,
                            title: 'Error',
                            description: `The member does not have the ${role.name} role.`,
                        }]
                    });
                }

                await member.roles.remove(role);
                await interaction.followUp({
                    embeds: [{
                        color: 0x00FF00,
                        title: 'Role Removed',
                        description: `${role.name} role has been removed from ${member.user.tag}.`,
                    }]
                });
            } else {
                return interaction.followUp({
                    embeds: [{
                        color: 0xFF0000,
                        title: 'Error',
                        description: `Invalid action specified.`,
                    }]
                });
            }
        } catch (error) {
            console.error('An error occurred while processing the role command:', error);

            let errorMessage = 'An error occurred while processing your request.';
            if (error.code === 50013) {
                errorMessage = 'I do not have the required permissions to manage roles for this member.';
            }

            await interaction.followUp({
                embeds: [{
                    color: 0xFF0000,
                    title: 'Error',
                    description: errorMessage,
                }]
            });
        }
    },
};