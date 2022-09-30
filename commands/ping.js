const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Відображає затримку між хостингом і серверами Discord'),
    async execute(interaction) {
        let resDate = new Date().getTime() //Saves the time before interaction
        await interaction.reply({content: `Рахуємо..`, ephemeral: true}).then(async(msg) => { //Sends the message then edits it.
            await interaction.editReply(`**Затримка Discord:** ${interaction.client.ws.ping}мс.\n**Затримака програми:** ${new Date().getTime() - resDate}мс.`) //Substract a time before interaction from current time
        })
    }
}