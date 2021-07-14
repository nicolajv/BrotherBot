import { CustomCommand } from '../commands/custom-command';
import { CommandPrototype } from '../models/command-prototype';

export class CustomCommandHandler {
  private databaseService: DatabaseService;

  constructor(databaseService: DatabaseService) {
    this.databaseService = databaseService;
  }

  public async getCustomCommand(): Promise<Array<CustomCommand>> {
    const databaseCommands = ((await this.databaseService.getAllFromTable(
      'commands',
    )) as unknown) as Array<CommandPrototype>;
    const commands = new Array<CustomCommand>();
    databaseCommands.forEach(command => {
      commands.push(new CustomCommand(command.command, command.output, command.helperText));
    });
    return commands;
  }
}
