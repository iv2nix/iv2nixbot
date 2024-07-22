const conf = require("../conf.json");
const name = "auth";
const blurb = "Auths ur user, gives u a chance to execute trusted cmds without hashes until the end of the console's session.";
const aliases = ["authenticate", "trustedauth", "trustedauthenticate"];
const usages = ["<hash>"];
const trusted = true;

function mc(h) {
    if(h.bot.auth.authedUsers.includes(h.uname)) {
        h.bot.sendErr("[Auth] You are already authed!");
    }else{
        h.bot.auth.authUser(h.uname);
        h.bot.sendMsg("&c[Auth] &aSuccessful, you can now enter trusted cmds without entering a hash");
    }
}

module.exports = {mc, name, blurb, aliases, usages, trusted}
