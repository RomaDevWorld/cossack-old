const log = require('../functions/log.js')

module.exports = {
    name: 'messageDelete',
    once: false,
    async execute (message, client) {
        await log('msgDelete', client, { message })
}}