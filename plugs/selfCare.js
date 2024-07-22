function injectTo(bot) {
    let op = true;
    let creative = true;
    let vanish = false;
    let cspy = false;
    let muted = false;
    let lastOp = false;
    let lastCreative = false;
    let lastVanish = true;
    let lastCspy = true;
    let lastMuted = false;

    bot.on("parsed_chat", (msg) => {
        const str = msg.toString();

        if (bot.visibility) {
            if (str.endsWith(": disabled")) {
                vanish = false;
            } else if (str.endsWith(": enabled")) {
                vanish = true;
            }
        }

        if (str === "Successfully disabled CommandSpy") {
            cspy = false;
        } else if (str === "Successfully enabled CommandSpy") {
            cspy = true;
        }

        if (str.includes(" has muted player ") && str.includes(bot.username) ||
            str.includes("Your voice has been silenced") ||
            str.includes("You have been muted")) {
            muted = true;
        } else if (str.startsWith("You have been muted") && str.endsWith("now")) {
            muted = false;
        }
    });

    bot._client.on("game_state_change", (packet) => {
        if (packet.reason !== 3) return;
        creative = packet.gameMode === 1;
    });

    bot._client.on("entity_status", (data) => {
        if (data.entityStatus === 24) {
            op = false;
        } else if (data.entityStatus === 28) {
            op = true;
        }
    });

    const int = setInterval(() => {
        if (op !== lastOp) {
            bot.chat("/op @s[type=player]");
            lastOp = op;
        }
        if (vanish !== lastVanish) {
            bot.chat("/essentials:evanish enable");
            lastVanish = vanish;
        }
        if (cspy !== lastCspy) {
            bot.chat("/cspy on");
            lastCspy = cspy;
        }
        if (creative !== lastCreative) {
            bot.chat("/essentials:gmc");
            lastCreative = creative;
        }
        if (muted !== lastMuted) {
            bot.chat(`/mute ${bot._client.uuid} 0s`);
            lastMuted = muted;
        }
    }, 500);

    bot.on("stop", () => {
        clearInterval(int);
    });
}

module.exports = { injectTo };
