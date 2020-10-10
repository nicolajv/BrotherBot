import { CardImageCommand } from '../commands/card-image-command';
import { Command } from '../commands/abstract-command';

export default function buildCommands(): Array<Command> {
  const commands: Array<Command> = new Array<Command>();
  commands.push(new CardImageCommand());
  return commands;
}
