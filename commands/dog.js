const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dog')
        .setDescription('Випадкові фотографії собак!'),
    async execute(interaction) {
        await interaction.deferReply()

        let data = await fetch('https://dog.ceo/api/breeds/image/random').then(responce => responce.json())
        let embed = new EmbedBuilder()
        .setAuthor({ name: 'Випадкова собачка!' })
        .setColor('Grey')
        .setImage(data.message)
        .setFooter({ text: 'Зображення взято з сайту "dog.ceo". Ми не відповідаємо за зміст.' })
        await interaction.editReply({ embeds: [embed] })
    }
}