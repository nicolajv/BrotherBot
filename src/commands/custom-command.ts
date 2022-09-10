import { AbstractCommand } from './abstracts/abstract-command';
import { CommandResponse } from '../models/command-response';

export class CustomCommand extends AbstractCommand {
  constructor(command: string, output: string, helperText?: string) {
    super(
      command,
      async () => {
        return new CommandResponse([output]);
      },
      helperText,
    );
  }
}
