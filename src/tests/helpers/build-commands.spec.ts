import { Command } from '../../commands/interfaces/command.interface';
import { buildCommands } from '../../helpers/build-commands';
import { CommandPrototype } from '../../models/command-prototype';
import { MongoDBService } from '../../services/mongo-db-service';
import { JestHelper } from '../mocks/jest-helper';

const jestHelper = new JestHelper();

describe('Build commands', () => {
  it('Can build list of commands', async () => {
    jestHelper.mockPrivateFunction(MongoDBService.prototype, 'getAllFromTable', () => {
      return new Array<CommandPrototype>();
    });
    const commands = await buildCommands();
    expect(typeof commands).toBe(typeof Array<Command>());
    expect(commands.length).toBeGreaterThan(0);
  });
});
