import { CardImageCommand } from '../commands/card-image-command';

export default function buildCommands(): Array<Command> {
  const commands: Array<Command> = new Array<Command>();
  commands.push(new CardImageCommand());
  return commands;
}
