export class UserState {
  public readonly userId: string;
  public readonly userName: string;
  public activeVoiceChannel?: string;

  constructor(userId: string, userName: string) {
    this.userId = userId;
    this.userName = userName;
  }
}
