import { MessageAttachment } from 'discord.js';
import { mocked } from 'ts-jest/utils';

import Discogs, { discogsRootUrl, MarketplaceStats, Result } from '../src/discogs';
import Spincord from '../src/spincord';

// mock dependencies
jest.mock('../src/discogs');
const mockedDiscogs = mocked(Discogs, true);

// tested class
const spincord = new Spincord();

// test data
const mockArtistResult: Result = {
    id: 6394903,
    type: 'artist',
    master_id: null,
    master_url: null,
    uri: '/artist/6394903-Jack-Stauber',
    title: 'Jack Stauber',
    thumb: 'https://i.discogs.com/BNa4X1ZQHr4C9tG0lcmJVfuurVR2ZG8idABgON8fq_4/rs:fit/g:sm/q:40/h:150/w:150/czM6Ly9kaXNjb2dz/LWltYWdlcy9BLTYz/OTQ5MDMtMTYxOTgy/OTA2NC0xNzI0Lmpw/ZWc.jpeg',
    cover_image:
        'https://i.discogs.com/GqXaRGy7mm_lRmvzFKdLTV80OhGHXU0XB0idnCir3C0/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWltYWdlcy9BLTYz/OTQ5MDMtMTYxOTgy/OTA2NC0xNzI0Lmpw/ZWc.jpeg',
    resource_url: 'https://api.discogs.com/artists/6394903',
};
const mockReleaseResult: Result = {
    country: 'Japan',
    year: '1977',
    type: 'release',
    id: 1006498,
    master_id: 567245,
    master_url: 'https://api.discogs.com/masters/567245',
    uri: '/release/1006498-%E5%B1%B1%E4%B8%8B%E9%81%94%E9%83%8E-Spacy',
    title: '山下達郎* - Spacy',
    thumb: 'https://i.discogs.com/iOCloI__juHw6sShBbhetSwo4ZN0HxzaCQJr56E-XSI/rs:fit/g:sm/q:40/h:150/w:150/czM6Ly9kaXNjb2dz/LWltYWdlcy9SLTEw/MDY0OTgtMTUyNjg0/MjQxOC04NDQ0Lmpw/ZWc.jpeg',
    cover_image:
        'https://i.discogs.com/MmD1LbNP2kMkdFZ0XNEwxZIz4yip_lsSY6x07aw6nH4/rs:fit/g:sm/q:90/h:598/w:600/czM6Ly9kaXNjb2dz/LWltYWdlcy9SLTEw/MDY0OTgtMTUyNjg0/MjQxOC04NDQ0Lmpw/ZWc.jpeg',
    resource_url: 'https://api.discogs.com/releases/1006498',
};
const mockMarketStats: MarketplaceStats = {
    num_for_sale: 15,
    lowest_price: { value: 150, currency: 'USD' },
    blocked_from_sale: false,
};

beforeEach(() => {
    mockedDiscogs.prototype.getFirstArtistResult.mockResolvedValue(mockArtistResult);
    mockedDiscogs.prototype.getFirstAlbumResult.mockResolvedValue(mockReleaseResult);
    mockedDiscogs.prototype.getMarketplaceStats.mockResolvedValue(mockMarketStats);
});

test('gets the starting price for a release', async () => {
    expect.assertions(1);

    const response = await spincord.getStartingPrice('spacy');

    expect(response).toContain(
        'Wow! Must be pretty rare. 15 of those are listed for sale right now starting at **$150.00**.',
    );
});

test('gets a URL for a release', async () => {
    expect.assertions(1);

    const response = await spincord.getAlbumInfo('spacy');

    expect(response).toContain(discogsRootUrl.concat('/release/1006498-%E5%B1%B1%E4%B8%8B%E9%81%94%E9%83%8E-Spacy'));
});

test('gets an image attachment for a release', async () => {
    expect.assertions(1);

    const response = await spincord.getAlbumArt('spacy');

    expect(response).toBeInstanceOf(MessageAttachment);
});

test('gets a URL for an artist', async () => {
    expect.assertions(1);

    const response = await spincord.getArtistInfo('jack stauber');

    expect(response).toContain(discogsRootUrl.concat('/artist/6394903-Jack-Stauber'));
});

test('gets an image attachment for an artist', async () => {
    expect.assertions(1);

    const response = await spincord.getAlbumArt('jack stauber');

    expect(response).toBeInstanceOf(MessageAttachment);
});
