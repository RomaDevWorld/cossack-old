const { PermissionsBitField } = require('discord.js');

module.exports = {
    id: "mute_",
    permission: [PermissionsBitField.Flags.MuteMembers],
    async execute(interaction){
        const member = await interaction.guild.members.fetch(interaction.customId.slice(5))
        if(member){
            try{
                member.timeout(60 * 1000 * 5, `${interaction.user.tag}: Заблокувати чат на 5 хвилин`)
                await interaction.reply({ content: `Чат учасника був успішно заблокований на 5 хвилин.`, ephemeral: true })
            }catch(err){
                console.log(err)
                await interaction.reply({ content: `Щось пішло не так. Спробуйте ще-раз піздніше або зверніться до адміністратора.`, ephemeral: true })
            }   
        }
    }
}