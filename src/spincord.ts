/**
 * spincord.ts
 */

import { Message, MessageAttachment } from 'discord.js';
import { findAlbum } from './discogs';

const getAlbumCover = async (message: Message, query: string): Promise<void> => {
    const album = await findAlbum(query);
    const attachment = new MessageAttachment(album.cover_image);
    message.channel.send(`${album.title}`, attachment);
};

/**
 * Spincord()
 * Takes a discord commands and returns a reply string.
 * @param command discord command being issued
 * @param args the string of arguments following the command
 */
export const Spincord = async (message: Message, command: string, query: string): Promise<void> => {
    switch (command) {
        case 'album':
        case 'albumart':
            await getAlbumCover(message, query);
            break;
        case 'pricecheck':
            message.reply('this ones not ready yet');
            break;
    }
};

export default Spincord;
