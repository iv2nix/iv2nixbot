const conf = require("../conf.json");
const words = [
    "sword",
    "planks",
    "potion",
    "redstone",
    "book",
    "apple",
    "ingot",
    "fishing rod",
    "pumpkin",
    "pickaxe",
    "obsidian",
    "ladder",
    "bread",
    "rod",
    "tnt",
    "shield",
    "lapis lazuli",
    "cauldron",
    "command block",
    "totem of undying",
    "mlg",
    "wolf",
    "noob",
    "bot",
    "javascript",
    "java",
    "typescript",
    "coffeescript"
];
const wordsWithHints = {
    "sword": "used to slain a player",
    "planks": "used to build a house, if lit on fire, it will burn. used to craft with wood",
    "potion": "you need to either drink it or splash it around, gives you effects",
    "redstone": "used to activate a contraption",
    "book": "does nothing unless with a quill.",
    "apple": "you can eat it, comes with a golden counterpart. also have an enchanted golden counterpart.",
    "ingot": "used for netherite or gold",
    "fishing rod": "comes with a carrot on a stick counterpart, used to go fishing.",
    "pumpkin": "a jack-o-lantern but without light.",
    "pickaxe": "used to mine ores.",
    "obsidian": "used to make portals to the NETHER, takes too long to break",
    "ladder": "u can climb on it.",
    "bread": "it's a food, irl u can put peanut butter spread all over it.",
    "rod": "comes with blaze, fishing, lightning or end counterparts.",
    "tnt": "blows up when u light it with flint&steel.",
    "shield": "u can equip it in your left arm, can be used to prevent from being slained by other players or be killed by mobs.",
    "lapis lazuli": "a blue thingy that comes out of a blue ore.",
    "cauldron": "a black or greyish block where you can put water on it.",
    "command block": "used by bots to make a CORE, executes cmds inside it",
    "totem of undying": "u need to use it if u want to jump from a cliff.",
    "mlg": "same as totem of undying but water ver.",
    "wolf": "if u hit it, it will become angry, if its ur pet then it waits for u until u join.",
    "noob": "the player that doesn't know how to play.",
    "bot": "who am i then?",
    "javascript": "basically all bots are made off, its easy to use! only devs can answer this :O",
    "java": "basically the most advanced bots are made off like hbot and sbot! only devs can answer this :O",
    "typescript": "some bots use this, idk? but yeah. can apply types to vars! only devs can answer this :O",
    "coffeescript": "i love to drink coffee and script so i love this language! only coffee lovers can answer this :O",
    "error": "every dev's nightmare... only devs can answer this :O"
};

function scrambleWord(word) {
    let scrambledWord;
    do {
        scrambledWord = word.split('');
        for (let i = scrambledWord.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [scrambledWord[i], scrambledWord[j]] = [scrambledWord[j], scrambledWord[i]];
        }
    } while (scrambledWord.join('') === word);
    return scrambledWord.join('');
}

function format(ms) {
    const s = ms / 1000;
    const seconds = Math.floor(s % 60).toString();
    const minutes = Math.floor(s / 60).toString();
    
    if (minutes < 1) {
        return seconds + 's';
    } else {
        return minutes + 'm ' + seconds + 's';
    }
}

function levenshtein(a, b) {
    const matrix = [];

    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b[i - 1] === a[j - 1]) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
                );
            }
        }
    }

    return matrix[b.length][a.length];
}

