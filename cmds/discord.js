const conf = require("../conf.json");
const discord = require("../DiscordIndex.js");
const name = "discord";
const blurb = "Shows you the invite link of the discord server :3 + Verifies your discord id";
const aliases = ["dsc"];
const usages = ["", "verify <id>"];
const trusted = false;

async function mc(h) {
    if (h.args[0] === "verify" && h.args[1]) {
        let user;
        let guild;
        let memb;
        try {
            user = await discord._client.users.fetch(h.args[1]);
            h.bot.sendMsg("&c[Discord]&7 User fetched! Continuing process...");
        } catch (e) {
            h.bot.sendErr("[Discord] User was not fetched. Error Msg: " + e.message);
            return;
        }
        try {
            guild = await discord._client.guilds.fetch(conf.guildId);
            h.bot.sendMsg("&c[Discord]&7 Guild fetched! Continuing process...");
        } catch (e) {
            h.bot.sendErr("[Discord] Guild was not fetched. Error Msg: " + e.message);
            return;
        }
        try {
            memb = await guild.members.fetch(h.args[1]);
            h.bot.sendMsg("&c[Discord]&7 Member is on server! Continuing process...");
        } catch (e) {
            h.bot.sendErr("[Discord] Member was not fetched. Error Msg: " + e.message);
            return;
        }
        try {
            await user.send(`**[VERIFICATION]** A player called *${h.uname}* requested to link this account.\n\nWas that you? Please reply with **yes** if you agree and *no* if not.`);
            const dmChannel = await user.createDM();
            await user.reply(`**[VERIFICATION]** Tysm for verifying yourself! Have a good day!\n\nYour account has been linked.`);
            h.bot.sendMsg(`&c[Discord]&a Successful, your account has been linked.`);
            h.bot.discordAuth.add(h.uname);
        } catch (e) {
            throw e;
        }
    } else {
        const component = [
            {
                text: "[Discord] ",
                color: "red"
            },
            {
                text: "Join the official Discord server at ",
                color: "gray"
            },
            {
                text: `${conf.discord.invite}`,
                color: "green",
                hoverEvent: {
                    action: "show_text",
                    contents: {
                        text: "Click to go to the invite"
                    }
                },
                clickEvent: {
                    action: "open_url",
                    value: `${conf.discord.invite}`
                }
            },
            {
                text: "!",
                color: "gray"
            }
        ];
        h.bot.cmdCore.run(`tellraw @a ${JSON.stringify(component)}`);
    }
}

module.exports = { mc, name, blurb, aliases, usages, trusted };
