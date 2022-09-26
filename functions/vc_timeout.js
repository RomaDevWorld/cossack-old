var timeouts = {}

module.exports = async function (newVoiceState, oldVoiceState, client) {
    let privates = client.privates
    for (let i in privates){
        if(oldVoiceState.channel && oldVoiceState.channel.id === privates[i]){
            //User left from VC
            if(oldVoiceState.channel.members.size === 0){
                timeouts[privates[i]] = setTimeout(function(){
                    let channel = newVoiceState.guild.channels.cache.get(privates[i])
                    if(channel) require('../functions/vc_delete.js')({id: i.split('_')[1]}, channel, client)
                    clearTimeout(privates[i])
                    delete timeouts[privates[i]]
                }, 60000)
            }
        }else if(newVoiceState.channel && newVoiceState.channel.id === privates[i]){
            //User joined VC
            if(timeouts[privates[i]]){
                clearTimeout(timeouts[privates[i]])
                delete timeouts[privates[i]]
            }
        }
    }
};