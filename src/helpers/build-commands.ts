import { CardImageCommand } from '../commands/card-image-command';
import { HelpCommand } from '../commands/help-command';

export default function buildCommands(): Array<Command> {
  const commands: Array<Command> = new Array<Command>();
  commands.push(new CardImageCommand());
  commands.push(new HelpCommand(commands));
  return commands;
}
