import { ScryfallService } from '../../services/scryfall-service';
import { makeRequestService } from '../../dependency-injection/dependency-factory';

const requestService: RequestService = makeRequestService();
const scryfallService = new ScryfallService(requestService);

const testString = 'test';
const testCard = 'fastbond';

describe('Scryfall Service card images', () => {
  it('Can return a card from the api', async () => {
    jest.spyOn(requestService, 'getAsObject').mockReturnValueOnce(
      new Promise<Record<string, unknown>>(resolve => {
        resolve({
          object: 'list',
          total_cards: 1,
          data: [{ object: 'card', image_uris: { normal: testString } }],
        });
      }),
    );
    const cardImage = scryfallService.get(testCard);
    await expect(cardImage).resolves.not.toThrowError();
    expect(requestService.getAsObject).toHaveBeenCalledTimes(1);
    expect(await cardImage).toEqual(testString);
  });

  it('Throws error when finding non-card object', async () => {
    jest.spyOn(requestService, 'getAsObject').mockReturnValueOnce(
      new Promise<Record<string, unknown>>(resolve => {
        resolve({ object: 'error' });
      }),
    );
    await expect(scryfallService.get(testCard)).rejects.toThrowError();
    expect(requestService.getAsObject).toHaveBeenCalledTimes(1);
  });

  it('Throws error when finding no image uris', async () => {
    jest.spyOn(requestService, 'getAsObject').mockReturnValueOnce(
      new Promise<Record<string, unknown>>(resolve => {
        resolve({
          object: 'list',
          total_cards: 1,
          data: [{ object: 'card', image_uris: {} }],
        });
      }),
    );
    await expect(scryfallService.get(testCard)).rejects.toThrowError();
    expect(requestService.getAsObject).toHaveBeenCalledTimes(1);
  });

  it('Throws error when finding no normal card image', async () => {
    jest.spyOn(requestService, 'getAsObject').mockReturnValueOnce(
      new Promise<Record<string, unknown>>(resolve => {
        resolve({
          object: 'list',
          total_cards: 1,
          data: [{ object: 'card', image_uris: { normal: '' } }],
        });
      }),
    );
    await expect(scryfallService.get(testCard)).rejects.toThrowError();
    expect(requestService.getAsObject).toHaveBeenCalledTimes(1);
  });
});
