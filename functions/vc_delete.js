module.exports = async function (member, channel, client) { 
    channel.delete()
    delete client.privates[`${channel.guild.id}_${member.id}`]
};