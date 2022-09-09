import { RemoveCustomCommand } from '../../commands/remove-custom-command';
import { makeDatabaseService } from '../../dependency-injection/dependency-factory';
import { translations } from '../../data/translator';

const databaseService = makeDatabaseService();
jest.spyOn(databaseService, 'delete').mockImplementation(() => {
  return new Promise<void>(resolve => {
    resolve();
  });
});

const testString = 'test';

describe('Remove custom command', () => {
  it('Fails to remove a command with 0 parameters', async () => {
    const removeCustomCommand = new RemoveCustomCommand(databaseService);
    const result = removeCustomCommand.execute();
    expect(result).resolves.not.toThrowError();
    const finalResult = await result;
    expect(finalResult.response[0]).toEqual(translations.notEnoughParamters);
    expect(finalResult.refreshCommands).toEqual(true);
  });

  it('Removes a command with 1 parameter', async () => {
    const removeCustomCommand = new RemoveCustomCommand(databaseService);
    const result = removeCustomCommand.execute([testString]);
    expect(result).resolves.not.toThrowError();
    const finalResult = await result;
    expect(finalResult.response[0]).toEqual(translations.commandRemoved);
    expect(finalResult.refreshCommands).toEqual(true);
  });
});
