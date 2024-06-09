const { EmbedBuilder, PermissionsBitField, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: 'clear',
    description: 'Clear messages 😁',
    options: [
        {
            name: 'amount',
            description: 'How many messages you want to clear (1-100)',
            type: ApplicationCommandOptionType.Integer,
            required: true,
            minValue: 1,   
            maxValue: 100,
        }
    ],

    run: (client, interaction) => {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages) && !interaction.member.roles.cache.some((r) => r.name === "Deletes")) {
            return interaction.reply({
                content:  " You don't have permissions (Manage Messages) or the (Deletes) role.",
                ephemeral: true
            });
        }

        const amount = interaction.options.getInteger('amount');

        // Input Validation: Ensure amount is within allowed limits
        if (amount < 1 || amount > 100) {
            return interaction.reply({ 
                content: 'Please enter a number between 1 and 100.', 
                ephemeral: true 
            });
        }

        interaction.channel.bulkDelete(amount)
            .then(messages => {
                const embed = new EmbedBuilder()
                    .setColor("Blue")
                    .setDescription(`Done Deleted ${messages.size} message(s) Successfully `)
                    .setTimestamp();

                interaction.reply({ embeds: [embed], ephemeral: true }); 
            })
            .catch(error => {
                console.error('Error bulk deleting messages:', error);
                interaction.reply({ content: 'An error occurred while deleting messages. Make sure the messages are not older than 14 days.', ephemeral: true });
            });
    }
};