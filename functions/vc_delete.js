module.exports = async function (member, channel, client) { 
    channel.delete()
    client.privates.delete(`${member.id}_${channel.guild.id}`)
};