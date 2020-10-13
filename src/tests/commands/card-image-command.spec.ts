import { CardImageCommand } from '../../commands/card-image-command';
import { ScryfallService } from '../../services/scryfall-service';
import { errors } from '../../data/constants';
import { makeTcgService } from '../../dependency-injection/dependency-factory';

const testString = 'test';

describe('Card Image command', () => {
  it('Can return a card from the api', async () => {
    jest.spyOn(ScryfallService.prototype, 'getCardImage').mockImplementationOnce(() => {
      return new Promise<string>(resolve => {
        resolve(testString);
      });
    });
    const cardImageCommand = new CardImageCommand(makeTcgService());
    expect(cardImageCommand.name.length).toBeGreaterThan(0);
    const result = cardImageCommand.execute(testString);
    await expect(result).resolves.not.toThrowError();
    await expect(result).resolves.toMatch(testString);
    await expect(result).resolves.not.toMatch(errors.noCardFound);
  });

  it('Returns an error message if no parameter is provided', async () => {
    jest.spyOn(ScryfallService.prototype, 'getCardImage').mockImplementationOnce(() => {
      return new Promise<string>(resolve => {
        resolve(testString);
      });
    });
    const cardImageCommand = new CardImageCommand(makeTcgService());
    expect(cardImageCommand.name.length).toBeGreaterThan(0);
    const result = cardImageCommand.execute();
    await expect(result).resolves.not.toThrowError();
    await expect(result).resolves.toMatch(errors.noCardFound);
  });
});
