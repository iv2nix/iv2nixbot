const conf = require("../conf.json");
const discord = require('../DiscordIndex.js');
const parseMsg = require("../utils/discord/parse_msg.js");

function injectTo(bot) {
    const {host, port} = bot.opts;
    const srvr = `${host}:${port}`;
    const channelId = conf.discord.srvrs[srvr];
    if(!channelId) return;

    let text = "";

    function handleParsedChat(data) {
        const msg = data.toString();

        if(msg.startsWith("Command set: ")) return;

        text += msg;
        text += "\n";
    }
    bot.on("parsed_chat", handleParsedChat);

    setInterval(() => {
        const channel = discord._client.channels.cache.get(channelId);
        if(!channel) return;

        if(text.length === 0) return;
        if(text.length > conf.discord.spamsize) text = "[SPAM] Spam has been detected :( Logging has been temporarily disabled.";

        const msg = parseMsg(text.slice(0, 1000));
        channel.send(msg);

        text = text.slice(1000);
    }, 1000);

    function handleDiscordMsg(msg) {
        if(msg.channelId !== channelId) return;
        if(msg.author.id === discord._client.user.id) return;
        if(msg.content.startsWith(conf.discord.prefix)) return;

        const data = [
            bot.ChatMessage.MessageBuilder.fromString(`&8«${conf.name}&8» `),
            {
                text: "[Discord] ",
                color: "red"
            },
            {
                text: bot.discordAuth.getDiscordNameById(msg.author.id) ? bot.discordAuth.getDiscordNameById(msg.author.id) : msg.author.username,
                color: bot.discordAuth.getDiscordNameById(msg.author.id) ? "red" : "green",
                hoverEvent: {
                    action: "show_text",
                    contents: [
                        {
                            text: "Click to copy username to clipboard.",
                            color: "blue"
                        }
                    ]
                },
                clickEvent: {
                    action: "copy_to_clipboard",
                    value: msg.author.username
                }
            },
            {
                text: " › ",
                color: "dark_gray"
            },
            {
                text: msg.content,
                color: "gray"
            }
        ];

        try{
            bot.cmdCore.run(`tellraw @a ${JSON.stringify(data)}`);
        }catch(e){
            return;
        }
    }
    discord._client.on("messageCreate", handleDiscordMsg);

    function handleEnd(reason, sender) {
        const channel = discord._client.channels.cache.get(channelId)
    
        if (!channel) return
    
        if(typeof reason === "object") {
            channel.send(`**[DISCONNECTED]**: Showing the info below.\n\n\`\`\`\n${JSON.stringify(reason)}\n\`\`\`\n\n**[*${sender ? sender : "packet not recognized, either null or undefined"}*]**`);
            return;
        }
        channel.send(`**[DISCONNECTED]**: ${reason ? reason : "no reason, either null or undefined"} **[*${sender ? sender : "packet not recognized, either null or undefined"}*]**`);
      }
      bot.on("stop", handleEnd);

    function handleErr(err) {
      const channel = discord._client.channels.cache.get(channelId)

      if (!channel) return
  
      channel.send(`**[ERR]** ${err.message}`)
    }
  
    bot.on('error', handleErr)
}

module.exports = {injectTo};
