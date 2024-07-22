const conf = require("../conf.json");
let int;
let int2;

function injectTo(bot) {
    bot._client.on("login", () => {
        setTimeout(() => {
            bot.sendMsg(`${conf.name}&7, a&a UTILITY&7, advanced bot made by ${conf.creator}`);
            bot.sendMsg(`&7Prefix is&a ${conf.prefix}&7, type&9 ${conf.prefix}help&7 for help.`);
            bot.sendMsg(`&7Join the official ${conf.name}&7 discord at&a ${conf.discord.invite}.`);
            int = setInterval(() => {
                bot.sendMsg(`&7Prefix is&a ${conf.prefix}&7, type&9 ${conf.prefix}help&7 for help.`);
            }, 300000);
            int2 = setInterval(() => {
                bot.sendMsg(`&7Join the official ${conf.name}&7 discord at&a ${conf.discord.invite}.`);
            }, 600000);
        }, 4000);
    });
    bot.on("stop", () => {
        clearInterval(int);
        clearInterval(int2);
    });
}

module.exports = {injectTo};
