require(`dotenv`).config()
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require('discord.js');

const cd = new Set();
const cdTime = 5000; //If you want to, you can change the cooldown time (miliseconds)

module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute (interaction) {

        if(interaction.isCommand()){
        if (cd.has(interaction.user.id)) { 
            await interaction.reply({ embeds: [{ author: { name: `Охолодись! Команди можна писати лишень раз в ${cdTime / 1000} секунд!` }, color: 0xcc7229 }], ephemeral: true })
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
        }else if(interaction.isButton()){
            const buttons = await Array.from(interaction.client.buttons.keys())
            let button
            for (let i in buttons){
                if(interaction.customId.startsWith(buttons[i])) button = require(`../buttons/${buttons[i]}.js`)
            }
            if(!button) return await interaction.reply({ embeds: [{ author: { name: 'Дідько! Щось сталось не так! Спробуйте піздніше.' }, color: 0xcc2929 }], ephemeral: true })
            if(button.permission){
                let permissionBit = new PermissionsBitField([button.permission])
                if(!interaction.member.permissions.has(permissionBit)) return await interaction.reply({ embeds: [{ author: { name: 'Недостатньо прав!' }, color: 0xcc7229 }], ephemeral: true })
            }
            await button.execute(interaction)
        }
    }
}