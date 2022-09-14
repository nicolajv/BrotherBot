import { AbstractCommand } from '../../commands/abstracts/abstract-command';
import { CommandParameter } from '../../commands/command-parameter';
import { CommandResponse } from '../../models/command-response';

export class MockCommand extends AbstractCommand {
  constructor(
    name?: string,
    includeHelperText = true,
    adminOnly = false,
    commandParameter?: Array<CommandParameter>,
  ) {
    super(
      name ? name : 'test',
      () => {
        return new Promise<CommandResponse>(resolve => {
          resolve(
            new CommandResponse(['description', 'description2'], {
              refreshCommands: adminOnly,
            }),
          );
        });
      },
      includeHelperText ? 'helpertext' : undefined,
      {
        adminOnly: adminOnly,
        ephemeral: adminOnly,
        parameters: commandParameter,
      },
    );
  }
}
