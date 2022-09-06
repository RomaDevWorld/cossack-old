const { SlashCommandBuilder } = require('discord.js')
const { QuickDB } = require("quick.db");
const db = new QuickDB()

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Відображає затримку між хостингом і серверами Discord'),
    async execute(interaction) {  
        await db.push(`pin_${interaction.user.id}`, `${Date.now()}`);
        await interaction.reply(`${interaction.client.ws.ping}ms`)

        console.log(await db.get(`pin_${interaction.user.id}`))
    }
}