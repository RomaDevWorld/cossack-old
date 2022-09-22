const { PermissionsBitField, ChannelType } = require(`discord.js`)

module.exports = async function (member, guild, client) { 
    let channel = await guild.channels.create({
        name: member.nickname || member.user.username,
        bitrate: 96 * 1000,
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
      //channel.setParent(993894475246084221)

      if(member.voice.channel) member.voice.setChannel(channel)

      client.privates[`${guild.id}_${member.user.id}`] = channel.id
      return channel
};