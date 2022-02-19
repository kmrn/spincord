/**
 * spincord
 *
 * Discord bot for linking discogs info in chat
 */

import { Client, Message } from 'discord.js';
import Spincord from './spincord';

const prefix = '!';
const client = new Client();
const spincord = new Spincord();

client.on('ready', () => {
    console.log('Spincord is now listening for commands...');
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
        await spincord.run(command, args, message);
    } catch (error) {
        message.reply(`Ran into some trouble with that one.\n\`\`\`${error}\`\`\``);
    }
});

client
    .login(process.env.SPINCORD_BOT_TOKEN)
    .then(() => console.log('Successfully authenticated bot account.'))
    .catch((error) => console.error(error));
