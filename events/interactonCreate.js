require(`dotenv`).config()
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { EmbedBuilder } = require(`discord.js`)
const fs = require(`fs`)

const cd = new Set();
const cdTime = 5000; //If you want to, you can change the cooldown time (miliseconds)

module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute (interaction) {

        if(interaction.isCommand()){
        if (cd.has(interaction.user.id)) { 
            interaction.reply({ content: `Охолодись! Команди можна писати лишень раз в ${cdTime / 1000} секунд!`, ephemeral: true });
          } else {
            
                const command = interaction.client.commands.get(interaction.commandName)
                if(!command) return;
                try {
                    await command.execute(interaction);
                } catch (err) {
                    if(err) console.error(err)
                }

           cd.add(interaction.user.id);
                setTimeout(() => {
                  cd.delete(interaction.user.id);
                }, cdTime);
            }
        }else if(interaction.isContextMenuCommand()){
            const { commands } = client;
            const { commandName } = interaction;
            const contextCommand = commands.get(commandName)
            if(!contextCommand) return;

            try{
                await contextCommand.execute(interaction)
            }catch(err){
                if(err) console.error(err)
            }
        }
    }
}