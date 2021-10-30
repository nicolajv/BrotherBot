import { User } from './user';

export class Call {
  public readonly id: string;
  private users = Array<User>();
  private readonly startDate: Date;

  constructor(id: string) {
    this.id = id;
    this.startDate = new Date();
  }

  public addUser(user: User): number {
    if (
      !this.users.find(callUser => {
        return callUser.userId === user.userId;
      })
    ) {
      this.users.push(new User(user.userId, user.userName));
    }
    return this.users.length;
  }

  public removeUser(user: User): number {
    this.users = this.users.filter(callUser => {
      return callUser.userId !== user.userId;
    });
    return this.users.length;
  }

  public getDuration(): string {
    const endDate = new Date();
    const timeDiff = new Date(endDate.valueOf() - this.startDate.valueOf());
    const hours = timeDiff.getUTCHours();
    const minutes = timeDiff.getUTCMinutes();
    const seconds = timeDiff.getUTCSeconds();
    return `${hours}:${minutes}:${seconds}`;
  }
}
