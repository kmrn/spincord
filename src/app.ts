/**
 * spincord
 *
 * Discord bot for linking discogs info in chat
 */

import { Client, Message } from 'discord.js';
import Spincord from './spincord';

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
    const args = content.slice(commandString.length + 1);

    try {
        await Spincord(message, command, args);
    } catch (error) {
        message.reply(`Ran into some trouble finding that one.\n\`\`\`${error}\`\`\``);
    }
});

client.login(process.env.SPINCORD_BOT_TOKEN);
