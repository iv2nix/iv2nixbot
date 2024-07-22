const name = "preppify";
const blurb = "Preppifies your msg";
const aliases = ["preppytext"];
const usages = ["<text>"];
const trusted = false;
const {EmbedBuilder} = require("discord.js");

function turnToPreppyText(text) {
    const substitutions = {
        'hello': 'heyyy 👋',
        'hi': 'heyyaa 😄',
        'good': 'g00d 👍',
        'friend': 'bff 💖',
        'thanks': 'thx 😊',
        'thank you': 'tysm 😘',
        'love': 'luv 💕',
        'sorry': 'sry 😔',
        'yes': 'yesss 😍',
        'no': 'nope 😅',
        'help': 'hlp plz 🙏',
        'please': 'plss 🙏',
        'welcome': 'welcomeee 🎉',
        'happy': 'happyyy 😊',
        'great': 'gr8 🌟',
        'see': 'c 👀',
        'talk': 'chat 💬',
        'goodbye': 'byeee 👋',
        'see you later': 'c u later 👋',
        'congratulations': 'congrats 🎊',
        'awesome': 'awsome 😎',
        'excited': 'so excited 🤩',
        'amazing': 'amazinggg 🌟',
        'beautiful': 'beauutiful 💖',
        'fun': 'funnn 🎉',
        'happy birthday': 'hbd 🎂🎉',
        'love you': 'luv u 😘',
        'please': 'plz 🙏',
        'yes please': 'yess pls 😍🙏',
        'what': 'wut 🤔',
        'where': 'whr 🤔',
        'why': 'y 🤷',
        'who': 'whooo 🤔',
        'how': 'howww 🤔',
        'really': 'rly 😲',
        'cool': 'kool 😎',
        'cute': 'c8 😍',
        'funny': 'hilarious 😂',
        'ok': 'okieee 👍',
        'okay': 'okkayyy 👍',
        'maybe': 'mayyybe 🤔',
        'definitely': 'def 😍',
        'totally': 'totallyyy 😎',
        'yup': 'yup 😁',
        'nope': 'nope 😅',
        'sorry': 'sry 😔',
        'goodnight': 'gnight 🌙',
        'good morning': 'gmorning ☀️',
        'good afternoon': 'gafternoon 🌞',
        'awesome': 'awsome 😎',
        'fantastic': 'fantastico 😍',
        'amazing': 'aweeesome 😍',
        'super': 'superrrr 😁',
        'really': 'rly 😲',
        'seriously': 'srsly 😲',
        'wow': 'woahhh 😮',
        'yass': 'yassss 😍',
        'cute': 'cuuute 💕',
        'fun': 'funnnn 😎',
        'epic': 'epicccc 🌟',
        'lit': 'littt 🔥',
        'rad': 'rad 😎',
        'sick': 'sickkk 🤘',
        'dope': 'dope 😎',
        'chill': 'chill 😎',
        'lit': 'lit 🔥',
        'vibe': 'vibing ✨',
        'gang': 'squad 😎',
        'fam': 'fam ❤️',
        'bored': 'bored 😴',
        'tired': 'tired 😴',
        'exhausted': 'exhausted 😵',
        'angry': 'angry 😡',
        'mad': 'mad 😠',
        'sad': 'sad 😔',
        'depressed': 'depressed 😢',
        'upset': 'upset 😞',
        'stressed': 'stressed 😣',
        'nervous': 'nervous 😰',
        'excited': 'excited 😁',
        'thrilled': 'thrilled 🤩',
        'overjoyed': 'overjoyed 😍',
        'elated': 'elated 😁'
    };
    const words = text.split(" ");
    const preppyWords = words.map((word) => {
        if(word === null || word === undefined) return "";
        const cleanedWord = word.replace(/[.,!?]/g, "");
        const preppyWord = substitutions[cleanedWord.toLowerCase()] || word;
        return preppyWord;
    });
    return preppyWords.join(" ");
}
function mc(h) {
    if(!h.args[0]) {
        h.bot.sendErr("I can't preppify an empty msg!");
        return;
    }
    h.bot.sendMsg(`&c[Preppify] &d${turnToPreppyText(h.args.join(" "))}`);
}
function discord(h) {
    if(!h.args) {
        h.sendErr("I can't preppify an empty msg!");
        return;
    }
    const embed = new EmbedBuilder()
        .setDescription(turnToPreppyText(h.args.join(" ")))
        .setColor("#00f504")
        .setTimestamp();
    h.sendEmbeds(embed);
}

module.exports = {mc, discord, name, blurb, aliases, usages, trusted};
