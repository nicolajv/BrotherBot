import { DictionarySearchCommand } from '../../commands/dictionary-search-command';
import { translations } from '../../data/translator';
import { makeDictionaryService } from '../../dependency-injection/dependency-factory';

const dictionaryService: DictionaryService = makeDictionaryService();

const testString = '[test]';
const resultString = 'test';

describe('Dictionary Search command', () => {
  it('Can return a definition from the api', async () => {
    jest.spyOn(dictionaryService, 'get').mockImplementationOnce(() => {
      return new Promise<Array<string>>(resolve => {
        resolve([testString]);
      });
    });
    const dictionarySearchCommand = new DictionarySearchCommand(dictionaryService);
    expect(dictionarySearchCommand.name.length).toBeGreaterThan(0);
    const result = dictionarySearchCommand.execute(testString);
    expect(result).resolves.not.toThrowError();
    const finalResult = await result;
    expect(finalResult.response[0]).toMatch(resultString);
    expect(finalResult.response[0]).not.toMatch(translations.noDictionaryEntryFound);
  });

  it('Returns an error message if no parameter is provided', async () => {
    jest.spyOn(dictionaryService, 'get').mockImplementationOnce(() => {
      return new Promise<Array<string>>(resolve => {
        resolve([testString]);
      });
    });
    const dictionarySearchCommand = new DictionarySearchCommand(dictionaryService);
    expect(dictionarySearchCommand.name.length).toBeGreaterThan(0);
    const result = dictionarySearchCommand.execute();
    expect(result).resolves.not.toThrowError();
    const finalResult = await result;
    expect(finalResult.response[0]).toMatch(translations.noDictionaryEntryFound);
  });
});
