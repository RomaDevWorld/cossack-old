const { QuickDB } = require(`quick.db`)
const db = new QuickDB()

module.exports = async function (client) {
    let database = await db.all()
    for (let i in database){
         let guild = await client.guilds.fetch(database[i].id)
        if(guild){
            let channel = await guild.channels.fetch(database[i].value.id)
            if(channel){
                try{
                    let members = await guild.members.fetch()
                    let name = database[i].value.name
                        .replace(`ON`, members.filter(mem => mem.presence && !mem.user.bot).size)
                        .replace(`ALL`, members.filter(mem => !mem.user.bot).size)
                     if(channel.name !== name) channel.setName(name)

                }catch(err){
                    console.log(err)
                }
            }else{
                await db.remove(database[i].id)
            }
        }else{
            await db.remove(database[i].id)
        }
    }
};