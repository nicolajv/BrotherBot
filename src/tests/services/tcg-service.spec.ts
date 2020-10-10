import { Card } from '../../services/models/card';
import { RequestService } from '../../services/request-service';
import { TcgService } from '../../services/tcg-service';

const tcgService = new TcgService();
const testString = 'test';
const testCard = 'fastbond';

describe('Tcg Service card images', () => {
  it('Can return a card from the api', async () => {
    jest.spyOn(RequestService.prototype, 'get').mockReturnValueOnce(
      new Promise<string>(resolve => {
        const card: Card = { object: 'card', image_uris: { normal: testString } };
        resolve(JSON.stringify(card));
      }),
    );
    const cardImage = tcgService.getCardImage(testCard);
    await expect(cardImage).resolves.not.toThrowError();
    expect(RequestService.prototype.get).toHaveBeenCalledTimes(1);
    expect(await cardImage).toEqual(testString);
  });

  it('Throws error when finding non-card object', async () => {
    jest.spyOn(RequestService.prototype, 'get').mockReturnValueOnce(
      new Promise<string>(resolve => {
        const card: Card = { object: 'error' };
        resolve(JSON.stringify(card));
      }),
    );
    await expect(tcgService.getCardImage(testCard)).rejects.toThrowError();
    expect(RequestService.prototype.get).toHaveBeenCalledTimes(1);
  });

  it('Throws error when finding no image uris', async () => {
    jest.spyOn(RequestService.prototype, 'get').mockReturnValueOnce(
      new Promise<string>(resolve => {
        const card: Card = { object: 'card', image_uris: {} };
        resolve(JSON.stringify(card));
      }),
    );
    await expect(tcgService.getCardImage(testCard)).rejects.toThrowError();
    expect(RequestService.prototype.get).toHaveBeenCalledTimes(1);
  });

  it('Throws error when finding no normal card image', async () => {
    jest.spyOn(RequestService.prototype, 'get').mockReturnValueOnce(
      new Promise<string>(resolve => {
        const card: Card = { object: 'card', image_uris: { normal: '' } };
        resolve(JSON.stringify(card));
      }),
    );
    await expect(tcgService.getCardImage(testCard)).rejects.toThrowError();
    expect(RequestService.prototype.get).toHaveBeenCalledTimes(1);
  });
});
