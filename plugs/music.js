//Credits to _ChipMC_
const fs = require('fs')
const path = require('path')
const { Midi } = require('@tonejs/midi')
const { convertMidi } = require('../utils/midi_converter')
const conf = require("../conf.json");

const { instruments } = require('minecraft-data')('1.15.2') // fard

const soundMap = {
  harp: 'block.note_block.harp',
  basedrum: 'block.note_block.basedrum',
  snare: 'block.note_block.snare',
  hat: 'block.note_block.hat',
  bass: 'block.note_block.bass',
  flute: 'block.note_block.flute',
  bell: 'block.note_block.bell',
  guiter: 'block.note_block.guiter',
  chime: 'block.note_block.chime',
  xylophone: 'block.note_block.xylophone',
  iron_xylophone: 'block.note_block.iron_xylophone',
  cow_bell: 'block.note_block.cow_bell',
  didgeridoo: 'block.note_block.didgeridoo',
  bit: 'block.note_block.bit',
  banjo: 'block.note_block.banjo',
  pling: 'block.note_block.pling'
}
const oldSoundMap = {
  harp: 'block.note_block.harp',
  basedrum: 'block.note_block.basedrum',
  snare: 'block.note_block.snare',
  hat: 'block.note_block.hat',
  bass: 'block.note_block.bass',
  flute: 'block.note_block.harp',
  bell: 'block.note_block.harp', // 'entity.experience_orb.pickup'
  guiter: 'block.note_block.bass',
  chime: 'block.note_block.harp',
  xylophone: 'block.note_block.harp',
  iron_xylophone: 'block.note_block.harp',
  cow_bell: 'block.note_block.cow_bell',
  didgeridoo: 'block.note_block.bass',
  bit: 'block.note_block.harp',
  banjo: 'block.note_block.bass',
  pling: 'block.note_block.pling'
}

function injectTo (bot) {
  bot.music = {
    playing: false,
    queue: [],
    nowPlaying: undefined,
    looping: false,
    _interval: null,
    _playNextSong,
    skip,
    stop,
    play,
    normalize
  }

  bot.music.nowPlaying = {
    name: '',
    tick: {
      current: null,
      total: null
      // npt: null
    }
  }

  setInterval(() => {
    if (!bot.music.playing) return
    const msg = [
        { text: '«', color: 'dark_gray' },
        bot.ChatMessage.MessageBuilder.fromString(conf.name),
        { text: '» ', color: 'dark_gray' },
        { text: '[Music] ', color: 'red' },
      { text: 'Now Playing', color: "green" },
      { text: ': ', color: 'dark_gray' },
      { text: bot.music.nowPlaying.displayName, color: "blue" },
      { text: ' - ', color: 'dark_gray' },
      { text: format(bot.music.nowPlaying.time), color: 'gray' },
      { text: ' / ', color: 'dark_gray' },
      { text: format(bot.music.nowPlaying.length), color: 'gray' }
    ]
    if (bot.music.looping) {
      msg.push({ text: ' | ', color: 'dark_gray' })
      msg.push({ text: 'Looping', color: "blue" })
    }
    bot.cmdCore.run('bossbar add minecraft:ibot_music ""')
    bot.cmdCore.run('bossbar set minecraft:ibot_music max ' + bot.music.nowPlaying.length)
    bot.cmdCore.run('bossbar set minecraft:ibot_music value ' + bot.music.nowPlaying.time)
    bot.cmdCore.run('bossbar set minecraft:ibot_music color blue')
    bot.cmdCore.run('bossbar set minecraft:ibot_music name ' + JSON.stringify(msg))
    bot.cmdCore.run('bossbar set minecraft:ibot_music players @a[tag=!nomusic]')
  }, 500)

  function _playNextSong () {
    const song = bot.music.queue.shift()
    if (song != null) play(song)
  }

  function skip () {
    clearInterval(bot.music._interval)
    bot.music.playing = false
    if (bot.music.queue.length !== 0) {
      _playNextSong()
       bot.sendMsg('&c[Music]&7 Skipped this song throughout the queue')
    }
  }

  function stop () {
    bot.music.queue = []
    clearInterval(bot.music._interval)
    bot.music.playing = false
    bot.sendMsg('&aSuccessful, the queue has been stopped')
  }

  function play (filepath) {
    filepath = path.resolve(filepath)
    let song
    try {
      switch (path.extname(filepath)) {
        case '.mid':
          const midi = new Midi(fs.readFileSync(filepath))
          song = normalize(convertMidi(midi))
          break
        default:
          bot.sendErr("[Music] Can't play that format, please use .mid format.")

      }
      song.displayName = song.name.length > 0 ? `${song.name} (${path.basename(filepath)})` : path.basename(filepath)
      song.time = 0
      bot.music.nowPlaying = song
    } catch (err) {
      bot.sendErr(err.message)
      return
    }

    // play the music lol
    bot.sendMsg("&c[Music] &7Now playing&a " + bot.music.nowPlaying.displayName);
    bot.music.playing = true
    bot.music.looping = song.loop
    let startTime = Date.now()
    bot.music._interval = setInterval(() => {
      const intervalTime = song.time + 1
      song.time = Date.now() - startTime

      song.notes.forEach((note, i) => {
        const _time = note.time // Math.floor(note.time)
        if (intervalTime <= _time && song.time >= _time) {
          const sound = soundMap[note.instrument]
          // const oldSound = oldSoundMap[note.instrument]
          const floatingpitch = Math.pow(2, (note.pitch - 12) / 12.0)
          bot.cmdCore.run(`minecraft:execute as @a[tag=!nomusic] at @s run playsound ${sound} record @s ^ ^ ^ ${note.volume} ${floatingpitch}`)
        }
      })

      if (song.time > song.length) {
        if (bot.music.looping) {
          startTime = Date.now() + song.loopPosition
          return
        }

        clearInterval(bot.music._interval)
        bot.music.playing = false

        bot.cmdCore.run('bossbar remove minecraft:ibot_music')
        bot.sendMsg('&c[Music] &7Finished playing&a ' + bot.music.nowPlaying.displayName)
        if (bot.music.queue.length !== 0) {
          bot.sendMsg('&c[Music]&7 There is still music on the queue.&f Playing next song in the queue.')
          _playNextSong()
        }
      }
    }, 1)
  }
}

function normalize (song) {
  const normalizeNote = note => { // change notes with tick to notes with time
    if (note.time == null && note.tick != null) {
      note.time = note.tick * 50
      delete note.tick
    }

    const num = Number(note.instrument)
    if (!Number.isNaN(num)) note.instrument = instruments[num].name
  }
  if (Array.isArray(song)) { // if the song is actually an array, convert it to a song
    let length = 0
    for (const note of song) {
      normalizeNote(note)
      length = Math.max(note.time, length)
    }
    return { name: '', notes: song, loop: false, loopPosition: 0, length }
  }
  let length = 0
  for (const note of song.notes ?? []) {
    normalizeNote(note)
    length = Math.max(note.time, length)
  }
  song.length = length
  return { name: '', notes: [], loop: false, loopPosition: 0, length, ...song }
}
function format (ms) {
  const s = ms / 1000

  const seconds = Math.floor(s / 60).toString()
  const minutes = Math.floor(s % 60).toString()
  
  if(seconds < 1) {
    return minutes + 's'
  }else if(minutes < 1) {
    return seconds + 'm'
  }else{
    return seconds + 'm ' + minutes + 's'
  }
}

module.exports = { injectTo }
