export class CommandResponse {
  public response: Array<string>;
  public refreshCommands?: boolean;
  public ephemeral?: boolean;

  constructor(
    response: Array<string>,
    options?: {
      refreshCommands?: boolean;
      ephemeral?: boolean;
    },
  ) {
    this.response = response;
    this.refreshCommands = options?.refreshCommands ? options.refreshCommands : false;
    this.ephemeral = options?.ephemeral ? options.ephemeral : false;
  }
}
