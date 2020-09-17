import { MessageAttachment } from 'discord.js';
import { getAlbumArt, getAlbumInfo, getStartingPrice } from '../src/spincord';

test("gets the album cover for vulfpeck's the beautiful game", async () => {
    expect.assertions(1);
    const attachment = await getAlbumArt('the beautiful game');
    expect(attachment).toBeInstanceOf(MessageAttachment);
});

test("gets a URL for king gizzard's gumboot soup", async () => {
    expect.assertions(1);
    const url = await getAlbumInfo('gumboot soup');
    expect(url).toBe('https://discogs.com/King-Gizzard-And-The-Lizard-Wizard-Gumboot-Soup/release/11747418');
});

// test("price check pink floyd's the dark side of the moon", async () => {
//     expect.assertions(2);
//     const response = await getStartingPrice('the dark side of the moon');
//     expect(response).toBeTruthy();
// });
