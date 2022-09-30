const { QuickDB } = require(`quick.db`)
const db = new QuickDB()

module.exports = async function (client) {
    const database = await db.table(`counters`).all() //Requires a table from db called 'counters'
    for (let i in database){ //Loops throught every value at db
        let guild = await client.guilds.cache.get(database[i].id) //Gets a guild from value
        let channel = await guild.channels.cache.get(database[i].value.id) //Gets a channel from value
        if(guild && channel){
                try{
                    let members = await guild.members.fetch() //Fetches all the guild members
                    let name = database[i].value.name //Defines a name
                        .replace(`ON`, members.filter(mem => mem.presence && !mem.user.bot).size) //Replaces "ON" with filtered members that is offline, and a bots
                        .replace(`ALL`, members.filter(mem => !mem.user.bot).size) //Replaces 'ALL' with filtered members that is bots
                     if(channel.name !== name) channel.setName(name) //If previous channel's name doesn't equal new name - change name
                }catch(err){
                    console.error(err) //Throw error if error
                }
        }else{
            await database.remove(database[i].id) //If guild or channel wasn't found - delete value from db
        }
    }
};