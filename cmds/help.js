const conf = require("../conf.json");
const {EmbedBuilder} = require("discord.js");
const name = "help";
const blurb = "Shows u a list of cmds";
const aliases = ["", "cmds"];
const usages = ["", "[cmd]"];
const trusted = false;

function checkIfTrusted(cmdVal) {
    if(cmdVal.trusted === true) {
        return "ye";
    }else{
        return "non";
    }
}
function mc(h) {
    const args = h.args[0];
    if(!args) {
        const component = [{text: `(${h.bot.cmds.length})`, color: "aqua"}, " ", {text: "▶", color: "dark_gray"}, " "];

        for(const cmd of h.bot.cmds) {
            component.push({
                text: conf.prefix+cmd.name,
                color: cmd.trusted === true ? "red" : "green",
                hoverEvent: {
                    action: "show_text",
                    contents: {
                        text: "Click to show details on this cmd.",
                        color: cmd.trusted ? "red" : "green"
                    }
                },
                clickEvent: {
                    action: "run_command",
                    value: `${conf.prefix}${name} ${cmd.name}`
                }
            });
            component.push({
                text: " | ",
                color: "dark_gray"
            });
        }

        component.pop();
        h.bot.cmdCore.run(`minecraft:tellraw @a ${JSON.stringify(component)}`);
    }else{
        const cmd = h.bot.cmds.find((cmd) => cmd.name === args);
        if(cmd === undefined) {
            h.bot.sendErr(`[Help] Unknown cmd: ${args}`);
            return;
        }else if(cmd.mc === undefined) {
            h.bot.sendWarn("&c[Help]&e That cmd was never inited.");
            return;
        }
        h.bot.sendMsg(`&7Information for cmd:\n\n&aName&8 -&9 ${cmd.name}\n&9Blurb&8 -&a ${cmd.blurb}\n\n&aTrusted Cmd&8 -${cmd.trusted ? "&c" : "&a"} ${checkIfTrusted(cmd)}\n\n&9Aliases&8 -\n&a${cmd.aliases ? cmd.aliases.join("\n") : "non"}\n\n&9Usages&8 -\n&a${cmd.usages ? cmd.usages.map((usage) => `${conf.prefix}${cmd.name} ${usage}`).join("\n") : "non"}`);
    }
}
function discord(h) {
    if(h.args[0]) {
        const cmd = h.bot.cmds.find((cmd) => cmd.names === h.args[0]);
        if(cmd === undefined) {
            h.bot.sendErr(`Unknown cmd: ${h.args[0]}`);
            return;
        }else if(cmd.discord) {
            h.bot.sendErr(`That cmd was never inited.`);
            return;
        }
        const embed = new EmbedBuilder()
            .setTitle("Information for cmd:")
            .addFields(
                {
                    name: "Name",
                    value: "${cmd.name}",
                    inline: true
                },
                {
                    name: "Blurb",
                    value: "${cmd.blurb}",
                    inline: true
                },
                {
                    name: "Trusted Cmd",
                    value: "${checkIfTrusted(cmd)}",
                    inline: true
                },
                {
                    name: "Aliases:",
                    value: "${cmd.aliases ? cmd.aliases.map((usage) => `${conf.prefix}${cmd.name} ${usages}`).join(\"\\n\") : \"non\"}",
                    inline: true
                },
            )
            .setColor("#00f504")
            .setTimestamp();
        h.sendEmbeds(embed);
    }else{
        const embed = new EmbedBuilder()
            .setTitle("Commands List")
            .setDescription(h.bot.cmds.map((cmd) => `\`${cmd.name}\``).join("|"));
        h.sendEmbeds(embed);
    }
}

module.exports = {mc, discord, name, blurb, trusted, aliases, usages};