function injectTo(bot) {
    bot.event = {};
    bot.event.playing = false;
    let selectedWord;
    let msgListener;
    const totalTime = 40000;
    let timeLeft = totalTime;
    let int;
    let nextGameTime = 0;
    let round = 1;
    const maxRounds = 5;

    function updateBossbar(timeLeft, totalTime) {
        bot.cmdCore.run(`bossbar add minecraft:unscramble_da_word_timer ""`);
        bot.cmdCore.run(`bossbar set minecraft:unscramble_da_word_timer max ${totalTime}`);
        bot.cmdCore.run(`bossbar set minecraft:unscramble_da_word_timer value ${timeLeft}`);
        bot.cmdCore.run(`bossbar set minecraft:unscramble_da_word_timer color ${timeLeft < 11000 ? "red" : "green"}`);
        bot.cmdCore.run(`bossbar set minecraft:unscramble_da_word_timer name ${JSON.stringify(bot.ChatMessage.MessageBuilder.fromString(`&8«${conf.name}&8»&c [Unscramble Da Word Event] [ROUND ${round}&7/${maxRounds}&c]&7 Time&8:${timeLeft < 11000 ? "&c" : "&a"} ${format(timeLeft)}`))}`);
        bot.cmdCore.run(`bossbar set minecraft:unscramble_da_word_timer players @a`);
    }

    function startEvent() {
        timeLeft = totalTime;
        if (round > maxRounds) {
            round = 1;
            return;
        }
        bot.event.playing = true;
        selectedWord = words[Math.floor(Math.random() * words.length)];
        if (round === 1) {
            bot.sendMsg(`&c[Unscramble Da Word Event]&7 The&c Unscramble Da Word Event&7 has started!\n\n&7The scrambled word is&6 ${scrambleWord(selectedWord)}&7.\n&7Hint:&9 ${wordsWithHints[selectedWord]}\n\n&7If a player wins, we'll move to&9 ROUND ${round+1}&7.`);
        } else {
            bot.sendMsg(`&c[Unscramble Da Word Event]&7 New round started!&c [ROUND ${round}&7/${maxRounds}&c]\n\n&7The scrambled word is&6 ${scrambleWord(selectedWord)}&7.\n&7Hint:&9 ${wordsWithHints[selectedWord]}\n\n${round === maxRounds ? "&7This is the&9 FINAL&7 round. If a player wins, we'll give them a&9 TRUSTED&7 role for 5 mins." : `&7If a player wins, we'll move to&a ROUND ${round+1}&7.`}`);
        }
        int = setInterval(() => {
            timeLeft -= 1000;
            updateBossbar(timeLeft, totalTime);
            
            if (timeLeft <= 0) {
                bot.sendMsg(`&c[Unscramble Da Word Event]&7 The&c Unscramble Da Word Event&7 has ended&c :(\n\n&7The word was&a ${selectedWord}&7!\n&7Round(s) survived:&9 ${round}`);
                stopEvent();
                bot.cmdCore.run("bossbar remove minecraft:unscramble_da_word_timer");
                clearInterval(int);
            }
        }, 1000);

        msgListener = (uname, msg) => {
            if (uname && uname === "set") return;
            if (msg && levenshtein(msg.toLowerCase(), selectedWord) <= 2) {
                if (bot.auth.authedUsers.includes(uname)) {
                    bot.sendErr(`[Unscramble Da Word Event] You must wait until your timer has ended to get another temp&9 TRUSTED&c role again!\n\n&7Check your trusted role countdown time using&a ${conf.prefix}mytrustedrole&7!`);
                    return;
                }
                stopEvent();
                if (round === maxRounds) {
                    bot.auth.tempAuthUser(uname, 300000);
                    bot.cmdCore.run(`execute as ${uname} at @s run playsound minecraft:ui.toast.challenge_complete master @s`);
                    bot.sendMsg(`&c[Unscramble Da Word Event]&7 Nice job,&a ${uname}&7!\n\n&7You have been given a temp&9 TRUSTED&7 role for 5 mins. You can now get access to trusted cmds without entering a hash.\n\n&7Use&a ${conf.prefix}mytrustedrole&7 to check how much time is left before your trusted role expires!`);
                } else {
                    bot.cmdCore.run(`execute as ${uname} at @s run playsound minecraft:entity.player.levelup master @s`);
                    bot.cmdCore.run(`execute as ${uname} at @s run particle minecraft:totem_of_undying ~ ~2 ~ 0 0 0 0 1`);
                    bot.sendMsg(`&c[Unscramble Da Word Event]&7 Nice job,&a ${uname}&7! Moving to&9 ROUND ${round}&7!`);
                }

                round++;
                startEvent();
            }
        };

        bot.on("msg", msgListener);

        timeout = setTimeout(() => {
            stopEvent();
            bot.cmdCore.run("bossbar remove minecraft:unscramble_da_word_timer");
        }, totalTime);
    }

    function stopEvent() {
        bot.event.playing = false;
        if (msgListener) {
            bot.off("msg", msgListener);
        }
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }
        if (int) {
            clearInterval(int);
            bot.cmdCore.run("bossbar remove minecraft:unscramble_da_word_timer");
        }
        nextGameTime = Date.now() + 300000;
    }

    bot._client.on("login", () => {
        setTimeout(() => {
            startEvent();
        }, 8000);
        setInterval(() => {
            startEvent();
        }, 300000);
    });

    bot.getNextGameTime = () => {
        const now = Date.now();
        const timeUntilNextGame = nextGameTime - now;
        if (timeUntilNextGame <= 0) {
            return "Next game starting now.";
        }
        return `Next game starting ${format(timeUntilNextGame)} from now`;
    };
}

module.exports = { injectTo };
