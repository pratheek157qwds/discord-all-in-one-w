const { Client, CommandInteraction } = require("discord.js");

module.exports = {
    name: "ping",
    description: "Obtain the bot's latency reading.",

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    run: async (client, interaction) => {
        const reply = await interaction.reply("<a:pubg_loading:1241641103711801375>");
        const ping = client.ws.ping;
        await reply.edit(`<a:pubg_loading:1241641103711801375> ${ping}ms`);
    }
};