function injectTo(bot) {
    bot.discordAuth = {};
    bot.discordAuth.discordAuthed = {};

    bot.discordAuth.add = (uname, id) => {
        bot.discordAuth.discordAuthed[uname] = id;
    };
    bot.discordAuth.getId = (uname) => {
        return bot.discordAuth.discordAuthed[uname];
    };
    bot.discordAuth.getDiscordNameById = (id) => {
        for(const [uname, uid] of Object.entries(bot.discordAuth.discordAuthed)) {
            if(uid === id) {
                return uname;
            }
        }
        return null;
    };
}

module.exports = {injectTo};
