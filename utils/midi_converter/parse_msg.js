function parseMessage (message) {
    return message
  .replaceAll(/\*/g, '\\*')
      .replaceAll(/`/g, '\\`')
      .replaceAll(/</g, '\\<')
      .replaceAll(/>/g, '\\>')
      .replaceAll(/\|/g, '\\|')
      .replaceAll(/_/g, '\\_')
      .replaceAll(/http/g, 'http​')
      .trim()
  }
  module.exports = parseMessage
