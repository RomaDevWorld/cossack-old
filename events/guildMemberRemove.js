const log = require('../functions/log.js')

module.exports = {
    name: 'guildMemberRemove',
    once: false,
    async execute (member, client) {
        await log('memRemove', client, { member })
}}