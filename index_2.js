const {Client, MessageEmbed, MessageAttachment, Role, MessageManager} = require('discord.js');
const game = require('./card_game');
const ping = require('minecraft-server-util');
const randomInt = require('random-int');
const bot = new Client();
const humanizeDuration = require('humanize-duration');
const hypixel = require("hypixel-api-nodejs");
let finalArray = [];
let finalArray2 = [];
let finalArray3 = [];
let check = false;
let time = 00000000;
const token = 'NzIwMjk5MDA3NzA0MDM5NTI1.XuD8wQ.EY4aQsVyPQkz9jZX1zkEsy2KGoA';
let whitelistee = [];
//let newsChannel1 = [];
const Prefix = '$';
const request = require('request');
let key = `3e865cae-bf3c-47f9-a02a-2c79c6549cef`;         
const config = {
    commands: {
        status: {
            command: ".status",
            messages: {
                error: "Error getting Minecraft server status...",
                offline: "*Minecraft server is currently offline*",
                online: "**Minecraft** server is **online**  -  ",
                players: "**{online}** people are playing!",
                noPlayers: "**Nobody is playing**"
            }
            
        },
        ip: {
            command: ".ip",
            messages: {
                main: "IP: blockfront.wither.co"
            }
        }
    },
    server: {
        ip: "blockfront.wither.co",
        port: 25609  
    }
};

function cacheMessages(channel1) { 
    channel1.messages.fetch({ limit: 100 }).then(async messages => {
        const putInArray = async (data) => finalArray.push(data);
        for (const message of messages.array().reverse()) await putInArray(message.content);
    });
}
function cacheMessages2(channel1) { 
    channel1.messages.fetch({ limit: 100 }).then(async messages => {
        const putInArray = async (data) => finalArray3.push(data);
        for (const message of messages.array().reverse()) await putInArray(message.content);
    });
}

function checkMention(channelww, authid) {
    check = false;
    for (var i = 0; i < finalArray.length; i++) {
        var msg = finalArray[i].split(' ');
        if (msg[0] == '<@' + authid + '>' || msg[0] == '<@!' + authid + '>') {
            channelww.send('You already have a whitelist request that is being processed!');
            check = true; 
            break; 
        } 
    }
}

function getJoinRank(ID, guild) { 
    if (!guild.member(ID)) return; 

    let arr = guild.members.cache.array(); 
    arr.sort((a, b) => a.joinedAt - b.joinedAt); 

    for (let i = 0; i < arr.length; i++) { 
      if (arr[i].id == ID) return i; 
    }
}

function messagedelete(channel, number) {
    channel.bulkDelete(number);
}



function trialcalc(trials, r1, r2) {
    var resulty = [];
    var resultn = [];
    for (var i = 1; i <= trials; i++) {
        var rand = randomInt(0, 99);
        if (rand <= r1) {
            resulty.push('y');
        } 
        else {
            resultn.push('n');
        }
   }
   console.log('Yes: ' + resulty.length);
   console.log('No: ' + resultn.length);
}

function ping2(message) {
    //periodically ping me in general so I dont get every message
    if (message.content == '<@464156671024037918> New messages in <#816706813856055298>.' || message.content == '<@464156671024037918> New messages in <#817099205482774604>.' || message.content == '<@464156671024037918> New messages in <#868921424394461294>.') {
        message.delete();
    }
    let id = '';
    if (message.mentions.users.first() != undefined) {
        id = message.mentions.users.first().id;
    }
    if ((message.channel.id == '868921424394461294' || message.channel.id == '816706813856055298' || message.channel.id == '817099205482774604') && (Date.now() - time) > 1800 * 1000 && message.author.id != '464156671024037918' && id != '464156671024037918') { //30 minutes lockout 
        time = Date.now();
        bot.channels.cache.get('854109891756687391').send(`<@464156671024037918> New messages in <#${message.channel.id}>.`);
    }
}


bot.on('ready', () =>{
    console.log('Bot online');
    bot.user.setActivity('All your War on the Block Front Needs | $help');
    cacheMessages(bot.channels.cache.get('784123618127773709'));
    var cacheint = setInterval(function () {cacheMessages(bot.channels.cache.get('784123618127773709'))}, 5 * 60000);
    cacheMessages2(bot.channels.cache.get('788399748704108575'));
})

