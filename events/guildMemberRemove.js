const log = require('../functions/log.js') //Require log function

module.exports = {
    name: 'guildMemberRemove',
    once: false,
    async execute (member, client) {
        await log('memRemove', client, { member }) //Execute the function
}}