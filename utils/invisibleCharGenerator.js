function invis() {
    const invisChars = ["§0", "§1", "§2", "§3", "§4", "§5", "§6", "§7", "§8", "§9", "§a", "§b", "§c", "§d", "§e", "§f"];
    return invisChars[Math.floor(Math.random() * invisChars.length)];
}

module.exports = {invis};
