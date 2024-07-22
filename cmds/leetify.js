const name = "leetify";
const blurb = "Leetifies your msg";
const aliases = ["leet", "leetspeak", "1337", "1337ify", "13371fy"];
const usages = ["<text>"];
const trusted = false;
const {EmbedBuilder} = require("discord.js");

function leetify(text) {
    const leetDic = {
        'a': '4',
        'b': '8',
        'c': '<',
        'e': '3',
        'g': '9',
        'h': '#',
        'i': '1',
        'l': '1',
        'o': '0',
        's': '5',
        't': '7',
        'z': '2',
        'd': '|)',
        'f': '|=',
        'k': '|<',
        'm': '|\\/|',
        'n': '|\\|',
        'p': '|D',
        'q': '0,',
        'r': '2',
        'u': '|_|',
        'v': '\\/',
        'w': '\\/\\/',
        'x': '%',
        'y': '`/',
        'j': '_|',
        'a': '4',
        'b': '8',
        'e': '3'
    };
    return text.split("").map((char) => {
        const lowerChar = char.toLowerCase();
        return leetDic[lowerChar] || char;
    }).join("");
}
function mc(h) {
    if(!h.args[0]) {
        h.bot.sendErr("I can't 13371fy an empty msg!");
        return;
    }
    h.bot.sendMsg(`&c[13371fy] &2${leetify(h.args.join(" "))}`);
}
function discord(h) {
    if(!h.args) {
        h.sendErr("I can't 13371fy an empty msg!");
        return;
    }
    const embed = new EmbedBuilder()
        .setDescription(leetify(h.args.join(" ")))
        .setColor("#00f504")
        .setTimestamp();
    h.sendEmbeds(embed);
}

module.exports = {mc, discord, name, blurb, aliases, usages, trusted};
