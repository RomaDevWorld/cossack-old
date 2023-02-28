const { QuickDB } = require('quick.db')
const db = new QuickDB().table('votes')

module.exports = {
    id: "vote_",
    async execute(interaction){
        let embed = interaction.message.embeds[0].data
        let vote = await db.get(embed.footer.text)
        if(!vote){
            interaction.message.delete()
            return await interaction.reply({ content: 'Цього голосування більше не їснує', ephemeral: true })
        }

        var allVotes = 0
        for (let i in vote.options){
            if(vote.options[i].value.includes(interaction.user.id)) return await interaction.reply({ content: 'Ви вже проголосували', ephemeral: true })
            allVotes = allVotes + vote.options[i].value.length
        }

        let selected = (interaction.customId.split('_')[1] - 1)
        vote.options[selected].value.push(interaction.user.id)
        await db.set(embed.footer.text, vote)

        allVotes++

        var num = 1
        embed.description = vote.options.map((o, index) => `**${index+1}.** ${o.name} (${(o.value.length / allVotes * 100).toFixed(0)}%)`).join(`\n`)  + `\n\nУсього голосів: ${allVotes}`

        interaction.message.edit({ embeds: interaction.message.embeds })

        await interaction.reply({ content: 'Ваш голос зараховано', ephemeral: true })
    }
}