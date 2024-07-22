const {handleBot} = require("./bot/bot.js");
const DiscordBot = require("./DiscordIndex.js");
const {invis} = require("./utils/invisibleCharGenerator.js");
const rs = require("randomstring");
const conf = require("./conf.json");
const bots = {};

function handleBots (srvrs) {
    for(const srvr of srvrs) handleSrvr(srvr);

    async function handleSrvr (srvr) {
        const opts = {
            host: srvr.host,
            port: srvr.port,
            username: `spoof${invis()}${invis()}${invis()}`,
            version: "1.19.1"
         };
        const bot = await handleBot(opts);
        bot.DiscordBot = DiscordBot;
            bots[`${srvr.host}:${srvr.port}`] = bot;
        bot.visibility = true;
            bot.once("stop", (reason) => {
                let timeout = 1000;
                if(reason.extra?.find((data) => data.text === "Wait 5 seconds before connecting, thanks! :)")) timeout = 1000 * 6;

                delete bots[`${srvr.host}:${srvr.port}`];
                setTimeout(async() => {
                    bot.stop();
                    await handleBot(opts);
                }, timeout);
            });
            bot._client.on("login", () => {
                bot.chat("/world 3");
            });
            process.on("SIGINT", () => {
                bot.sendMsg(`&c[SIGINT]&f Stopping&8 |&7 Interrupted by console`);
                setTimeout(() => {process.exit()}, 1000);
            });
            process.on("SIGTERM", () => {
                bot.sendMsg(`&c[SIGTERM]&f Stopping&8 |&7 Process terminating`);
                setTimeout(() => {process.exit()}, 1000);
            });
        }
}

handleBots(conf.srvrs);

module.exports = {bots};
