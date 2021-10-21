import { AbstractCommand } from './abstracts/abstract-command';
import { CommandResponse } from '../models/command-response';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const package_json = require('../../package.json');

export class VersionCommand extends AbstractCommand {
  constructor() {
    super(
      'v',
      async () => {
        return new Promise<CommandResponse>(resolve => {
          resolve(new CommandResponse([`${package_json.version}`]));
        });
      },
      undefined,
      true,
    );
  }
}
