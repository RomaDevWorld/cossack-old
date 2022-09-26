const log = require('../functions/log.js')

module.exports = {
    name: 'guildMemberAdd',
    once: false,
    async execute (member, client) {
        await log('memAdd', client, { member })
}}