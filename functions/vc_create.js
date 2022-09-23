const { PermissionsBitField, ChannelType } = require(`discord.js`)
const { QuickDB } = require(`quick.db`)
const db = new QuickDB().table("lobbies")

module.exports = async function (member, guild, client) { 

    let channel = await guild.channels.create({
        name: member.nickname || member.user.username,
        bitrate: 96 * 1000,
        parent: guild.channels.cache.get(await db.get(guild.id)).parent || undefined,
        type: ChannelType.GuildVoice,
        permissionOverwrites: [
            {
                id: guild.id,
                deny: [PermissionsBitField.Flags.ViewChannel],
            },
            {
                id: member.id,
                allow: [PermissionsBitField.Flags.ViewChannel],
            },
        ],
      })

    member.voice.setChannel(channel).catch(O_o=>{})
    client.privates[`${guild.id}_${member.user.id}`] = channel.id
    return channel
};