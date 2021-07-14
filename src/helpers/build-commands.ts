import { Command } from '../commands/interfaces/command.interface';
import {
  makeAddCustomCommand,
  makeCardImageCommand,
  makeHelpCommand,
  makeRemoveCustomCommand,
  makeTopEmotesCommand,
  makeVideoSearchCommand,
  makeCustomCommandHandler,
} from '../dependency-injection/dependency-factory';

export async function buildCommands(): Promise<Array<Command>> {
  const commands: Array<Command> = new Array<Command>();
  commands.push(makeCardImageCommand());
  commands.push(makeVideoSearchCommand());
  commands.push(makeTopEmotesCommand());
  commands.push(makeAddCustomCommand());
  commands.push(makeRemoveCustomCommand());
  const customCommands = await makeCustomCommandHandler().getCustomCommand();
  customCommands.forEach(customCommand => {
    commands.push(customCommand);
  });
  commands.push(makeHelpCommand(commands));
  return commands;
}
