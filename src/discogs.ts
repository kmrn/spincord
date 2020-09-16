import { request } from 'https';
import { escape } from 'querystring';

const { SPINCORD_DISCOGS_KEY, SPINCORD_DISCOGS_SECRET } = process.env;
const DISCOGS_HEADERS = {
    Authorization: `Discogs key=${SPINCORD_DISCOGS_KEY}, secret=${SPINCORD_DISCOGS_SECRET}`,
    'Content-Type': 'application/json',
    'User-Agent': 'SpincordDiscordBot/1.0 +https://github.com/kmrn/spincord',
};

interface Result {
    country: string;
    year: string;
    title: string;
    cover_image: string;
    resource_url: string;
    uri: string;
}

export const getReleaseDetails = (resourceUrl: string): Promise<void> => {
    const url = new URL(resourceUrl);
    const options = { headers: DISCOGS_HEADERS };
    return new Promise((resolve, reject) => {
        const responseData: Buffer[] = [];
        const req = request(url, options, (res) => {
            res.on('data', (chunk) => {
                responseData.push(chunk);
            });

            res.on('end', () => {
                const buffer = responseData.join('');
                const listing = JSON.parse(buffer);
                resolve(listing);
            });

            res.on('error', (error: Error) => {
                reject(error);
            });
        });

        req.on('error', (error: Error) => {
            reject(error);
        });

        req.end();
    });
};

export const findAlbum = async (album: string): Promise<Result> => {
    const results = await searchDiscogs(album);
    const [firstResult] = results;
    return firstResult;
};

export const searchDiscogs = (query: string): Promise<Result[]> => {
    const escapedQuery = escape(query);
    const options = {
        hostname: 'api.discogs.com',
        path: `/database/search?q=${escapedQuery}&type=release&page=1&per_page=3`,
        headers: DISCOGS_HEADERS,
    };

    return new Promise((resolve, reject) => {
        const responseData: Buffer[] = [];
        const req = request(options, (res) => {
            res.on('data', (chunk) => {
                responseData.push(chunk);
            });

            res.on('end', () => {
                const buffer = responseData.join('');
                const { results } = JSON.parse(buffer);
                resolve(results);
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
