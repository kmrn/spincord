/**
 * spincord
 *
 * Discord bot for linking discogs info in chat
 */

import Discord from 'discord.js';

const client = new Discord.Client();

client.on('message', (message) => {
    if (message.author.bot) return;
    console.log(message.content);
});

client.login(process.env.SPINCORD_BOT_TOKEN);
