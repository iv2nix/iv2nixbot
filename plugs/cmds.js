const conf = require("../conf.json");
const filesLoader = require("../utils/filesLoader.js");
const path = require("node:path");

async function injectTo(bot) {
    bot.cmds = await filesLoader.loadFiles(path.join(__dirname, "../cmds"));
    bot.on("msg", async(uname, msg, uuid) => {
        if(msg && !msg.startsWith(conf.prefix)) return;
        if(msg && msg.startsWith(conf.prefix)) {
            const str = msg.substr(conf.prefix.length);
        const [cmdName, ...args] = str.split(" ");
        const h = {
            uname,
            msg,
            uuid,
            str,
            cmdName,
            args,
            bot,
            filesLoader,
            path,
            conf
        };
        const cmd = bot.cmds.find((cmd) => cmd.name === cmdName || (cmd.aliases&&cmd.aliases.includes(cmdName)));
        if(cmd === undefined) {
            h.bot.sendErr(`Unknown cmd: ${cmdName}`);
            return;
        }else if(cmd.mc === undefined){
            h.bot.sendWarn("That cmd was not set for mc");
            return;
        }
            if(cmd.trusted && h.args[0] !== h.bot.trustedHash && !h.bot.auth.authedUsers.includes(h.uname)) {
                h.bot.sendErr("Invalid Hash! + Not authed error");
                return;
            }

        try{
            await cmd.mc(h);
        }catch (e){
                if(e.message.startsWith("SyntaxError")) {
                    h.bot.sendErr(`[SyntaxError] A wild SyntaxError appeared! Error Msg: ${e.message}`);
                } else if(e.message.startsWith("ReferenceError")) {
                    h.bot.sendErr(`[ReferenceError] A wild ReferenceError appeared! Error Msg: ${e.message}`);
                } else if(e.message.startsWith("TypeError")) {
                    h.bot.sendErr(`[TypeError] A wild TypeError appeared! Error Msg: ${e.message}`);
                } else if(e.message.startsWith("RangeError")) {
                    h.bot.sendErr(`[RangeError] A wild RangeError appeared! Error Msg: ${e.message}`);
                } else if(e.message.startsWith("URIError")) {
                    h.bot.sendErr(`[URIError] A wild URIError appeared! Error Msg: ${e.message}`);
                } else if(e.message.startsWith("EvalError")) {
                    h.bot.sendErr(`[EvalError] A wild EvalError appeared! Error Msg: ${e.message}`);
                } else if(e.message.startsWith("AggregateError")) {
                    h.bot.sendErr(`[AggregateError] A wild AggregateError appeared! Error Msg: ${e.message}`);
                } else {
                    h.bot.sendErr(`[UnknownError] A wild unknown error appeared! Error Msg: ${e.message}`);
                }
            }
        }
});
}

module.exports = {injectTo};
