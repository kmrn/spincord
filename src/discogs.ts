/**
 * Discogs REST API Interface
 */

import { request } from 'https';
import { escape } from 'querystring';

export const discogsRootUrl = 'https://discogs.com';

/**
 * Result type returned by the Discogs search API
 */
export interface Result {
    id: number;
    country: string;
    year: string;
    title: string;
    cover_image: string;
    resource_url: string;
    uri: string;
}

/**
 * The Discogs Release data object
 */
export interface Release {
    id: number;
    country: string;
    year: string;
    uri: string;
    title: string;
    num_for_sale: number;
    lowest_price: number;
    released: string;
}

/**
 * Discogs marketplace data object
 */
export interface MarketplaceStats {
    blocked_from_sale: boolean;
    num_for_sale: number;
    lowest_price: {
        value: number;
        currency: string;
    };
}

class Discogs {
    private apiKey: string;
    private apiSecret: string;

    constructor(key: string, secret: string) {
        this.apiKey = key;
        this.apiSecret = secret;
    }

    /**
     * Takes a discogs API path and performs an authorized GET request.
     * @param path Discogs api path string
     */
    private async queryDiscogs(path: string): Promise<string> {
        const options = {
            hostname: 'api.discogs.com',
            path,
            headers: {
                Authorization: `Discogs key=${this.apiKey}, secret=${this.apiSecret}`,
                'Content-Type': 'application/json',
                'User-Agent': 'SpincordDiscordBot/1.0 +https://github.com/kmrn/spincord',
            },
        };
        return new Promise((resolve, reject) => {
            const responseData: Buffer[] = [];
            const req = request(options, (res) => {
                res.on('data', (chunk) => {
                    responseData.push(chunk);
                });

                res.on('end', () => {
                    const buffer = responseData.join('');
                    resolve(buffer);
                });

                res.on('error', (error: Error) => {
                    reject(error);
                });
            });

            req.on('error', (error: Error) => {
                console.error('error');
                reject(error);
            });

            req.end();
        });
    }

    /**
     * Takes a query string and returns an array of search results.
     * @param query Discogs search query string
     * @param type Type of results to filter by
     * @param page Results page no
     * @param perPage Amount of results per page
     */
    private async searchDiscogs(
        query: string,
        type: 'release' | 'master' | 'artist' | 'none',
        page: number,
        perPage: number,
    ): Promise<Result[]> {
        const escapedQuery = escape(query);
        const response = await this.queryDiscogs(
            `/database/search?q=${escapedQuery}&type=${type}&page=${page}&per_page=${perPage}`,
        );
        const { results } = JSON.parse(response);
        return results;
    }

    /**
     * Takes a discogs release ID and returns detailed release data.
     * @param releaseId Discogs release ID integer
     */
    public async getReleaseDetails(releaseId: number): Promise<Release> {
        const response = await this.queryDiscogs(`/release/${releaseId}`);
        const release: Release = JSON.parse(response);
        return release;
    }

    /**
     * Takes a discogs release ID and returns discogs marketplace statistics.
     * @param releaseId Discogs release ID integer
     */
    public async getMarketplaceStats(releaseId: number): Promise<MarketplaceStats> {
        const response = await this.queryDiscogs(`/marketplace/stats/${releaseId}`);
        const stats: MarketplaceStats = JSON.parse(response);
        return stats;
    }

    /**
     * Takes a best guess album name string and returns the first release search result
     * @param album Album name
     */
    public async getFirstAlbumResult(album: string): Promise<Result> {
        const results = await this.searchDiscogs(album, 'release', 1, 3);
        const [firstResult] = results;
        return firstResult;
    }

    /**
     * Takes a best guess artist name string and returns the first artist profile search result
     * @param artist Artist name
     */
    public async getFirstArtistResult(artist: string): Promise<Result> {
        const results = await this.searchDiscogs(artist, 'artist', 1, 3);
        const [firstResult] = results;
        return firstResult;
    }
}

export default Discogs;
