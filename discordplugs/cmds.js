const conf = require("../conf.json");
const DiscordCmdHandler = require("../cmdhandler/DiscordCmdHandler.js");
const filesloader = require("../utils/filesLoader");
const path = require("node:path");

async function injectTo(bot) {
    bot.cmds = await filesloader.loadFiles(path.join(__dirname, "../cmds"));
    bot._client.on("messageCreate", async(msg) => {
        if(msg.author.id === bot._client.user.id) return;
        
        const data = msg.content;
        if(!data.startsWith(conf.discord.prefix)) return;

        const raw = data.substr(conf.discord.prefix.length);
        const [cmdName, ...args] = raw.split(" ");
        const h = new DiscordCmdHandler(bot, raw, args, msg);
        const cmd = bot.cmds.find((cmd) => cmd.name === cmdName);

        if(cmd === undefined) {
            h.sendErr(`Unknown cmd: ${cmdName}`);
            return;
        }else if(cmd.discord === undefined) {
            h.sendErr(`That cmd was not set for discord`);
            return;
        }
        if(cmd.trusted) {
            if(!msg.member.roles.cache.has(conf.trustedRoleId)) {
                h.sendErr("This cmd requires a trusted role for verification!");
                return;
            }
        }

        try{
            await cmd.discord(h);
        }catch (e){
            h.sendErr(e);
        }
    });
}

module.exports = {injectTo};
