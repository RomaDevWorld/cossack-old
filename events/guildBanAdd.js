const log = require('../functions/log.js')

module.exports = {
    name: 'guildBanRemove',
    once: false,
    async execute (guild, user, client) {
        await log('banRemove', client, { guild, user })
}}