// uptime.js
const { Client, CommandInteraction } = require('discord.js');

module.exports = {
    name: 'uptime',
    description: 'Check the bot\'s uptime',
    run: async (client, interaction, args) => {
        const uptime = formatUptime(client.uptime);
        let color = getColorBasedOnUptime(client.uptime);
        
        await interaction.reply({
            embeds: [{
                color: color,
                title: 'Bot Uptime',
                description: `I am always up!\nI have been online for ${uptime}.`,
                timestamp: new Date()
            }]
        });
    },
};

function formatUptime(uptime) {
    const totalSeconds = uptime / 1000;
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    let uptimeString = '';
    if (days > 0) uptimeString += `${days} days, `;
    if (hours > 0) uptimeString += `${hours} hours, `;
    if (minutes > 0) uptimeString += `${minutes} minutes, `;
    uptimeString += `${seconds} seconds`;

    return uptimeString;
}

function getColorBasedOnUptime(uptime) {
    const totalSeconds = uptime / 1000;
    if (totalSeconds < 60) { // less than a minute
        return 0xff0000; // Red change according to your colour
    } else if (totalSeconds < 3600) { // less than an hour
        return 0xffa500; // Orange change according to your colour
    } else if (totalSeconds < 86400) { // less than a day
        return 0xffff00; // Yellow change according to your colour
    } else { // more than a day
        return 0x00ff00; // Green change according toyour colour
    }
}
