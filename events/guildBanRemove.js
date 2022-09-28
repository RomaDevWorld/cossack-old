const log = require('../functions/log.js')

module.exports = {
    name: 'guildBanAdd',
    once: false,
    async execute (guild, user, client) {
        await log('banAdd', client, { guild, user })
}}