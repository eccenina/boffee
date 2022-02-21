const { Client, Intents } = require('discord.js');
const config = require('./config.json');

const { getVoiceConnection, joinVoiceChannel, AudioPlayerStatus, 
    AudioResource,  StreamType,createAudioResource, getNextResource, 
    createAudioPlayer, NoSubscriberBehavior,VoiceConnectionStatus,
    VoiceConnection,createReadStream 
} = require('@discordjs/voice');
const { map } = require('zod');
const { create } = require('combined-stream');
const nodemon = require('nodemon');

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES
    ]
})

client.on('ready', () =>{
    console.log('Bot is online');
})

client.on('messageCreate', async(msg) => {
    if (msg.author.bot) return;
    const mapKey = msg.guild.id;
    

    switch (msg.content) {
        case 'b!join':
            const connection = joinVoiceChannel({
                selfDeaf: false,
                channelId: msg.member.voice.channel.id,
                guildId: mapKey,
                adapterCreator: msg.guild.voiceAdapterCreator
            })
            const player = createAudioPlayer();
            connection.subscribe(player);
            msg.channel.send('joined the vc');

        case 'b!play':
            connection = getVoiceConnection(msg.member.guild.id)
            connection.subscribe(player);
            const resource = createAudioResource('./mp3/a.mp3');
                player.on( AudioPlayerStatus.Playing, () => {
                    console.log('The audio player has started playing!');
                });

                player.on('stateChange', (oldState, newState) => {
                    console.log(`Audio player transitioned from ${oldState.status} to ${newState.status}`);
                });
            player.play(resource);
        case 'b!leave':
            connection.destroy();
            console.log('Disconnected');

        
        
    }
})

client.login(config.token);