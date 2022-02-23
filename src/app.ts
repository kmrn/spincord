/**
 * spincord
 *
 * Discord bot for linking discogs info in chat
 */

import 'dotenv/config';
import { Client, Intents, Interaction, Message } from 'discord.js';
import Spincord from './spincord/spincord';

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const spincord = new Spincord();

client.on('ready', () => {
    console.log('Spincord is now listening for commands...');
});

client.on('interactionCreate', async (interaction: Interaction) => {
    if (!interaction.isCommand()) return;

    try {
        await spincord.sendResponse(interaction);
    } catch (error) {
        interaction.reply(`Ran into some trouble with that one.\n\`\`\`${error}\`\`\``);
    }
});

client.on('messageCreate', (message: Message) => {
    const { content, author } = message;
    if (!author.bot && content.startsWith('!spincord')) {
        message.reply(
            "Spincord now uses slash commands! Look at Spincord's icon in your commands list to see what's up.",
        );
    }
});

client
    .login(process.env.SPINCORD_BOT_TOKEN)
    .then(() => console.log('Successfully authenticated bot account.'))
    .catch((error) => console.error(error));
