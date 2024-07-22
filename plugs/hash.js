const crypto = require("node:crypto");
require("dotenv").config();

function injectTo(bot) {
    bot.trustedHash = "";
    setInterval(() => {
        bot.trustedHash = crypto.createHash("md5").update(process.env.TRUSTED_KEY + Math.floor(Date.now() / 2000)).digest("hex").substring(0, 7);
    }, 100);
}

module.exports = {injectTo};
