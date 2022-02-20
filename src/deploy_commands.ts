/**
 * Discord Slash Commands Registration Script
 */

import { SlashCommandBuilder } from '@discordjs/builders';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

import { SpincordCommands, Command } from './constants/constants';

const { SPINCORD_BOT_TOKEN, SPINCORD_CLIENT_ID, DISCORD_TEST_GUILD_ID } = process.env;

const commandData = Object.values(SpincordCommands).map((command: Command) =>
    new SlashCommandBuilder()
        .setName(command.name)
        .setDescription(command.description)
        .addStringOption((option) =>
            option.setName(command.argumentName).setDescription(command.argumentDescription).setRequired(true),
        )
        .toJSON(),
);

(async () => {
    const rest = new REST({ version: '9' }).setToken(SPINCORD_BOT_TOKEN as string);

    try {
        console.log('Started refreshing application (/) commands...');

        if (DISCORD_TEST_GUILD_ID) {
            console.log('Registering application (/) commands for test server...');
            await rest.put(
                Routes.applicationGuildCommands(SPINCORD_CLIENT_ID as string, DISCORD_TEST_GUILD_ID as string),
                { body: commandData },
            );
        } else {
            console.log('Registering application (/) commands globally...');
            await rest.put(Routes.applicationCommands(SPINCORD_CLIENT_ID as string), { body: commandData });
        }

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();
