const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'Avatar',
    description: 'Display user avatars.', // Add description here
    type: 2, // Context Menu User type 
    inVoiceChannel: false, 
    sameVoiceChannel: false,
    player: false,

    run: async (client, interaction, config, db) => {
        // Get the target user(s) (allows multiple selections in context menu)
        const users = interaction.targetUsers; 

        // Loop through each selected user
        for (const user of users.values()) {
            const member = interaction.guild.members.cache.get(user.id); // Get member object

            const embed = new EmbedBuilder()
                .setTitle(`${user.tag}'s avatar:`)
                .setImage(member.displayAvatarURL({ dynamic: true }));

            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
};
