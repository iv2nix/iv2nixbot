const conf = require("../conf.json");
const BaseCmdHandler = require("./BaseCmdHandler.js");
const {EmbedBuilder} = require("discord.js");

class DiscordCmdHandler extends BaseCmdHandler{
    constructor(bot, raw, args, msg) {
        super(bot, raw, args);
        
        this.msg = msg;
        this.author = msg.author;
        this.channelId = msg.channelId;

        const entries = Object.entries(conf.discord.srvrs).find(([srvr, channelId]) => channelId === this.channelId);
        if(!entries) return;

        const [srvr] = entries;
        this.srvr = srvr;

        const {bots} = require("../index.js");
        this.bots = bots;

        const mc = bots[srvr];
        this.mc = mc;
    }

    sendErr(err) {
        let embed;

        if(err instanceof Error) {
            embed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle(err.message)
                .setDescription(`\`\`\`text\n${err.stack}\`\`\``);
        }else{
            embed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle(err);
        }

        return this.sendEmbeds(embed);
    }

    sendEmbeds(...embeds) {
        return this.sendMsg({ embeds });
    }

    sendMsg(msg) {
        const channel = this.bot._client.channels.cache.get(this.channelId);
        return channel.send(msg);
    }
}

module.exports = DiscordCmdHandler;
