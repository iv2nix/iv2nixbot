const {validateRegex} = require("../utils/regexValidator.js");
const name = "ipblock";
const blurb = "Prevents the player with a specific ip address from joining this srvr";
const aliases = ["blockip"];
const usages = ["<hash> add <ip>", "<hash> remove <ip>", "<hash> list"];
const trusted = true;

function mc(h) {
    const args1 = h.bot.auth.authedUsers.includes(h.uname) ? h.args[0] : h.args[1];
    const args2 = h.bot.auth.authedUsers.includes(h.uname) ? h.args[1] : h.args[2];

    function isValidIP(ip) {
        const ipv4Pattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    
        if (ipv4Pattern.test(ip)) {
            return true;
        } else {
            return false;
        }
    }
    if(args1 === "add") {
        if(!args2 || !isValidIP(args2)) {
            h.bot.sendErr("[IP Block] Please enter a valid IP!");
            return;
        }
        h.bot.ipblock.add(args2);
    }else if(args1 === "remove") {
        if(!args2 || !validateRegex(args2)) {
            h.bot.sendErr("[IP Block] Please enter a valid IP!");
            return;
        }
        h.bot.ipblock.remove(args2);
    }else if(args1 === "list") {
        h.bot.sendMsg(`&c[IP Block] &7List of blocked IP addresses:\n\n&a${h.bot.filter.list.map((regex) => regex).join("\n")}`);
    }
}
function discord(h) {
        const args1 = h.args[0];
        const args2 = h.args[1];
        if(args1 === "add") {
            if(!args2 || !isValidIP(args2)) {
                h.sendErr("[IP Block] Please enter a valid IP!");
                return;
            }
            h.mc.ipblock.add(args2);
        }else if(args1 === "remove") {
            if(!args2 || !validateRegex(args2)) {
                h.sendErr("[IP Block] Please enter a valid IP!");
                return;
            }
            h.mc.ipblock.remove(args2);
        }else if(args1 === "list") {
            h.mc.sendMsg(`&c[IP Block] &7List of blocked IP addresses:\n\n&a${h.bot.filter.list.map((regex) => regex).join("\n")}`);
        }
}

module.exports = {mc, discord, name, blurb, aliases, usages, trusted}
