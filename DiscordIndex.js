
const { handleBot } = require("./bot/Discordbot.js");
const { GatewayIntentBits, Partials } = require("discord.js");
require("dotenv").config();

(async() => {
    let bot = await handleBot({
        token: process.env.DISCORD_TOKEN,
        client: {
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent
            ],
            partials: [
                Partials.Channel
            ]
        }
});

module.exports = bot;
})();
