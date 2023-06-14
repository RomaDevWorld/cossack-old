const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
const { ActivityType } = require('discord.js')
const { cache } = require('../functions/trackInvites.js')
require('dotenv').config()

module.exports = {
  name: 'ready',
  once: true,
  async execute(client, commands) {
    console.log(`${client.user.tag} is online.`)

    const info = {}
    info.Guilds = client.guilds.cache.size
    info.Users = client.users.cache.size
    info.Channels = client.channels.cache.size
    console.table(info)

    client.user.setActivity('tinyurl.com/cossac-invite', {
      type: ActivityType.Playing,
    }) //Client's activity

    cache(client)

    const CLIENT_ID = client.user.id
    const rest = new REST({
      version: '10',
    }).setToken(process.env.TOKEN)

    try {
      await rest.put(Routes.applicationCommands(CLIENT_ID, process.env.GUILD_ID), {
        body: commands,
      })
      console.log('All commands were loaded [LOCAL]')
    } catch (err) {
      if (err) console.error(err)
    }

    setInterval(() => {
      require('../functions/counters.js')(client) //Execute 'counters' function every 5 minutes
    }, 60000 * 2.5)
  },
}
