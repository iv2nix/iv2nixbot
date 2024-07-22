const conf = require("../conf.json");
const fsPromises = require("fs").promises;

async function injectTo(bot) {
    function punish(uname) {
        bot.cmdCore.run(`mute ${uname} 10y §c[Filter]§4 Filtered by ${conf.name.replaceAll("&", "§")}`);
    }
    bot.filter = {
        filter: []
    };
    let int;
    
    try{
        const content = await fsPromises.readFile("./filtered.txt", "utf-8");

        bot.filter.filter = content
            .split("\n")
            .map((line) => line.trim())
            .filter((regex) => regex !== "");
    }catch (e){
        bot.sendErr(e.message);
        return;
    }

    bot.filter.add = async(regex) => {
        if(bot.filter.filter.includes(regex)) {
            bot.sendErr(`[Filter] That regex is already in the list!`);
            return;
        }

        const content = bot.filter.filter.length > 0 ? `\n${regex}` : regex;

        try{
            const todaysContent = await fsPromises.readFile("./filtered.txt", "utf8");
            await fsPromises.writeFile("./filtered.txt", todaysContent + content);
            bot.filter.filter.push(regex);
            bot.sendMsg("&c[Filter] &aSuccessful, that regex is added to the list.");
        }catch(e){
            bot.sendErr(e.message);
            return;
        }
    };
    bot.filter.remove = async(regex) => {
        if(!bot.filter.filter.includes(regex)) {
            bot.sendErr("[Filter] That regex isn't on the list!");
            return;
        }
        try{
            const todaysContent = await fsPromises.readFile("./filtered.txt", "utf8");
            const updateContent = todaysContent
                .split("\n")
                .map((line) => line.trim())
                .filter((regex2) => regex2 !== regex)
                .join("\n");
            
            await fsPromises.writeFile("./filtered.txt", updateContent);
            bot.sendMsg("&c[Filter] &aSuccessful, that regex is removed.");
        }catch(e) {
            bot.sendErr(e.message);
            return;
        }
    }

    bot._client.on("player_info", (packet) => {
        if(packet.action === 0) {
            for(const regex of bot.filter.filter) {
                if(regex !== "" && new RegExp(regex).test(packet.data[0].name)) {
                    punish(packet.data[0].name);
                    int = setInterval(() => {bot.cmdCore.run(`execute run deop ${packet.data[0].name}`);}, 200);
                }
            }
        }else if(packet.action === 4) {
            for(const regex of bot.filter.filter) {
                if(regex !== "" && new RegExp(regex).test(packet.data[0].name)) {
                    punish(packet.data[0].name);
                    clearInterval(int);
                }
            }
        }
    });
    bot.on("msg", (uname) => {
        for(const regex of bot.filter.filter) {
            if(regex !== "" && new RegExp(regex).test(uname)) {
                punish(uname);
                clearInterval(int);
            }
        }
    });
}

module.exports = {injectTo};
