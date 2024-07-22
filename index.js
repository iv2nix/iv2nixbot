const {handleBots} = require("./bot.js");
const conf = require("./conf.json");
handleBots(conf.srvrs);
