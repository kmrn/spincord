/**
 * spincord.ts
 */

import { Message, MessageAttachment } from 'discord.js';
import { findAlbum } from './discogs';

export const getAlbumArt = async (query: string): Promise<MessageAttachment> => {
    const { cover_image } = await findAlbum(query);
    const attachment = new MessageAttachment(cover_image);
    return attachment;
};

export const getAlbumInfo = async (query: string): Promise<string> => {
    const { uri } = await findAlbum(query);
    const message = 'https://discogs.com' + uri;
    return message;
};

/**
 * Spincord()
 * Takes a discord command and sends a reply string.
 * @param command string discord command being issued
 * @param query the argument string following the command
 */
export const Spincord = async (message: Message, command: string, query: string): Promise<void> => {
    const { channel } = message;
    switch (command) {
        case 'album':
            channel.send(await getAlbumInfo(query));
            break;
        case 'albumart':
            channel.send(await getAlbumArt(query));
            break;
        case 'pricecheck':
            message.reply('this ones not ready yet');
            break;
        case 'spincord':
        case 'spincordhelp':
        case 'spincord-help':
            // Send help message string
            channel.send(
                '**How to Use Spincord**\n' +
                    ":scroll:\t`!album [album name]` -> posts [album name]'s title, artist, and link to discogs release. Cover art attached.\n" +
                    ':frame_photo:\t`!albumart [album name]` -> posts the cover art for [album name]\n' +
                    ':money_with_wings:\t`!pricecheck [album name]` -> lets you know what [album name] is currently going for on the market\n' +
                    ':person_raising_hand:\t`!spincord` -> displays this message',
            );
            break;
    }
};

export default Spincord;
