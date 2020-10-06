const message = 'No Discord token set';
const name = 'NoDiscordTokenSetException';

export class NoDiscordTokenSetException extends Error {
  /* istanbul ignore next */
  constructor() {
    super(message);
    this.name = name;
  }
}
