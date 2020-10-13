import { ScryfallCard } from '../../models/scryfall-card';
import { ScryfallService } from '../../services/scryfall-service';
import { makeRequestService } from '../../dependency-injection/dependency-factory';

const requestService: RequestService = makeRequestService();
const scryfallService = new ScryfallService(requestService);
const testString = 'test';
const testCard = 'fastbond';

describe('Scryfall Service card images', () => {
  it('Can return a card from the api', async () => {
    jest.spyOn(requestService, 'get').mockReturnValueOnce(
      new Promise<string>(resolve => {
        const card: ScryfallCard = { object: 'card', image_uris: { normal: testString } };
        resolve(JSON.stringify(card));
      }),
    );
    const cardImage = scryfallService.getCardImage(testCard);
    await expect(cardImage).resolves.not.toThrowError();
    expect(requestService.get).toHaveBeenCalledTimes(1);
    expect(await cardImage).toEqual(testString);
  });

  it('Throws error when finding non-card object', async () => {
    jest.spyOn(requestService, 'get').mockReturnValueOnce(
      new Promise<string>(resolve => {
        const card: ScryfallCard = { object: 'error' };
        resolve(JSON.stringify(card));
      }),
    );
    await expect(scryfallService.getCardImage(testCard)).rejects.toThrowError();
    expect(requestService.get).toHaveBeenCalledTimes(1);
  });

  it('Throws error when finding no image uris', async () => {
    jest.spyOn(requestService, 'get').mockReturnValueOnce(
      new Promise<string>(resolve => {
        const card: ScryfallCard = { object: 'card', image_uris: {} };
        resolve(JSON.stringify(card));
      }),
    );
    await expect(scryfallService.getCardImage(testCard)).rejects.toThrowError();
    expect(requestService.get).toHaveBeenCalledTimes(1);
  });

  it('Throws error when finding no normal card image', async () => {
    jest.spyOn(requestService, 'get').mockReturnValueOnce(
      new Promise<string>(resolve => {
        const card: ScryfallCard = { object: 'card', image_uris: { normal: '' } };
        resolve(JSON.stringify(card));
      }),
    );
    await expect(scryfallService.getCardImage(testCard)).rejects.toThrowError();
    expect(requestService.get).toHaveBeenCalledTimes(1);
  });
});
