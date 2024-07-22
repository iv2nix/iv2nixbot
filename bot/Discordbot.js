const filesloader = require("../utils/filesLoader");
const path = require("node:path");
const {EventEmitter} = require("node:events");
const {Client} = require("discord.js");

async function handleBot (opts) {
    const plugs = await filesloader.loadFiles(path.join(__dirname, "../discordplugs"));
    const bot = new EventEmitter();
    bot._client = new Client(opts.client);
    bot._client.login(opts.token);
    for(const plug of plugs) plug.injectTo(bot);
    return bot;
}

module.exports = {handleBot};
