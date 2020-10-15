export class User {
  public readonly userId: string;
  public readonly userName: string;

  constructor(userId: string, userName: string) {
    this.userId = userId;
    this.userName = userName;
  }
}
