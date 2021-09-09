import { AddCustomCommand } from '../../commands/add-custom-command';
import { translations } from '../../data/translator';
import { makeDatabaseService } from '../../dependency-injection/dependency-factory';

const databaseService = makeDatabaseService();
jest.spyOn(databaseService, 'save').mockImplementation(() => {
  return new Promise<void>(resolve => {
    resolve();
  });
});

const testString = 'test';

describe('Help command', () => {
  it('Fails to create a command with 0 parameters', async () => {
    const addCustomCommand = new AddCustomCommand(databaseService);
    const result = addCustomCommand.execute();
    expect(result).resolves.not.toThrowError();
    const finalResult = await result;
    expect(finalResult.response).toEqual(translations.notEnoughParamters);
    expect(finalResult.refreshCommands).toEqual(true);
  });

  it('Fails to create a command with 1 parameter', async () => {
    const addCustomCommand = new AddCustomCommand(databaseService);
    const result = addCustomCommand.execute(`${testString}`);
    expect(result).resolves.not.toThrowError();
    const finalResult = await result;
    expect(finalResult.response).toEqual(translations.notEnoughParamters);
    expect(finalResult.refreshCommands).toEqual(true);
  });

  it('Fails to create a command with 2 parameters', async () => {
    const addCustomCommand = new AddCustomCommand(databaseService);
    const result = addCustomCommand.execute(`${testString}, ${testString}`);
    expect(result).resolves.not.toThrowError();
    const finalResult = await result;
    expect(finalResult.response).toEqual(translations.notEnoughParamters);
    expect(finalResult.refreshCommands).toEqual(true);
  });

  it('Creates a command with 3 parameters', async () => {
    const addCustomCommand = new AddCustomCommand(databaseService);
    const result = addCustomCommand.execute(`${testString}, ${testString}, ${testString}`);
    expect(result).resolves.not.toThrowError();
    const finalResult = await result;
    expect(finalResult.response).toEqual(translations.commandAdded);
    expect(finalResult.refreshCommands).toEqual(true);
  });
});
