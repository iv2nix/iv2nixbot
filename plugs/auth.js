function injectTo(bot) {
    bot.auth = {};
    bot.auth.authedUsers = [];
    bot.auth.tempAuthUsers = {}; // object to track authed users with temp membership

    bot.auth.authUser = (uname) => {
        bot.auth.authedUsers.push(uname);
    };

    bot.auth.tempAuthUser = (uname, seconds) => {
        const startTime = Date.now();
        const endTime = startTime + seconds;

        bot.auth.tempAuthUsers[uname] = { startTime, endTime };

        bot.auth.authedUsers.push(uname);

        setTimeout(() => {
            bot.auth.authedUsers = bot.auth.authedUsers.filter((user) => user !== uname);
            delete bot.auth.tempAuthUsers[uname];
            bot.sendMsg(`&a${uname}&7, your trusted role has expired. Win another game to get another&9 TRUSTED&7 role!`, uname);
        }, seconds);
    };

    bot.auth.viewAuthTime = (uname) => {
        const userAuth = bot.auth.tempAuthUsers[uname];
        if (userAuth) {
            const remainingTime = userAuth.endTime - Date.now();

            if (remainingTime > 0) {
                return remainingTime;
            } else {
                return 0;
            }
        } else {
            return 0;
        }
    };
}

module.exports = { injectTo };
