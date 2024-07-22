const fsPromises = require("fs").promises;
const axios = require("axios");
const path = require("node:path");
const conf = require("../conf.json");
const name = "music";
const blurb = "Plays music/song in MIDI format.";
const aliases = ["song"];
const usages = ["play <song>", "playurl <song url>", "stop", "skip", "list"];
const trusted = false;

async function mc(h) {
    const subCmd = h.args.shift();
    switch(subCmd) {
        case "play":
            if(h.bot.event.playing) {
                h.bot.sendErr("[Music] You can't play music during an event! Please try again later.");
                return;
            }
            let fpath = h.args.join(" ").replace(/\xa7.?/g, "");
            fpath = path.join(__dirname, "../music", fpath);

            if(!fpath.includes("music")) {
                h.bot.sendErr("[Music] You can't go outside the music folder.");
                return;
            }

            try{
                const stats = await fsPromises.lstat(fpath);
                if(stats.isDirectory()) {
                    const files = await fsPromises.readdir(fpath);
                    fpath = path.join(fpath, files[Math.floor(Math.random() * files.length)]);
                }
                if(!h.bot.music.playing) {
                    h.bot.music.play(fpath);
                }else{
                    h.bot.music.queue.push(fpath);
                    h.bot.sendMsg(`&a${h.args.join(" ").replace(/\xa7.?/g, "")}&7 has been added to the&9 queue&7.`);
                }
            }catch (e){
                h.bot.sendErr("[Music] Music file does not exist.");
            }
            break;
            case "playurl":
                if(h.bot.event.playing) {
                    h.bot.sendErr("[Music] You can't play music during an event! Please try again later.");
                    return;
                }
                const url = h.args.join(" ").trim();
                if(!url) {
                    h.bot.sendErr("[Music] Please provide a URL.");
                    return;
                }
                if(!url.endsWith('.mid')) {
                    h.bot.sendErr("[Music] The URL must point to a MIDI file.");
                    return;
                }    
                try {
                    const response = await axios.get(url, { responseType: 'arraybuffer' });
                    const ext = path.extname(url);
                    const fileName = `temp${ext}`;
                    const tempPath = path.join(__dirname, "../music", fileName);
    
                    await fsPromises.writeFile(tempPath, response.data);
                    if(!h.bot.music.playing) {
                        h.bot.music.play(tempPath);
                    } else {
                        h.bot.music.queue.push(tempPath);
                        h.bot.sendMsg(`&c[Music] &a${fileName}&7 has been added to the&9 queue&7.`);
                    }
                } catch (error) {
                    h.bot.sendErr("[Music] Failed to download the music from the provided URL.");
                    console.log(error);
                }
                break;
        case "list":
            if(h.bot.event.playing) {
                h.bot.sendErr("[Music] The music list is not available right now. Try again later.");
                return;
            }
            const clean = h.args.join(" ").replace(/\xa7.?/g, "");
            const fpath2 = path.join(__dirname, "../music", clean);

            if(!fpath2.includes("music")) {
                h.bot.sendErr("[Music] You can't go outside the music folder.");
                return;
            }

            const files = await fsPromises.readdir(fpath2);
            const component = [{text: `(${files.length})`, color: "aqua"}, " ", {text: "▶", color: "dark_gray"}, " "];
            
            for(const file of files) {
                const isFile = (await fsPromises.lstat(path.join(fpath2, file))).isFile();
                component.push({
                    text: file,
                    color: "green",
                    hoverEvent: {
                        action: "show_text",
                        contents: {
                            text: "Click to play song",
                            color: "green"
                        }
                    },
                    clickEvent: {
                        action: "run_command",
                        value: `${conf.prefix}${name} ${isFile ? "play" : "list"} ${path.join(clean, file)}`
                    }
                });
                component.push({
                    text: " | ",
                    color: "dark_gray"
                });
            }
            component.pop();
            h.bot.cmdCore.run(`tellraw @a ${JSON.stringify(component)}`);
            break;
        case "skip":
            if(h.bot.event.playing) {
                h.bot.sendErr("[Music] Music cmd is not available right now. Try again later.");
                return;
            }
            h.bot.music.skip();
            break;
        case "stop":
            if(h.bot.event.playing) {
                h.bot.sendErr("[Music] Music cmd is not available right now. Try again later.");
                return;
            }
            h.bot.music.stop();
            break;
        case "loop":
            if(h.bot.event.playing) {
                h.bot.sendErr("[Music] Music cmd is not available right now. Try again later.");
                return;
            }
            if(!h.bot.music.playing) {
                h.bot.sendErr("[Music] No music is playing!");
                return;
            }
            h.bot.music.looping = !h.bot.music.looping;
            if(h.bot.music.looping) {
                h.bot.sendMsg("&c[Music] &7Looping is now&a enabled&7.");
            }else{
                h.bot.sendMsg("&c[Music] &7Looping is now&c disabled&7.");
            }
            break;
        default:
            h.bot.sendErr("[Music] Invalid args, check its usage in the help cmd.");
    }
}
async function discord(h) {
    const subCmd = h.args.shift();
    switch(subCmd) {
        case "play":
            let fpath = h.args.join(" ").replace(/\xa7.?/g, "");
            fpath = path.join(__dirname, "../music", fpath);

            if(!fpath.includes("music")) {
                h.mc.sendErr("[Music] You can't go outside the music folder.");
                return;
            }

            try{
                const stats = await fsPromises.lstat(fpath);
                if(stats.isDirectory()) {
                    const files = await fsPromises.readdir(fpath);
                    fpath = path.join(fpath, files[Math.floor(Math.random() * files.length)]);
                }
                if(!h.mc.music.playing) {
                    h.mc.music.play(fpath);
                }else{
                    h.mc.music.queue.push(fpath);
                    h.mc.sendMsg(`&a${h.args.join(" ").replace(/\xa7.?/g, "")}&7 has been added to the&9 queue&7.`);
                }
            }catch (e){
                h.mc.sendErr("[Music] Music file does not exist.");
            }
            break;
            case "playurl":
                const url = h.args.join(" ").trim();
                if(!url) {
                    h.mc.sendErr("[Music] Please provide a URL.");
                    return;
                }
                if(!url.endsWith('.mid')) {
                    h.mc.sendErr("[Music] The URL must point to a MIDI file.");
                    return;
                }    
                try {
                    const response = await axios.get(url, { responseType: 'arraybuffer' });
                    const ext = path.extname(url);
                    const fileName = `temp${ext}`;
                    const tempPath = path.join(__dirname, "../music", fileName);
    
                    await fsPromises.writeFile(tempPath, response.data);
                    if(!h.mc.music.playing) {
                        h.mc.music.play(tempPath);
                    } else {
                        h.mc.music.queue.push(tempPath);
                        h.mc.sendMsg(`&c[Music] &a${fileName}&7 has been added to the&9 queue&7.`);
                    }
                } catch (error) {
                    h.mc.sendErr("[Music] Failed to download the music from the provided URL.");
                    return;
                }
                break;
        case "list":
            const clean = h.args.join(" ").replace(/\xa7.?/g, "");
            const fpath2 = path.join(__dirname, "../music", clean);

            if(!fpath2.includes("music")) {
                h.mc.sendErr("[Music] You can't go outside the music folder.");
                return;
            }

            const files = await fsPromises.readdir(fpath2);
            const component = [{text: `(${files.length})`, color: "aqua"}, " ", {text: "▶", color: "dark_gray"}, " "];
            
            for(const file of files) {
                const isFile = (await fsPromises.lstat(path.join(fpath2, file))).isFile();
                component.push({
                    text: file,
                    color: "green",
                    hoverEvent: {
                        action: "show_text",
                        contents: {
                            text: "Click to play song",
                            color: "green"
                        }
                    },
                    clickEvent: {
                        action: "run_command",
                        value: `${conf.prefix}${name} ${isFile ? "play" : "list"} ${path.join(clean, file)}`
                    }
                });
                component.push({
                    text: " | ",
                    color: "dark_gray"
                });
            }
            component.pop();
            h.mc.cmdCore.run(`tellraw @a ${JSON.stringify(component)}`);
            break;
        case "skip":
            h.mc.music.skip();
            break;
        case "stop":
            h.mc.music.stop();
            break;
        case "loop":
            if(!h.mc.music.playing) {
                h.mc.sendErr("[Music] No music is playing!");
                return;
            }
            h.mc.music.looping = !h.mc.music.looping;
            if(h.mc.music.looping) {
                h.mc.sendMsg("&c[Music] &7Looping is now&a enabled&7.");
            }else{
                h.mc.sendMsg("&c[Music] &7Looping is now&c disabled&7.");
            }
            break;
        default:
            h.mc.sendErr("[Music] Invalid args, check its usage in the help cmd.");
    }
}

module.exports = {mc, discord, name, blurb, aliases, usages, trusted};
