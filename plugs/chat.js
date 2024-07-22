const conf = require("../conf.json")

function injectTo(bot) {
        bot.ChatMessage = require("prismarine-chat")(bot.opts.version);
    bot._client.on("system_chat", (packet) => {
        const msg = bot.ChatMessage.fromNotch(packet.content);
        bot.emit("parsed_chat", msg, packet);
    });
    bot.queue = [];
    setInterval(() => {
        if(bot.queue[0]) {
            const msg = bot.queue.shift();
            if(msg.startsWith("/")) {
                const cmd = msg.slice(1);
                const ts = BigInt(Date.now());
                bot.write("chat_command", {
                    command: cmd,
                    timestamp: ts,
                    salt: 0n,
                    argumentSignatures: []
                });
            }else{
                const ts = BigInt(Date.now());
                bot.write("chat_message", {
                    message: msg,
                    timestamp: ts,
                    salt: 0,
                    signature: Buffer.alloc(0)
                });
            }
        }
    }, 200);
    bot.chat = (msg) => bot.queue.push(msg);
    bot.sendMsg = (msg, toTarget) => {
        const json = bot.ChatMessage.MessageBuilder.fromString(`&8«${conf.name}&8»&7 ${msg}`);
        return bot.cmdCore.run(`minecraft:tellraw ${toTarget ?? "@a"} ${JSON.stringify(json)}`);
    };
    bot.sendWarn = (msg, toTarget) => {
        const json = bot.ChatMessage.MessageBuilder.fromString(`&8«${conf.name}&8»&e&l (!)&e ${msg}`);
        return bot.cmdCore.run(`minecraft:tellraw ${toTarget ?? "@a"} ${JSON.stringify(json)}`);
    };
    bot.sendErr = (msg, toTarget) => {
        const json = bot.ChatMessage.MessageBuilder.fromString(`&8«${conf.name}&8»&c&l (!)&c ${msg}`);
        return bot.cmdCore.run(`minecraft:tellraw ${toTarget ?? "@a"} ${JSON.stringify(json)}`);
    };
    bot.on("parsed_chat", (msg, packet) => {
        const str = msg.toString();
        if(str.match(/^([^:]* )?([^\s:]+): (.*)$/)){
            const match = str.match(/^([^:]* )?([^\s:]+): (.*)$/);
            const tag = match[1];
            const uname = match[2] || match[4];
            const msg = match[3] || match[5];
            bot.emit("msg", uname, msg, packet.sender, tag);
        }else if(str.match(/.*: \/.*/)){
            const uname = str.split(": ")[0];
            const cmd = str.split(": ")[1];
            bot.emit("cspy", uname, cmd);
        }
    });
}

module.exports = {injectTo};
