import { CommandResponse } from '../models/command-response';
import { AbstractCommand } from './abstracts/abstract-command';

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
