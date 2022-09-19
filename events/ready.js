const { Rest, REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
require('dotenv').config()
const fs = require(`fs`)

module.exports = {
    name: 'ready',
    once: true,
    execute (client, commands) {
        console.log(`${client.user.tag} is online.`)

        //client.user.setPresence({ activities: [{ name: '?' }] }); //Bot's activity 

        const CLIENT_ID = client.user.id
        const rest = new REST({
            version: '10'
        }).setToken(process.env.TOKEN);
        (async () => {
            if(1 > 2){ //Change it to (1 < 2) to delete all the slash commands
                try{
                    rest.put(Routes.applicationGuildCommands(CLIENT_ID, process.env.GUILD_ID), { body: [] })
                    .then(() => console.log('All commands was deleted [GLOBAL]'))
                
                    rest.put(Routes.applicationCommands(CLIENT_ID), { body: [] })
                    .then(() => console.log('All commands was deleted [LOCAL]'))
                }catch (err) {
                    if(err) console.error(err)
                }
            }else{
                try {
                    if(process.env.ENV = 'production') {
                        await rest.put(Routes.applicationCommands(CLIENT_ID), {
                            body: commands
                        });
                        console.log("All commands was loaded [GLOBAL]")
                    } else {
                        await rest.put(Routes.applicationCommands(CLIENT_ID, process.env.GUILD_ID), {
                            body: commands
                        });
                        console.log("All commands was loaded [LOCAL]")
                    }
                } catch (err) {
                    if(err) console.error(err)
                }
            }
        })(); 

        setInterval(() => {
            require(`../functions/conters.js`)(client)
        }, 60000 * 5);
    }
}