bot.on('message', message => {

    ping2(message);

    let args = message.content.substring(Prefix.length).split(" ");
    if (!message.content.startsWith(Prefix)) {
        return;
    }

    switch(args[0]) {
        case 'dynmap':
            message.channel.send('http://blockfront.wither.co:8192/');
            break; 
        case 'whitelist': 
            checkMention(message.channel, message.author.id);
            if(message.channel.name === '🤖bot-commands🤖' && message.member.roles.cache.some(r => r.id == '691212517837373493' && check == false)) {
                check = false;
                whitelistee.push(message.author);
                let whitelist_message = args.slice(2).join(' '); 
                if (args[1] != undefined) {
                    message.reply('a whitelist request has been sent. Our staff will talk with you in a vc shortly.'); 
                    bot.channels.cache.get('784123618127773709').send('<@' + whitelistee[whitelistee.length - 1] + '> has requested to be whitelisted. \nIGN: ' + args[1] + '\nMessage: ' + whitelist_message).then(sentEmbed =>{                    
                        sentEmbed.react('✔️');
                        sentEmbed.react('❌');  
                    });     
                }
                else {
                    message.reply('Please write you IGN as the first argument.');
                }    
            }
            else if (check == false){ 
                return message.reply('this command is disabled in the channel or you are already whitelisted. Go to <#719311864714231829> in order to use this command.');
            }
            break;
        case 'info':
            message.channel.send('War on the Block Front is a server modpack. It is a modded Minecraft war server based on diplomacy, tech, war, roleplay, and colonisation. It’s on a map of earth with countries and other types of groups. Forge alliances and craft your own storues. Compete and rage war with empires in this sandbox Country server. \n\n**Member Count:** ' + message.guild.memberCount+ '\n \n Dynmap: http://blockfront.wither.co:8192/ \n \n Store: https://war-on-the-block-front.tebex.io/');
            break;  
        case 'server':
            let url = 'http://mcapi.us/server/status?ip=' + config.server.ip + '&port=' + config.server.port;
            request(url, (err, response, body) => {
                body = JSON.parse(body);
                if(body.online) {
                    ping('blockfront.wither.co', 25565, (error, response) => {                
                        var modstring = '';
                        var length = response.modList.length;
                        response.modList.forEach((element, index) => {
                            if(typeof  element.modid !== 'undefined') {
                                modstring = modstring + element.modid; 
                            } 
    
                            if(length - 1 !== index) {
                              modstring = modstring + ', '
                            } 
                           
                        });
                        const Embed = new MessageEmbed()
                            .setColor('#2ECC71')
                            .setTitle('Server Information')
                            .setThumbnail('https://i.imgur.com/XhTaNGZ.png')
                            .addField('Server IP:', response.host)
                            .addField('Minecraft Version:', response.version.substring(53))
                            .addField('Online Players:', response.onlinePlayers)
                            .addField('Mods:', modstring)
                            message.channel.send(Embed);                     
                        }) 
                }
                
                
                    
                
               
                    else {
                        ping('blockfront.wither.co', 25609, (error, response) => {                
                            if(error);
                           
                            const Embed = new MessageEmbed()
                                .setColor('#E74C3C')
                                .setTitle('Server Information')
                                .setThumbnail('https://i.imgur.com/XhTaNGZ.png')
                                .addFields(
                                    {name: 'Status:', value: 'Server is down :('}
                                )
                                message.channel.send(Embed);
        
                            }) 
                    }
                   
                })
            break;
        case 'help':
            const Embed = new MessageEmbed()
            .setTitle('Bot Help')
            .addFields(
                { name:'Commands', value: '$help\n$info\n$server\n$whitelist\n$dynmap\n$store\n$userinfo\n$avatar\n$weapon' }
            )
            message.channel.send(Embed);
            break;
        case 'store':
             
            const storechannel = message.channel;
            message.channel.send('Store: https://war-on-the-block-front.tebex.io/');
            //if (args[1] = 'buy' && args[2] != '' && message.channel.id == '719311864714231829') {
                //message.guild.channels.cache.get('724829614731558972').send('<@' + message.author + '> has requested to purchase **' + args[3] + '** from ' + args[1] + '.');
                ///message.reply('Purchase order sent.')
            //}
            //else if (args[2] != '' && message.channel.id == '751185165363183656'){
                //message.author.send('Please use that command in the bot-commands channel.'); 
               // message.delete();
            //}
            //else if(args[3] == '') {
                //message.author.send('Please type the package that yopu wish to buy as the final argument.');
            //}
            if (args[1] = 'ranks' && message.channel.id == '751185165363183656') {
                const Embedscout = new MessageEmbed()
                .setTitle('Scout Rank - $5.00')
                .addFields(
                    {name: 'Includes:', value: '- 25% /home cooldown\n- /kit Construction\n- Special Rank in-game'}
                    )
                .setThumbnail('https://i.imgur.com/ZnwIThZ.png')
                .setFooter('Making a purchase through the bot will DM me for your order. | This message will delete itself in 30 seconds.')

                const Embedsoldier = new MessageEmbed()
                .setTitle('Soldier Rank - $10.00')
                .addFields(
                    {name: 'Includes:', value: '- All bonuses from Scout Rank\n- 50% /home cooldown\n- /kit medic\n- Special Rank in-game'}
                    )
                .setThumbnail('https://i.imgur.com/LXIwU7E.png')
                .setFooter('Making a purchase through the bot will DM me for your order. | This message will delete itself in 30 seconds.')

                const Embedveteran = new MessageEmbed()
                .setTitle('Veteran Rank - $15.00')
                .addFields(
                    {name: 'Includes:', value: '- All bonuses from the Soldier Rank\n- /kit transport\n- Special Rank in-game'}
                    )
                .setThumbnail('https://i.imgur.com/j4YND4A.png')
                .setFooter('Making a purchase through the bot will DM me for your order. | This message will delete itself in 30 seconds.')

                const Embedgeneral = new MessageEmbed()
                .setTitle('General Rank - $60.00')
                .addFields(
                    {name: 'Includes:', value: '- All bonuses from Veteran Rank\n- national anthem\n- custom flag kit\n- /kit Rifle\n- /kit SMG\n- /kit LMG\n- /kit General (weekly)\n- $10 gift card\n- Can gift a Rifle, SMG, or an LMG to one friend\n- Special Rank in-game'}
                    )
                .setThumbnail('https://i.imgur.com/enyHyml.png')
                .setFooter('Making a purchase through the bot will DM me for your order. | This message will delete itself in 30 seconds.')


                message.channel.send(Embedscout);
                message.channel.send(Embedsoldier);
                message.channel.send(Embedveteran);
                message.channel.send(Embedgeneral);
                message.delete();
                setTimeout(messagedelete, 30000, storechannel, 4);   
            }
            
            break;
        case 'userinfo':
            var userinfo = message.mentions.users.first();
            if (userinfo != undefined) {
                var joinDate = getJoinRank(userinfo.id, message.guild) + 1;
                var userinfo2 = message.mentions.members.first();
                var joinedSince = ((userinfo2.joinedAt.valueOf() - message.guild.createdAt.valueOf()) / 86400000);
                var joinedNow = ((Date.now() - userinfo2.joinedAt.valueOf()) / 86400000);
                var num = ''
                if (joinDate.toString().endsWith('1')) {
                        num = 'st'
                    }
                else if (joinDate.toString().endsWith('2') && joinDate.toString().endsWith() != '12') {
                        num = 'nd'
                    }
                else if (joinDate.toString().endsWith('3')) {
                        num = 'rd'
                    }
                else {
                        num = 'th'
                    }
                if (userinfo2.nickname != null) {
                    const Embed1 = new MessageEmbed()
                    .setTitle('User Information(' + userinfo2.nickname + '):')
                    .setThumbnail(userinfo.avatarURL())
                    .addFields(
                        {name: 'Join Date: (' + userinfo2.joinedAt.toString().slice(0, 15) + ')', value: 'This user is the ' + joinDate + num + ' memeber of the server. \nThey joined ' + Math.round(joinedSince) + ' days after the server was created, ' + Math.round(joinedNow) + ' days ago.', inline: false},
                        {name: 'Roles:', value: userinfo2.roles.cache.map(roles => `${roles}`).join(', '), inline: false}
                    )
                message.channel.send(Embed1);
                    }
                else {
                    const Embed1 = new MessageEmbed()
                    .setTitle('User Information(' + userinfo.username + '):')
                    .setThumbnail(userinfo.avatarURL())
                    .addFields(
                        {name: 'Join Date:', value: userinfo2.joinedAt.toString().slice(0, 15) + ', This user is the ' + joinDate + num + ' memeber of the server. \nThey joined ' + Math.round(joinedSince) + ' days after the server was created, ' + Math.round(joinedNow) + ' days ago.', inline: false},
                        {name: 'Roles:', value: userinfo2.roles.cache.map(roles => `${roles}`).join(', '), inline: false}
                    )
                message.channel.send(Embed1);
                    }
                }
                
            else {
                message.reply('Please mention a user as the first argument.');
                return;
            }
            break;
        case 'trials':
            if (message.member.roles.cache.some(r => r.id == '745447329578090910')) {
                trialcalc(args[1], args[2], args[3]);
            }
            else {
                message.channel.send('That command is for Marbleville!')
            }
            break;
        case 'avatar':
            if (args[1] == undefined) {
                message.channel.send('Please @ someone as the first agrument.')
            }
            else {
                var usermsg = message.mentions.members.first();
            var usermsg1 = message.mentions.users.first();
            if (usermsg.nickname != null) {
                const Embed = new MessageEmbed()
                .setTitle('Avatar(' + usermsg.nickname + '):')
                .setImage(usermsg1.avatarURL())
                message.channel.send(Embed);
            }
            else {
                const Embed = new MessageEmbed()
                .setTitle('Avatar(' + usermsg1.username + '):')
                .setImage(usermsg1.avatarURL())
                message.channel.send(Embed);
            }
            }
            break;        
        case 'punish':   
            var mutemember = message.mentions.members.first();
            const logchannel = bot.channels.cache.get('767515303533871114'); //767515303533871114 719316005637062768 
            var muterole= mutemember.guild.roles.cache.find(role => role.name === "Muted");
            logchannel.messages.fetch().then(async messages => {
                const putInArray = async (data) => finalArray2.push(data);
                for (const message of messages.array().reverse()) await putInArray(message.content); 
            });
            var countnum = finalArray2.length;
            var points;
            if  (message.member.roles.cache.some(r => r.id == '738204917075804301')) {
                if (args[1] = 't1') {
                    if (finalArray2.length > 0) {
                        for (var count = 1; count <= countnum; count++) {
                            var user = finalArray2[0].split(' ');
                            if (user[0] == '<@' + message.mentions.users.first().id + '>') {
                                points = user[1];
                                if (points = 1) {
                                    mutemember.roles.add(muterole);
                                    bot.channels.cache.get('696930011042676789').send('<@' + message.mentions.users.first().id + '> is in need of a **6 hour** mute in game.');
                                    setTimeout(function() {
                                        mutemember.removeRole(role).catch(console.error);    
                                    }, 21600000 /* 6 hours */);
                                }
                                if (points >= 2) {
                                    mutemember.roles.add(muterole);
                                    bot.channels.cache.get('696930011042676789').send('<@' + message.mentions.users.first().id + '> is in need of a **24 hour** mute in game.');
                                    setTimeout(function() {
                                        mutemember.removeRole(role).catch(console.error);    
                                    }, 86400000 /* 24 hours*/);
                                }
                            }
                        }
                    }
                    else {
                        bot.channels.cache.get('767515303533871114').send('<@' + args[2].substring(3, args[2].length - 1) + '> 1');
                        bot.channels.cache.get('696930011042676789').send('<@' + message.mentions.users.first().id + '> is in need of a **6 hour** mute in game.');
                        mutemember.roles.add(muterole);
                        setTimeout(function() {
                                mutemember.roles.remove(muterole).catch(console.error);   
                        }, 21600000 /* 6 hours */);
                    }
                }
                else if (args[1] = 't2') {

                }
                else if (args[1] = 't3') {

                }
                else if (args[1] = 't4') {

                }
                else {
                    message.channel.send('Pick a punishemnt tier.');
                }
            }
            else {
                message.channel.send('Only staff can do that, dum dum.');
            }
            break;
        case 'check':
            var count1 = 0;
            if (message.author.id = '464156671024037918') {
                if (args[1] == 'on') {
                    console.log('Check Running...');
                    var interval = setInterval(function () {
                        if (count1 >= 5) {
                            clearInterval(interval);
                            console.log('Check stopped...');
                        }
                        else {
                            hypixel.getPlayerByName(key, `marbleville`).then(userplay => {
                                if(!userplay.success || userplay.success == false || userplay.player == null || userplay.player == undefined || !userplay.player) { return message.channel.send(`Player has no data in Hypixel's Database`)}              
                                if (userplay.player.lastLogout >= userplay.player.lastLogin) {
                                    console.log('Logged Out');
                                    const yell = bot.channels.cache.get('720295060171915308');
                                    yell.send('<@464156671024037918> You logged off.');
                                    count1++;
                                }
                            })
                            .catch(console.error);
                        }    
                    }, 600 * 1000);
                } 
                else {
                    message.channel.send('error...');
                }         
            }
            else {
                message.channel.send('stfu');
                return;
            }      
            break;
        case 'weapon':
            if (message.channel.name === '🤖bot-commands🤖' && message.member.roles.cache.some(r => r.id == '689564499451445259' && args[1] !== undefined)) {
                bot.channels.cache.get('788399748704108575').send('<@' + message.author.id + '> has requested to use the wepaon **' + args[1] + '**').then(endEmbed => {
                    endEmbed.react('👍');
                    endEmbed.react('👎');
                })
                message.reply('request sent.');
            }
            else {
                message.reply('This command is disabled in this channel or you forgot to type you weapon as the first argument.');
            }
            break;
        }      
      
            

});


