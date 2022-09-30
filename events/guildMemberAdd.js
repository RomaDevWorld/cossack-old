const log = require('../functions/log.js') //Require log function

module.exports = {
    name: 'guildMemberAdd',
    once: false,
    async execute (member, client) {
        await log('memAdd', client, { member }) //Execute the function
}}