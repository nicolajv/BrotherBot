import { CardImageCommand } from '../../commands/card-image-command';
import { translations } from '../../data/translator';
import { makeTcgService } from '../../dependency-injection/dependency-factory';

const tcgService = makeTcgService();

const testString = 'test';

describe('Card Image command', () => {
  it('Can return a card from the api', async () => {
    jest.spyOn(tcgService, 'get').mockImplementationOnce(() => {
      return new Promise<string[]>(resolve => {
        resolve([testString]);
      });
    });
    const cardImageCommand = new CardImageCommand(tcgService);
    expect(cardImageCommand.name.length).toBeGreaterThan(0);
    const result = cardImageCommand.execute(testString);
    await expect(result).resolves.not.toThrowError();
    const finalResult = await result;
    expect(finalResult.response[0]).toMatch(testString);
    expect(finalResult.response[0]).not.toMatch(translations.noCardFound);
  });

  it('Returns an error message if no parameter is provided', async () => {
    jest.spyOn(tcgService, 'get').mockImplementationOnce(() => {
      return new Promise<string[]>(resolve => {
        resolve([testString]);
      });
    });
    const cardImageCommand = new CardImageCommand(tcgService);
    expect(cardImageCommand.name.length).toBeGreaterThan(0);
    const result = cardImageCommand.execute();
    await expect(result).resolves.not.toThrowError();
    const finalResult = await result;
    expect(finalResult.response[0]).toMatch(translations.noCardFound);
  });
});
