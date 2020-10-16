import { Moment } from 'moment';
import { User } from './user';
import moment = require('moment');

export class Call {
  public readonly id: string;
  private users = Array<User>();
  private readonly startTime: Moment;

  constructor(id: string) {
    this.id = id;
    this.startTime = moment();
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
    const now = moment();
    const diff = now.diff(this.startTime);
    return moment.utc(diff).format('H:m:s');
  }
}
