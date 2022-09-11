export class CommandResponse {
  public response: Array<string>;
  public refreshCommands?: boolean;

  constructor(
    response: Array<string>,
    options?: {
      refreshCommands?: boolean;
    },
  ) {
    this.response = response;
    this.refreshCommands = options?.refreshCommands ? options.refreshCommands : false;
  }
}
