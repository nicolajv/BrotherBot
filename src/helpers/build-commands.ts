import { CardImageCommand } from '../commands/card-image-command';
import { HelpCommand } from '../commands/help-command';
import { VideoSearchCommand } from '../commands/video-search-command';

export default function buildCommands(): Array<Command> {
  const commands: Array<Command> = new Array<Command>();
  commands.push(new CardImageCommand());
  commands.push(new VideoSearchCommand());
  commands.push(new HelpCommand(commands));
  return commands;
}
