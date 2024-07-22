const {validateRegex} = require("../utils/regexValidator.js");
const name = "filter";
const blurb = "Filters the user's name";
const aliases = ["plrfilter", "playerfilter", "userfilter", "namefilter"];
const usages = ["<hash> add <regex>", "<hash> remove <regex>", "<hash> list"];
const trusted = true;

function mc(h) {
    const args1 = h.bot.auth.authedUsers.includes(h.uname) ? h.args[0] : h.args[1];
    const args2 = h.bot.auth.authedUsers.includes(h.uname) ? h.args[1] : h.args[2];

    if(args1 === "add") {
        if(!args2 || !validateRegex(args2)) {
            h.bot.sendErr("[Filter] Please enter a valid regex!");
            return;
        }
        if(args2 === ".*") {
            h.bot.sendErr("[Filter] Abuse detected. Process cancelled.");
            return;
        }
        h.bot.filter.add(args2);
    }else if(args1 === "remove") {
        if(!args2 || !validateRegex(args2)) {
            h.bot.sendErr("[Filter] Please enter a valid regex!");
            return;
        }
        h.bot.filter.remove(args2);
    }else if(args1 === "list") {
        h.bot.sendMsg(`&c[Filter] &7List of filtered regexes:\n\n&a${h.bot.filter.filter.map((regex) => regex).join("\n")}`);
    }
}
function discord(h) {
    const args1 = h.args[0];
    const args2 = h.args[1];

    if(args1 === "add") {
        if(!args2 || !validateRegex(args2)) {
            h.bot.sendErr("[Filter] Please enter a valid regex!");
            return;
        }
        if(args2 === ".*") {
            h.bot.sendErr("[Filter] Abuse detected. Process cancelled.");
            return;
        }
        h.bot.filter.add(args2);
    }else if(args1 === "remove") {
        if(!args2 || !validateRegex(args2)) {
            h.bot.sendErr("[Filter] Please enter a valid regex!");
            return;
        }
        h.bot.filter.remove(args2);
    }else if(args1 === "list") {
        h.bot.sendMsg(`&c[Filter] &7List of filtered regexes:\n\n&a${h.bot.filter.filter.map((regex) => regex).join("\n")}`);
    }
}

module.exports = {mc, discord, name, blurb, aliases, usages, trusted}
