import { AbstractCommand } from './abstracts/abstract-command';
import { CommandResponse } from '../models/command-response';

export class VersionCommand extends AbstractCommand {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  private package_json = require('../../package.json');

  constructor() {
    super(
      'version',
      async () => {
        return new Promise<CommandResponse>(resolve => {
          resolve(new CommandResponse([`${this.package_json.version}`]));
        });
      },
      undefined,
      { adminOnly: true, ephemeral: true },
    );
  }
}
