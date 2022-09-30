const { QuickDB } = require('quick.db');
const db = new QuickDB().table('lobbies')

module.exports = {
    name: 'voiceStateUpdate',
    once: false,
    async execute (oldVoiceState, newVoiceState, client) {
        require('../functions/vc_timeout.js')(newVoiceState, oldVoiceState, client)

        let pas = oldVoiceState //I hate egirls
        let cur = newVoiceState
        
        if(await db.get(cur.guild.id)){ //Require lobby channel from db, if it's exist
            if(cur.channel && cur.channel.id === await db.get(cur.guild.id)){ //If current channel id = lobby channel
                let set = client.privates[`${cur.guild.id}_${cur.id}`] //Require client.channels
                let channel = await cur.guild.channels.cache.get(set) //Find user's private channel
                if(set && channel){ //If user allready has a private channel
                    cur.setChannel(channel) //If channel - set user's voicechannel to his private channel  
                }
                }else{
                    require("../functions/vc_create.js")(cur.member, cur.guild, client) //Execute function, that will create a new private channel
                }
            }
        }
}