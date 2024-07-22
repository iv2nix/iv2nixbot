const name = "nextgametime";
const blurb = "Check when is the next game/event";
const aliases = ["nextgame", "nexteventtime", "nextevent"];
const usages = [""];
const trusted = false;

function mc(h) {
    h.bot.sendMsg(`&a${h.bot.getNextGameTime()}`);
}

module.exports = {mc, name, blurb, aliases, usages, trusted};
