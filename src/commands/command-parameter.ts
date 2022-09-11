export class CommandParameter {
  public readonly name: string;
  public readonly description: string;
  public readonly required: boolean;

  constructor(name: string, description: string, required: boolean) {
    this.name = name;
    this.description = description;
    this.required = required;
  }
}
