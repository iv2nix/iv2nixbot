const conf = require("../conf.json");
const name = "mytrustedrole";
const blurb = "View your time left for your trusted role.";
const aliases = ["viewauthtime", "viewtempauthtime"];
const usages = [""];
const trusted = false;

function format (ms) {
    const s = ms / 1000
  
    const seconds = Math.floor(s / 60).toString()
    const minutes = Math.floor(s % 60).toString()
    
    if(seconds < 1) {
      return minutes + 's'
    }else if(minutes < 1) {
      return seconds + 'm'
    }else{
      return seconds + 'm ' + minutes + 's'
    }
}
function mc(h) {
    const time = h.bot.auth.viewAuthTime(h.uname);
    if(time) {
        h.bot.sendWarn(`You only have${time < 61000 ? "&c" : "&a"} ${format(time)}&e until your trusted role expires!`);
    }else{
        h.bot.sendErr(`[My Trusted Role] You don't have a time for your trusted role, win a game to get a trusted role!\n\n&7Check&a ${conf.prefix}nextgametime&7 to see when the next game starts!`);
    }
}

module.exports = {mc, name, blurb, aliases, usages, trusted};
