import { makeRequestService } from '../../dependency-injection/dependency-factory';
import { UrbanDictionaryService } from '../../services/urban-dictionary-service';

const requestService: RequestService = makeRequestService();
const urbanDictionaryService = new UrbanDictionaryService(requestService);

const testDefinition = 'test';

describe('Urban Dictionary search', () => {
  it('Can return a definition from the api', async () => {
    jest.spyOn(requestService, 'getAsObject').mockReturnValueOnce(
      new Promise<Record<string, unknown>>(resolve => {
        resolve({ list: [{ word: '[word]', definition: '[definition]', example: '[example]' }] });
      }),
    );
    const definition = urbanDictionaryService.get(testDefinition);
    expect(definition).resolves.not.toThrowError();
    expect(requestService.getAsObject).toHaveBeenCalledTimes(1);
    const finalVideo = await definition;
    expect(finalVideo[0]).not.toContain('[word]');
    expect(finalVideo[0]).not.toContain('[definition]');
    expect(finalVideo[0]).not.toContain('[example]');
    expect(finalVideo[0]).toContain('word');
    expect(finalVideo[0]).toContain('definition');
    expect(finalVideo[0]).toContain('example');
  });

  it('Throws error if retrieving a definition fails', async () => {
    jest.spyOn(requestService, 'getAsObject').mockReturnValueOnce(
      new Promise<Record<string, unknown>>(resolve => {
        resolve({ items: undefined });
      }),
    );
    const video = urbanDictionaryService.get(testDefinition);
    expect(video).rejects.toThrowError();
    expect(requestService.getAsObject).toHaveBeenCalledTimes(1);
  });
});
