import {
  makeCardImageCommand,
  makeHelpCommand,
  makeVideoSearchCommand,
} from '../dependency-injection/dependency-factory';

export default function buildCommands(): Array<Command> {
  const commands: Array<Command> = new Array<Command>();
  commands.push(makeCardImageCommand());
  commands.push(makeVideoSearchCommand());
  commands.push(makeHelpCommand(commands));
  return commands;
}
