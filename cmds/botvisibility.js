const conf = require("../conf.json");
const name = "botvisibility";
const blurb = "Changes if the bot will be visible or not";
const aliases = ["togglevisibility", "visibility"];
const usages = ["<hash> <true/false>", "<hash> <on/off>"];
const trusted = true;
let positive = null;

function mc(h) {
    const args = h.bot.auth.authedUsers.includes(h.uname) ? h.args[0] : h.args[1];
    if(args === "true") {
        h.bot.visibility = false;
        positive = true;
    }else if(args === "false") {
        h.bot.visibility = true;
        positive = false;
    }else if(args === "on") {
        h.bot.visibility = false;
        positive = true;
    }else if(args === "off") {
        h.bot.visibility = true;
        positive = false;
    }else{
        positive = !positive;
        return;
    }
    if(positive === true) {
        h.bot.chat("/essentials:evanish disable");
        h.bot.sendMsg(`&c[Bot Visibility] ${conf.name}&7 is now&a VISIBLE&7.`);
    }else{
        h.bot.chat("/essentials:evanish enable");
        h.bot.sendMsg(`&c[Bot Visibility] ${conf.name}&7 is now&c INVISIBLE&7.`);
    }
}
function discord(h) {
    if(h.args[0] === "true") {
        h.bot.visibility = false;
        positive = true;
    }else if(h.args[0] === "false") {
        h.bot.visibility = true;
        positive = false;
    }else if(h.args[0] === "on") {
        h.bot.visibility = false;
        positive = true;
    }else if(h.args[0] === "off") {
        h.bot.visibility = true;
        positive = false;
    }else{
        positive = !positive;
        return;
    }
    if(positive === true) {
        h.mc.chat("/essentials:evanish disable");
        h.mc.sendMsg(`&c[Bot Visibility] ${conf.name}&7 is now&a VISIBLE&7.`);
    }else{
        h.mc.chat("/essentials:evanish enable");
        h.mc.sendMsg(`&c[Bot Visibility] ${conf.name}&7 is now&c INVISIBLE&7.`);
    }
}

module.exports = {mc, discord, name, blurb, aliases, usages, trusted}
