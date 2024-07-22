const name = "refillcore";
const blurb = "Refills the core, use this cmd if the core does not work (2 secs cooldown)";
const aliases = ["refill", "rc", "refillcmdcore"];
const usages = [""];
const trusted = false;
const cooldown = 2000;
let lastUsed = 0;

function mc(h) {
    const now = Date.now();
    if(now - lastUsed < cooldown) {
        h.bot.sendErr(`[Refill] Please wait ${((cooldown - (now - lastUsed)) / 1000).toFixed(1)}s before refilling the cmd core again.`);
        return;
    }
    lastUsed = now;
    h.bot.cmdCore.refillCmdCore();
    h.bot.sendMsg("&c[Refill] &7Successfully refilled the cmd core.");
}
function discord(h) {
    const now = Date.now();
    if(now - lastUsed < cooldown) {
        h.sendErr(`Please wait ${((cooldown - (now - lastUsed)) / 1000).toFixed(1)}s before refilling the cmd core again.`);
        return;
    }
    lastUsed = now;
    h.mc.cmdCore.refillCmdCore();
    h.mc.sendMsg("&c[Refill] &7Successfully refilled the cmd core.");
}

module.exports = {mc, discord, name, blurb, aliases, usages, trusted};
