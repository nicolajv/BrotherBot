export class CommandResponse {
  public response: string;
  public refreshCommands?: boolean;

  constructor(response: string, refreshCommands?: boolean) {
    this.response = response;
    this.refreshCommands = refreshCommands;
  }
}
