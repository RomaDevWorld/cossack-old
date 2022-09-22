const client = require(`../index.js`)

module.exports = {
    name: 'voiceStateUpdate',
    once: false,
    async execute (oldVoiceState, newVoiceState, client) {
        let pas = oldVoiceState
        let cur = newVoiceState
        
        if(cur.channel && cur.channel.id === `1022537659354198157`){
            let set = client.privates[`${cur.guild.id}_${cur.id}`]
            if(set){
                let channel = await cur.guild.channels.cache.get(set)
                if(channel) cur.setChannel(channel)
            }else{
                require("../functions/vc_create.js")(cur.member, cur.guild, client)
            }
        }
}}