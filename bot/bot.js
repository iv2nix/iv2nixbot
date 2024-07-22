const mcp = require("minecraft-protocol");
const path = require("node:path");
const {EventEmitter} = require("node:events");
const filesLoader = require("../utils/filesLoader.js");

async function handleBot (opts) {
    const plugs = await filesLoader.loadFiles(path.join(__dirname, "../plugs"));

    const bot = new EventEmitter();
    bot.opts = opts;
    bot._client = mcp.createClient(opts);

    bot.write = (packetName, opts) => bot._client.write(packetName, opts);
    bot.loadPlugs = () => {
        for(const plug of plugs) plug.injectTo(bot);
    }
    bot.stop = (reason = "end") => {
        bot.emit("stop", reason);
        bot.removeAllListeners();
        bot._client.end();
        bot._client.removeAllListeners();
    };

    bot.loadPlugs();
    bot._client.on("connect", () => {
        bot.emit("connecting", opts);
    });
    bot._client.on("error", (err) => {
        bot.emit("err", err);
    });
    bot._client.on("end", (reason) => {
        bot.emit("stop", reason);
    });
    bot._client.on("kick_disconnect", (packet) => {
        const parsedMsg = JSON.parse(packet.reason);
        bot.emit("stop", parsedMsg, "kick_disconnect");
    });
    bot._client.on("disconnect", (packet) => {
        const parsedMsg = JSON.parse(packet.reason);
        bot.emit("stop", parsedMsg, "disconnect");
    });

    return bot;
}

module.exports = {handleBot};
