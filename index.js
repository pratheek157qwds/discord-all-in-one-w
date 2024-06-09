const config = require("./structures/configuration/index");
const { ShardingManager, ShardEvents, Client, GatewayIntentBits, Collection } = require("discord.js");
const { logger } = require("./structures/functions/logger");
const retry = require("./retry");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

// Global error handlers
process.on('unhandledRejection', (error) => {
    console.error('Unhandled promise rejection:', error);
    logger("Unhandled promise rejection", "error");
    logger(error.stack, "error");
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught exception:', error);
    logger("Uncaught exception", "error");
    logger(error.stack, "error");
});

const startClient = async () => {
    const client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildVoiceStates
        ]
    });

    client.commands = new Collection();
    client.db = db; // Make the db instance accessible

    // Load your command files and other setup here

    client.once('ready', () => {
        console.log(`Logged in as ${client.user.tag}!`);
    });

    client.on("messageCreate", async (message) => {
        if (message.author.bot) return;
        if (!message.guild) return;

        let counter = await client.db.get(`guild_${message.guild.id}.counter`);
        if (!counter) {
            counter = {
                channel: "",
                current_number: 0,
                last_user: ""
            };
            await client.db.set(`guild_${message.guild.id}.counter`, counter);
        }

        const channel = counter.channel;
        const latest_user = counter.last_user;
        const number = counter.current_number;

        if (message.channel.id !== channel) return;
        if (message.author.id == latest_user) {
            return message.react('❌');
        }
        if (parseInt(message.content) !== number + 1) {
            return message.react('❌');
        }

        counter.current_number += 1;
        counter.last_user = message.author.id;
        await client.db.set(`guild_${message.guild.id}.counter`, counter);
        message.react('✅');
    });

    client.login(config.client_token);
};

if (config.sharding) {
    const manager = new ShardingManager("./structures/client.js", { token: config.client_token, totalShards: "auto" });

    manager.on("shardCreate", shard => {
        logger(`Launched shard ${shard.id}`, "info");
    });
    manager.on(ShardEvents.Error, (shard, error) => {
        logger(`Shard ${shard.id} encountered an error: ${error.message}`, "error");
    });
    manager.on(ShardEvents.Reconnecting, (shard) => {
        logger(`Shard ${shard.id} is reconnecting.`, "info");
    });
    manager.on(ShardEvents.Death, (shard) => {
        logger(`Shard ${shard.id} has died.`, "error");
    });

    retry(() => manager.spawn()).catch(error => {
        logger(`Failed to spawn shards after retries: ${error.message}`, "error");
    });
} else {
    retry(() => startClient()).catch(error => {
        logger(`Failed to start client after retries: ${error.message}`, "error");
    });
}

if (config.database) {
    retry(() => require("./structures/database/connect").connect()).catch(error => {
        logger(`Failed to connect to database after retries: ${error.message}`, "error");
    });
}
