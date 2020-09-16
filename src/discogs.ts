import { request } from 'https';
import { escape } from 'querystring';

interface Result {
    country: string;
    year: string;
    title: string;
    cover_image: string;
    resource_url: string;
}

export const findAlbum = async (album: string): Promise<Result> => {
    const results = await searchDiscogs(album);
    const [firstResult] = results;
    return firstResult;
};

export const searchDiscogs = (query: string): Promise<Result[]> => {
    const escapedQuery = escape(query);
    const key = process.env.SPINCORD_DISCOGS_KEY;
    const secret = process.env.SPINCORD_DISCOGS_SECRET;
    const options = {
        hostname: 'api.discogs.com',
        path: `/database/search?q=${escapedQuery}&type=release&page=1&per_page=3`,
        method: 'GET',
        headers: {
            Authorization: `Discogs key=${key}, secret=${secret}`,
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
