require(`dotenv`).config()
const { 
    EmbedBuilder, 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle, 
    PermissionsBitField } = require('discord.js');

const cd = new Set(); //New set for the cooldowns
const cdTime = 5000; //If you want to, you can change the cooldown time (miliseconds)

module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute (interaction) {

        if(interaction.isCommand()){ //If interaction is command
        if (cd.has(interaction.user.id)) { //If Set has user id
            await interaction.reply({ embeds: [{ author: { name: `Охолодись! Команди можна писати лишень раз в ${cdTime / 1000} секунд!` }, color: 0xcc7229 }], ephemeral: true })
            //Reply with cd message
          } else {
            const command = interaction.client.commands.get(interaction.commandName) //Get command name from interaction
            if(!command) return; //if command is not exist return (should add an error message)
            try { //Try to
                await command.execute(interaction); //Execute command

                cd.add(interaction.user.id); //Add an user id to Set
                setTimeout(() => {
                  cd.delete(interaction.user.id);
                }, cdTime); //Make an timeout
            } catch (err) { //If error
                if(err) console.error(err)
            }
        }
        }else if(interaction.isContextMenuCommand()){ //If interaction is context command
            const { commands } = client; //Get commands from client 
            const { commandName } = interaction; //Get command name from interaction
            const contextCommand = commands.get(commandName) //Find comand by command name
            if(!contextCommand) return; //if command is not exist return (should add an error message)

            try{ //Try to
                await contextCommand.execute(interaction) //Execute command
            }catch(err){ //If error
                if(err) console.error(err)
            }
        }else if(interaction.isButton()){ //If interaction is button
            const buttons = await Array.from(interaction.client.buttons.keys()) //Get client.interaction keys
            let button
            for (let i in buttons){ //Loop throught every button
                if(interaction.customId.startsWith(buttons[i])) button = require(`../buttons/${buttons[i]}.js`) //If interaction.customId starts with button's name, define button file
            }
            if(!button) return await interaction.reply({ embeds: [{ author: { name: 'Дідько! Щось сталось не так! Спробуйте піздніше.' }, color: 0xcc2929 }], ephemeral: true }) //Return an error if button is not exist
            if(button.permission){ //If button file has permissions
                let permissionBit = new PermissionsBitField([button.permission]) //Make a permissions bit
                if(!interaction.member.permissions.has(permissionBit)) return await interaction.reply({ embeds: [{ author: { name: 'Недостатньо прав!' }, color: 0xcc7229 }], ephemeral: true }) //Return if user doesn't have specified permissions
            }
            await button.execute(interaction) //Execute button
        }
    }
}