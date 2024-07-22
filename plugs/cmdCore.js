const conf = require("../conf.json");
const vec3 = require("vec3");
const relativePos = new vec3(0, 0, 0);

function injectTo(bot) {
    const cmdCore = {
            isCmdCore(pos) {
                return pos.x >= cmdCore.S.x && pos.x <= cmdCore.E.x && pos.y >= cmdCore.S.y && pos.y <= cmdCore.E.y && pos.z >= cmdCore.S.z && pos.z <= cmdCore.E.z;
        },
            run(cmd) {
                relativePos.x++;
                if(relativePos.x >= 16) {
                    relativePos.x = 0;
                    relativePos.y++;
                }
                if(relativePos.y >= conf.cmdCore.layers) {
                    relativePos.y = 0;
                    relativePos.z++;
                }
                if(relativePos.z >= 16) {
                    relativePos.z = 0;
                }
                bot.write("update_command_block", {
                    location: {x: cmdCore.S.x+relativePos.x, y: cmdCore.S.y+relativePos.y, z: cmdCore.S.z+relativePos.z},
                    command: cmd,
                    mode: 1,
                    flags: 0b100
                });
            },
            refillCmdCore() {
                bot.chat(`/fill ${cmdCore.S.x} ${cmdCore.S.y} ${cmdCore.S.z} ${cmdCore.E.x} ${cmdCore.E.y} ${cmdCore.E.z} minecraft:repeating_command_block{CustomName:'${JSON.stringify(bot.ChatMessage.MessageBuilder.fromString(conf.name))}'} replace`);
                bot.emit("cmdCore_refilled");
            }
        }
        bot._client.on("position", (pos) => {
            bot.pos = pos;
            bot.emit("pos", pos);
        });
        bot.on("pos", () => {
            bot.chat("&7Teleportation Detected, Resetting Core");
            refillCmdCore();
            setTimeout(() => {
                bot.cmdCore.run("say core tested. it works!");
            }, 2000);
        });

        bot.cmdCore = cmdCore;
        return cmdCore;

        function refillCmdCore() {
            cmdCore.S = new vec3(Math.floor(bot.pos.x / 16) * 16, 0, Math.floor(bot.pos.z / 16) * 16).floor();
            cmdCore.E = cmdCore.S.clone().translate(16, conf.cmdCore.layers, 16).subtract(new vec3(1, 1, 1));
            cmdCore.refillCmdCore();
    }
}

module.exports = {injectTo};
