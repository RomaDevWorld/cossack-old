const client = require(`../index.js`);
const { QuickDB } = require('quick.db');
const db = new QuickDB().table('lobbies')

module.exports = {
    name: 'voiceStateUpdate',
    once: false,
    async execute (oldVoiceState, newVoiceState, client) {
        require('../functions/vc_timeout.js')(newVoiceState, oldVoiceState, client)

        let pas = oldVoiceState
        let cur = newVoiceState
        
        if(await db.get(cur.guild.id)){
            if(cur.channel && cur.channel.id === await db.get(cur.guild.id)){
                let set = client.privates[`${cur.guild.id}_${cur.id}`]
                if(set){
                    let channel = await cur.guild.channels.cache.get(set)
                    if(channel){
                        cur.setChannel(channel)
                    }else{
                        require("../functions/vc_create.js")(cur.member, cur.guild, client)
                    }
                }else{
                    require("../functions/vc_create.js")(cur.member, cur.guild, client)
                }
            }
        }

}}