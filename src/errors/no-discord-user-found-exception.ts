const message = 'No Discord user found';
const name = 'NoDiscordUserFoundException';

export class NoDiscordUserFoundException extends Error {
  /* istanbul ignore next */
  constructor() {
    super(message);
    this.name = name;
  }
}
