import { makeDatabaseService } from '../../dependency-injection/dependency-factory';
import { CustomCommandHandler } from '../../helpers/custom-command-handler';
import { CommandPrototype } from '../../models/command-prototype';

const databaseService = makeDatabaseService();
jest.spyOn(databaseService, 'getAllFromTable').mockImplementation(() => {
  return new Promise<Array<Record<string, unknown>>>(resolve => {
    const commands = Array<CommandPrototype>();
    commands.push(new CommandPrototype('lol', 'lel', 'help'));
    resolve((commands as unknown) as Array<Record<string, unknown>>);
  });
});

describe('Custom command handler', () => {
  it('Can get custom commands', async () => {
    const commandHandler = new CustomCommandHandler(databaseService);
    const result = commandHandler.getCustomCommands();
    expect(result).resolves.not.toThrowError();
    const finalResult = await result;
    expect(finalResult).toHaveLength(1);
  });
});
