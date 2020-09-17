/**
 * Discogs REST API Interface
 */

import { request } from 'https';
import { escape } from 'querystring';

const { SPINCORD_DISCOGS_KEY, SPINCORD_DISCOGS_SECRET } = process.env;

export interface Result {
    id: number;
    country: string;
    year: string;
    title: string;
    cover_image: string;
    resource_url: string;
    uri: string;
}

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

export interface MarketplaceStats {
    num_for_sale: number;
    lowest_price: number;
}

export const queryDiscogs = (path: string): Promise<string> => {
    const options = {
        hostname: 'api.discogs.com',
        path,
        headers: {
            Authorization: `Discogs key=${SPINCORD_DISCOGS_KEY}, secret=${SPINCORD_DISCOGS_SECRET}`,
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
};

export const searchDiscogs = async (query: string): Promise<Result[]> => {
    const escapedQuery = escape(query);
    const response = await queryDiscogs(`/database/search?q=${escapedQuery}&type=release&page=1&per_page=3`);
    const { results } = JSON.parse(response);
    return results;
};

export const getReleaseDetails = async (releaseId: number): Promise<Release> => {
    const response = await queryDiscogs(`/release/${releaseId}`);
    const release: Release = JSON.parse(response);
    return release;
};

export const getMarketplaceStats = async (releaseId: number): Promise<MarketplaceStats> => {
    const response = await queryDiscogs(`/marketplace/stats/${releaseId}`);
    const stats: MarketplaceStats = JSON.parse(response);
    return stats;
};

export const getFirstAlbumResult = async (album: string): Promise<Result> => {
    const results = await searchDiscogs(album);
    const [firstResult] = results;
    return firstResult;
};
