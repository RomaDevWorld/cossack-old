const log = require('../functions/log.js')

module.exports = {
    name: 'guildMemberUpdate',
    once: false,
    async execute (oldMember, newMember, client) {
        await log('memUpdate', client, { oldMember, newMember })
}}