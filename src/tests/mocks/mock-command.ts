import { AbstractCommand } from '../../commands/abstracts/abstract-command';
import { CommandResponse } from '../../models/command-response';

export class MockCommand extends AbstractCommand {
  constructor(name?: string, includeHelperText = true) {
    super(
      name ? name : 'test',
      () => {
        return new Promise<CommandResponse>(resolve => {
          resolve(new CommandResponse('description'));
        });
      },
      includeHelperText ? 'helpertext' : undefined,
    );
  }
}
