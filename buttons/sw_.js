const { PermissionsBitField, ButtonStyle, ActionRowBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB().table('logs')
const exist = require('../functions/multValue.js')

module.exports = {
    id: "sw_",
    permission: [PermissionsBitField.Flags.ManageRoles],
    async execute(interaction){
        const types = {
            'sw_bans': ['banAdd', 'banRemove'],
            'sw_msgs': ['msgEdit', 'msgDelete'],
            'sw_members': ['memAdd', 'memRemove', 'memUpdate']
        }

        if(interaction.component.data.style === 3){
            //Turn off
            await db.pull(`${interaction.guild.id}.types`, types[interaction.customId])
            interaction.component.data.style = 4
        }else{
            //Turn on
            if(!exist(await db.get(`${interaction.guild.id}.types`), types[interaction.customId])) await db.push(`${interaction.guild.id}.types`, types[interaction.customId])
            interaction.component.data.style = 3

        }

        let row = new ActionRowBuilder()
        for (let i in interaction.message.components[0].components){
            if(interaction.message.components[0].components[i].data.customId === interaction.customId){
                row.addComponents(interaction.message.components[0].components[i])
            }else{
                row.addComponents(interaction.message.components[0].components[i])
            }
        }
        interaction.update({components: [row]});
    }
}