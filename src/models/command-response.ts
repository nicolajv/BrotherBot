export class CommandResponse {
  public response: Array<string>;
  public refreshCommands?: boolean;

  constructor(response: Array<string>, refreshCommands?: boolean) {
    this.response = response;
    this.refreshCommands = refreshCommands;
  }
}
