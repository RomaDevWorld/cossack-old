const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Відображає затримку між хостингом і серверами Discord'),
    async execute(interaction) {  
        await interaction.reply(`${interaction.client.ws.ping}ms`)
    }
}