bot.on('messageReactionAdd', (messageReaction, user) => {                 
    if(user.bot)  return;
    const { message, emoji } = messageReaction;
    
    if(emoji.name === "✔️" && message.channel.id === '784123618127773709') {
        let IGN = message.content.split(':');
        let discord = message.content.split(' ');
        message.delete()
        bot.channels.cache.get('697565592491917332').send( discord[0] + ' has been whitelisted by <@' + user + '>. \nIGN:' + IGN[1] + ':' + IGN[2]);
        var ingamename = IGN[1].split('\n');
        bot.channels.cache.get('784869935990046810').send('whitelist add' + ingamename[0]);
        bot.channels.cache.get('719311864714231829').send( discord[0] + ', your whitelist request has been accepted.');                       
        return; 
    }                      
        
    else if(emoji.name === "❌" && message.channel.id === '784123618127773709') {
        let IGN = message.content.split(":");
        let discord = message.content.split(' ');
        message.delete()
        bot.channels.cache.get('697565592491917332').send(discord[0] + ' has been refused a whitlist by <@' + user + '>. \nIGN:' + IGN[1] + ':' + IGN[2]);
        return;      
    } 
    if (emoji.name === '👍' && message.channel.id === '788399748704108575') {
        let discord = message.content.split(' ');
        message.delete()
        bot.channels.cache.get('697565592491917332').send( '<@' + user + '> has allowed ' + discord[0] + ' to use the weapon ' + discord[7] + '.');
        bot.channels.cache.get('719311864714231829').send( discord[0] + ', your weapon request has been accepted.');                       
        return; 
    }
    else if (emoji.name === "👎" && message.channel.id === '788399748704108575') {
        let discord = message.content.split(' ');
        message.delete()
        bot.channels.cache.get('697565592491917332').send(discord[0] + ' has been refused a weapon use by <@' + user + '>.');
        return;
    }
    
    if (message.channel.type === 'dm') {
        //get player obj then get hand to compare
        let player = game.findPlayer(user);
        let hand = player.getHand;
        console.log(hand);
    }
})  


    
bot.login(token);
