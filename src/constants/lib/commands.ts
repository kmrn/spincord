/**
 * Application Slash Commands
 */

export interface Command {
    name: string;
    argumentName: string;
    argumentDescription: string;
    description: string;
}

export const SpincordCommands = {
    album: {
        name: 'album',
        argumentName: 'album-title',
        argumentDescription: 'the name of the album being searched for',
        description: 'has Spincord post a Discogs link to the most relevant release it can find',
    },
    albumart: {
        name: 'albumart',
        argumentName: 'album-title',
        argumentDescription: 'the name of the album being searched for',
        description: 'has Spincord post the album art for a given release',
    },
    pricecheck: {
        name: 'pricecheck',
        argumentName: 'album-title',
        argumentDescription: 'the name of the album being searched for',
        description: 'gets the current market value of of a discogs release',
    },
    artistinfo: {
        name: 'artistinfo',
        argumentName: 'artist-name',
        argumentDescription: 'the name of an musician',
        description: 'gets more info about a given artist',
    },
    artistpic: {
        name: 'artistpic',
        argumentName: 'artist-name',
        argumentDescription: 'the name of the album being searched for',
        description: 'gets an image of a given artist',
    },
};
