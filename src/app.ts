/**
 * spincord
 *
 * Discord bot for linking discogs info in chat
 */

import { Client, Intents } from 'discord.js';
import Spincord from './spincord/spincord';

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const spincord = new Spincord();

client.on('ready', () => {
    console.log('Spincord is now listening for commands...');
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    try {
        const response = await spincord.getResponse(interaction);
        interaction.reply(response);
    } catch (error) {
        interaction.reply(`Ran into some trouble with that one.\n\`\`\`${error}\`\`\``);
    }
});

client
    .login(process.env.SPINCORD_BOT_TOKEN)
    .then(() => console.log('Successfully authenticated bot account.'))
    .catch((error) => console.error(error));
