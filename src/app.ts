/**
 * spincord
 *
 * Discord bot for linking discogs info in chat
 */

import { Client, Message } from 'discord.js';

const prefix = '!';
const client = new Client();

client.on('ready', () => {
    console.log('spincord is now ready for grailz');
});

client.on('message', async (message: Message) => {
    const { content, author } = message;
    if (author.bot || !content.startsWith(prefix)) {
        return;
    }
    const [commandString] = content.split(' ');
    const command = commandString.slice(prefix.length).toLowerCase();
    const args = content.slice(commandString.length);

    switch (command) {
        case 'album':
            break;
    }

    message.reply(`wow thats like my favorite album`);
});

client.login(process.env.SPINCORD_BOT_TOKEN);
