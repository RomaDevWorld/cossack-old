const { EmbedBuilder } = require('discord.js');
const { QuickDB } = require('quick.db')
const db = new QuickDB().table('logs')

module.exports = async function (type, client, options) {
    var channel
    //messageDelete
    if(type === 'msgDelete'){
        channel = await getlog(options.message.guild, true) //Finds a log channel from db
        if(!channel || await isOn(channel.guild, 'msgDelete') === false || options.message.author.bot) return; //If channel wasn't found or switcher is off, or user is bot - return
        let embed = new EmbedBuilder()
        .setAuthor({ name: `Повідомлення видалено | ${options.message.member.nickname}`, iconURL: options.message.member.displayAvatarURL({ dynamic: true }) })
        .setDescription(`[Перейти до повідомлення](${options.message.url})\n**Контент повідомлення:**\n` + options.message.content)
        .addFields(
            { name: 'Автор', value: `${options.message.author} (${options.message.author.tag})`, inline: true },
            { name: 'Канал', value: `${options.message.channel} (#${options.message.channel.name})`, inline: true }
        )
        .setFooter({ text: `USID: ${options.message.author.id}` })
        .setColor('Red')
        .setTimestamp()
        await channel.send({ embeds: [embed] }) //Creates an embed and send's it to the log channel
    }
    //messageUpdate
    else if(type === 'msgUpdate'){
        channel = await getlog(options.newMessage.guild, true)
        if(!channel || await isOn(channel.guild, 'msgUpdate') === false || options.newMessage.author.bot) return; //Does the same thing every time

        let embed = new EmbedBuilder()
        .setAuthor({ name: `Повідомлення відредаговано | ${options.newMessage.member.nickname}`, iconURL: options.newMessage.member.displayAvatarURL({ dynamic: true }) })
        .setDescription(`[Перейти до повідомлення](${options.newMessage.url})`)
        .addFields(
            { name: 'Автор', value: `${options.newMessage.author} (${options.newMessage.author.tag})`, inline: true },
            { name: 'Канал', value: `${options.newMessage.channel} (#${options.newMessage.channel.name})`, inline: true },
            { name: 'Раніше:', value: `${options.oldMessage.content}` },
            { name: 'Зараз:', value: `${options.newMessage.content}` }
        )
        .setFooter({ text: `USID: ${options.newMessage.author.id}` })
        .setColor('Blue')
        .setTimestamp()
        await channel.send({ embeds: [embed] })
    }
    //guildMemberUpdate
    else if(type === 'memUpdate'){
        channel = await getlog(options.newMember.guild, true)
        if(!channel || await isOn(channel.guild, 'memUpdate') === false) return;

        if(options.oldMember.nickname !== options.newMember.nickname){ //If old nickname and new nickname's are not the same
            let embed = new EmbedBuilder()
            .setAuthor({ name: `Нікнейм змінено | ${options.newMember.user.tag}`, iconURL: options.newMember.displayAvatarURL({ dynamic: true }) })
            .setDescription(`${options.newMember} змінив нікнейм!`)
            .addFields(
                { name: 'Раніше', value: `${options.oldMember.nickname}`, inline: true },
                { name: 'Зараз', value: `${options.newMember.nickname}`, inline: true },
            )
            .setFooter({ text: `USID: ${options.newMember.id}` })
            .setColor('Blue')
            .setTimestamp()
            await channel.send({ embeds: [embed] }) //Creare an embed then send it to the log
        }

        let embed = new EmbedBuilder()
        .setAuthor({ name: `Ролі змінено! | ${options.newMember.nickname || options.newMember.user.username}`, iconURL: options.newMember.displayAvatarURL({ dynamic: true }) })
        .setColor('Yellow')
        .setTimestamp()
        .setFooter({ text: `USID: ${options.newMember.id}` })
        if (options.oldMember.roles.cache.size > options.newMember.roles.cache.size) { //Role was removed
            let reRole = []
            options.oldMember.roles.cache.forEach(role => { //Loop throught every old role
                if (!options.newMember.roles.cache.has(role.id)) reRole.push(role) //If new role doesn't have old one - push it to the array
            });
            embed.addFields({ name: `Вилучені ролі:`, value: reRole.join(`\n`) }) //Add a field with the removed roles
        } else if (options.oldMember.roles.cache.size < options.newMember.roles.cache.size) { //Role was added
            let adRole = []
            options.newMember.roles.cache.forEach(role => { //Loop throught every new role
                if (!options.oldMember.roles.cache.has(role.id)) adRole.push(role) //If old role doesn't have new one - push it to the array
            });
            embed.addFields({ name: `Додані ролі:`, value: adRole.join(`\n`) }) //Add a field with the new roles
        }
        if(embed.data.fields) await channel.send({ embeds: [embed] }) //If at least one of the fields was added - send embed to the log
    }
    else if(type === 'memRemove'){
        channel = await getlog(options.member.guild, true)
        if(!channel || await isOn(channel.guild, 'memRemove') === false) return; //Does the same

        let embed = new EmbedBuilder()
        .setAuthor({ name: `Учасник вийшов | ${options.member.nickname}`, iconURL: options.member.displayAvatarURL({ dynamic: true }) })
        .setDescription(`${options.member} (${options.member.user.tag})`)
        .setFooter({ text: `ID: ${options.member.id}` })
        .setColor('Orange')
        .setTimestamp()
        await channel.send({ embeds: [embed] })
    }
    //guildMemberAdd
    else if(type === 'memAdd'){
        channel = await getlog(options.member.guild, true)
        if(!channel || await isOn(channel.guild, 'memAdd') === false) return; //Does the same

        let embed = new EmbedBuilder()
        .setAuthor({ name: `Учасник зайшов`, iconURL: options.member.displayAvatarURL({ dynamic: true }) })
        .setDescription(`${options.member} (${options.member.user.tag})`)
        .setFooter({ text: `ID: ${options.member.id}` })
        .setColor('Green')
        .setTimestamp()
        await channel.send({ embeds: [embed] })
    }
    else if(type === 'banAdd'){
        //Doesn't actyally work :(

        channel = await getlog(options.guild, true)
        if(!channel || await isOn(channel.guild.guild, 'banAdd') === false) return;

        let embed = new EmbedBuilder()
        .setAuthor({ name: `Учасник заблокований | ${options.user.username}`, iconURL: options.user.displayAvatarURL({ dynamic: true }) })
        .setDescription(`${options.user} (${options.member.user.tag})`)
        .setFooter({ text: `ID: ${options.user.id}` })
        .setColor('Red')
        .setTimestamp()
        await channel.send({ embeds: [embed] })
    }
    else if(type === 'banRemove'){
        //Doesn't actyally work :(

        channel = await getlog(options.guild, true)
        if(!channel || await isOn(channel.guild, 'banRemove') === false) return;

        let embed = new EmbedBuilder()
        .setAuthor({ name: `Учасник розблокований | ${options.user.username}`, iconURL: options.user.displayAvatarURL({ dynamic: true }) })
        .setDescription(`${options.user} (${options.member.user.tag})`)
        .setFooter({ text: `ID: ${options.user.id}` })
        .setColor('Yellow')
        .setTimestamp()
        await channel.send({ embeds: [embed] })
    }
};

async function getlog(guild, bool) {
    if(bool === true){ //For some reason i've added an boolean?
        return guild.channels.cache.get(await db.get(`${guild.id}.channel`)) //Returns a channel, that have been found from db(or not)
    } 
    return await db.get(guild.id)
}

async function isOn(guild, type){
    if((await db.get(`${guild.id}.types`)).includes(type)){ //If db array has that type
        return true
    }else{ //Nah
        return false
    }
}