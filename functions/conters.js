const { QuickDB } = require(`quick.db`)
const db = new QuickDB()

module.exports = async function (client) {
    const database = await db.table(`counters`).all() //Requires a table from db called 'counters'
    for (let i in database){ //Loops throught every value at db
        let guild = await client.guilds.cache.get(database[i].id) //Gets a guild from value
        let channel = await guild.channels.cache.get(database[i].value.id) //Gets a channel from value
        if(guild && channel){
                try{
                    let name = database[i].value.name //Defines a name
                        .replace(`ON`, await getOnline(guild)) //Replaces "ON" with filtered members that is offline, and a bots
                        .replace(`ALL`, await getMembers(guild)) //Replaces 'ALL' with filtered members that is bots
                        .replace('BOT', await getBots(guild))
                        .replace('VC', await getVoices(guild))
                     if(channel.name !== name) channel.setName(name) //If previous channel's name doesn't equal new name - change name
                }catch(err){
                    console.error(err) //Throw error if error
                }
        }else{
            const raw = await db.table(`counters`)
            await raw.delete(database[i].id) //If guild or channel wasn't found - delete value from db
        }
    }
};

async function getOnline(guild) {
    let members = await guild.members.fetch()
    return members.filter(mem => ['online', 'idle', 'dnd'].includes(mem.presence?.status) && !mem.user.bot).size
}
async function getMembers(guild) {
    let members = await guild.members.fetch()
    return members.filter(mem => !mem.user.bot).size
}
async function getBots(guild) {
    let members = await guild.members.fetch()
    return members.filter(mem => mem.user.bot).size
}
async function getVoices(guild) {
    let members = await guild.members.fetch()
    return members.filter(mem => mem.voice.channel).size
}