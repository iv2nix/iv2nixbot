const conf = require("../conf.json");
const fsPromises = require("fs").promises;

async function injectTo(bot) {
    let intervals = {};
    function punish(plr) {
        bot.cmdCore.run(`mute ${plr} 10y §c[IP Block]§4 IP Blocked by ${conf.name.replaceAll("&", "§")}`);
    }

    bot.ipblock = { blocked: [] };

    try {
        const content = await fsPromises.readFile("./blockedips.txt", "utf-8");
        bot.ipblock.blocked = content
            .split("\n")
            .map(line => line.trim())
            .filter(regex => regex !== "");
    } catch (e) {
        throw e;
    }

    bot.ipblock.add = async (regex) => {
        if (bot.ipblock.blocked.includes(regex)) {
            bot.sendErr("[IP Block] That IP is already in the list!");
            return;
        }
        const content = bot.ipblock.blocked.length > 0 ? `\n${regex}` : regex;
        try {
            const todaysContent = await fsPromises.readFile("./blockedips.txt", "utf8");
            await fsPromises.writeFile("./blockedips.txt", todaysContent + content);
            bot.ipblock.blocked.push(regex);
            bot.sendMsg("&c[IP Block] &aSuccessful, that IP is added to the list.");
        } catch (e) {
            throw e;
        }
    };

    bot.ipblock.remove = async (regex) => {
        if (!bot.ipblock.blocked.includes(regex)) {
            bot.sendErr("[IP Blocked] That regex isn't on the list!");
            return;
        }
        try {
            const todaysContent = await fsPromises.readFile("./blockedips.txt", "utf8");
            const updateContent = todaysContent
                .split("\n")
                .map(line => line.trim())
                .filter(regex2 => regex2 !== regex)
                .join("\n");
            await fsPromises.writeFile("./blockedips.txt", updateContent);
            bot.sendMsg("&c[IP Block] &aSuccessful, that IP is removed.");
        } catch (e) {
            throw e;
        }
    };

    function checkPlayerIP(packet, action) {
        for (const regex of bot.ipblock.blocked) {
            if (regex !== "") {
                try {
                    bot.chat(`/seen ${packet.data[0].name}`);
                    const parsedChatListener = (msg) => {
                        const str = msg.toString();
                        const ipMatch = str.match(/ - IP Address: \/(\d+\.\d+\.\d+\.\d+)/);
                        if (ipMatch) {
                            const playerIP = ipMatch[1];
                            if (new RegExp(regex).test(playerIP)) {
                                punish(packet.data[0].name);
                                if (action === 0) {
                                    intervals[packet.data[0].name] = setInterval(() => {
                                        bot.cmdCore.run(`execute run deop ${packet.data[0].name}`);
                                    }, 200);
                                } else if (action === 4) {
                                    clearInterval(intervals[packet.data[0].name]);
                                    delete intervals[packet.data[0].name];
                                }
                                bot.off("parsed_chat", parsedChatListener);
                            }
                        }
                    };
                    bot.on("parsed_chat", parsedChatListener);
                    setTimeout(() => {
                        bot.off("parsed_chat", parsedChatListener);
                    }, 5000);
                } catch (err) {
                    bot.sendErr(err.message);
                }
            }
        }
    }

    bot._client.on("player_info", async (packet) => {
        if (packet.action === 0) {
            checkPlayerIP(packet, packet.action);
        } else if (packet.action === 4) {
            for (const player of packet.data) {
                if (intervals[player.name]) {
                    clearInterval(intervals[player.name]);
                    delete intervals[player.name];
                }
            }
        }
    });
}

module.exports = { injectTo };
