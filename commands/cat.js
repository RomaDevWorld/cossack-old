const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cat')
        .setDescription('Випадкові фотографії котів!'),
    async execute(interaction) {
        await interaction.deferReply()

        let data = await fetch('https://aws.random.cat/meow').then(responce => responce.json())
        let embed = new EmbedBuilder()
        .setAuthor({ name: 'Випадкова киця!' })
        .setColor('Orange')
        .setImage(data.file)
        .setFooter({ text: 'Зображення взято з сайту "aws.random.cat". Ми не відповідаємо за зміст.' })
        await interaction.editReply({ embeds: [embed] })
    }
}