class BaseCmdHandler{
    constructor(bot, raw, args) {
        this.bot = bot;
        this.raw = raw;
        this.args = args;
    }
}

module.exports = BaseCmdHandler;
