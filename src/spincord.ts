/**
 * spincord.ts
 */

import { Message, MessageAttachment } from 'discord.js';
import Discogs, { discogsRootUrl } from './discogs';

const { SPINCORD_DISCOGS_KEY, SPINCORD_DISCOGS_SECRET } = process.env;
const discogs = new Discogs(SPINCORD_DISCOGS_KEY as string, SPINCORD_DISCOGS_SECRET as string);

class Spincord {
    /**
     * Takes a query string and returns a string containing pricing info.
     * @param query album name/discogs query string
     */
    async getStartingPrice(query: string): Promise<string> {
        const { id, title } = await discogs.getFirstAlbumResult(query);
        const marketStats = await discogs.getMarketplaceStats(id);
        const { blocked_from_sale, num_for_sale, lowest_price } = marketStats;
        const { value, currency } = lowest_price;
        const marketplaceUrl = `${discogsRootUrl}/sell/release/${id.toString()}`;
        const price = // this should get replaced with something that actually returns the right currency mark
            (currency === 'USD' ? '$' : '') +
            value.toFixed(2).toString() +
            (currency !== 'USD' ? ` (${currency})` : '');
        if (blocked_from_sale) {
            return `Oh man... that release actually looks like it's *banned from sale* on Discogs.\n\n${marketplaceUrl}`;
        }
        if (num_for_sale < 1) {
            return `Sorry but it looks like you're the only one trying to sell one of those right now.\n\n${marketplaceUrl}`;
        }
        if (value > 500) {
            return `WOAH! *Certified RARE grail.* There's currently ${num_for_sale} of those listed for sale starting at ***${price}***!! :money_with_wings:\n\n${marketplaceUrl}`;
        }
        if (value > 100) {
            return `Wow! Must be pretty rare. ${num_for_sale} of those are listed for sale right now starting at **${price}**.\n\n${marketplaceUrl}`;
        }
        return `There are ${num_for_sale} listings for *${title}* starting at ${price}.\n\n${marketplaceUrl}`;
    }

    /**
     * Takes a query string and returns the closest matched album art.
     * @param query album name/discogs query string
     */
    async getAlbumArt(query: string): Promise<MessageAttachment> {
        const { cover_image } = await discogs.getFirstAlbumResult(query);
        const attachment = new MessageAttachment(cover_image);
        return attachment;
    }

    /**
     * Takes a query string and returns a discogs URL with more info.
     * @param query album name query string
     */
    async getAlbumInfo(query: string): Promise<string> {
        const { uri } = await discogs.getFirstAlbumResult(query);
        const message = discogsRootUrl + uri;
        return message;
    }

    async getArtistImage(query: string): Promise<MessageAttachment> {
        const { cover_image } = await discogs.getFirstArtistResult(query);
        const attachment = new MessageAttachment(cover_image);
        return attachment;
    }

    /**
     * Takes a query string and returns a discogs URL with more info.
     * @param query artist name query string
     */
    async getArtistInfo(query: string): Promise<string> {
        const info = await discogs.getFirstArtistResult(query);
        console.log(info);
        const { uri } = info;
        const message = discogsRootUrl + uri;
        return message;
    }

    /**
     * Takes a discord command and sends a reply string.
     * @param command string discord command being issued
     * @param query the argument string following the command
     */
    async run(command: string, query: string, message: Message): Promise<void> {
        const { channel } = message;
        switch (command) {
            case 'album':
                channel.send(await this.getAlbumInfo(query));
                break;
            case 'albumart':
                channel.send(await this.getAlbumArt(query));
                break;
            case 'artisturl':
            case 'artistinfo':
                channel.send(await this.getArtistInfo(query));
                break;
            case 'artistimage':
            case 'artistart':
            case 'artistpic':
                channel.send(await this.getArtistImage(query));
                break;
            case 'pricecheck':
                channel.send(await this.getStartingPrice(query));
                break;
            case 'spincord':
            case 'spincordhelp':
            case 'spincord-help':
                // Send help message string
                channel.send(
                    '**How to Use Spincord**\n' +
                        ":scroll:\t`!album [album name]` -> posts [album name]'s title, artist, and link to discogs release. Cover art attached.\n" +
                        ':frame_photo:\t`!albumart [album name]` -> posts the cover art for [album name]\n' +
                        ':woman_artist:\t`!artist [artist name]` -> \n' +
                        ':money_with_wings:\t`!pricecheck [album name]` -> lets you know what [album name] is currently going for on the market\n' +
                        ':person_raising_hand:\t`!spincord` -> displays this message',
                );
                break;
        }
    }
}

export default Spincord;
