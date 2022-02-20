/**
 * spincord.ts
 */

import { CommandInteraction, MessageOptions } from 'discord.js';
import Discogs, { discogsRootUrl } from '../utils/discogs';

import { Replies, SpincordCommands } from '../constants/constants';

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

        const price = // TODO: this should get replaced with something that actually returns the right currency mark
            (currency === 'USD' ? '$' : '') +
            value.toFixed(2).toString() +
            (currency !== 'USD' ? ` (${currency})` : '');

        let response = '';
        if (blocked_from_sale) {
            response = Replies.marketplace.bannedFromSale;
        } else if (num_for_sale < 1) {
            response = Replies.marketplace.noneForSale;
        } else if (value > 500) {
            response = Replies.marketplace.veryExpensive;
        } else if (value > 100) {
            response = Replies.marketplace.somewhatExpensive;
        } else {
            response = Replies.marketplace.startingValue;
        }

        return response
            .replace('{{num_for_sale}}', num_for_sale.toString())
            .replace('{{title}}', title)
            .replace('{{price}}', price)
            .concat(`\n\n${marketplaceUrl}`);
    }

    /**
     * Takes a query string and returns the closest matched album art.
     * @param query album name/discogs query string
     */
    async getAlbumArt(query: string): Promise<MessageOptions> {
        const { cover_image } = await discogs.getFirstAlbumResult(query);
        return { files: [{ attachment: cover_image }] };
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

    /**
     * Takes a query string and returns an image of an artist.
     * @param query artist name query string
     */
    async getArtistImage(query: string): Promise<MessageOptions> {
        const { cover_image } = await discogs.getFirstArtistResult(query);
        return { files: [{ attachment: cover_image }] };
    }

    /**
     * Takes a query string and returns a discogs URL with more info.
     * @param query artist name query string
     */
    async getArtistInfo(query: string): Promise<string> {
        const { uri } = await discogs.getFirstArtistResult(query);
        const message = discogsRootUrl + uri;
        return message;
    }

    /**
     * Takes a discord command and sends a reply string.
     * @param interaction discord command interaction
     */
    async sendResponse(interaction: CommandInteraction): Promise<void> {
        switch (interaction.commandName) {
            case SpincordCommands.album.name:
                interaction.reply(
                    await this.getAlbumInfo(interaction.options.getString(SpincordCommands.album.argumentName, true)),
                );
                break;
            case SpincordCommands.albumart.name:
                interaction.reply(
                    await this.getAlbumArt(interaction.options.getString(SpincordCommands.albumart.argumentName, true)),
                );
                break;
            case SpincordCommands.pricecheck.name:
                interaction.reply(
                    await this.getStartingPrice(
                        interaction.options.getString(SpincordCommands.pricecheck.argumentName, true),
                    ),
                );
                break;
            case SpincordCommands.artistinfo.name:
                interaction.reply(
                    await this.getArtistInfo(
                        interaction.options.getString(SpincordCommands.artistinfo.argumentName, true),
                    ),
                );
                break;
            case SpincordCommands.artistpic.name:
                interaction.reply(
                    await this.getArtistImage(
                        interaction.options.getString(SpincordCommands.artistpic.argumentName, true),
                    ),
                );
                break;
        }
    }
}

export default Spincord;
