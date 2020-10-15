import { AbstractCommand } from '../../commands/abstracts/abstract-command';

export class MockCommand extends AbstractCommand {
  constructor(name?: string, includeHelperText = true) {
    super(
      name ? name : 'test',
      () => {
        return new Promise<string>(resolve => {
          resolve('description');
        });
      },
      includeHelperText ? 'helpertext' : undefined,
    );
  }
}
