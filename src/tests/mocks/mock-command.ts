import { AbstractCommand } from '../../commands/abstracts/abstract-command';
import { CommandOption } from '../../commands/command-option';
import { CommandResponse } from '../../models/command-response';

export class MockCommand extends AbstractCommand {
  constructor(
    name?: string,
    includeHelperText = true,
    adminOnly = false,
    commandOption?: Array<CommandOption>,
  ) {
    super(
      name ? name : 'test',
      () => {
        return new Promise<CommandResponse>(resolve => {
          resolve(
            new CommandResponse(['description', 'description2'], {
              refreshCommands: adminOnly,
              ephemeral: adminOnly,
            }),
          );
        });
      },
      includeHelperText ? 'helpertext' : undefined,
      adminOnly,
      commandOption,
    );
  }
}
