import { User } from './user';

export class Call {
  public readonly id: string;
  private users = Array<User>();

  constructor(id: string) {
    this.id = id;
  }

  addUser(user: User): number {
    if (
      !this.users.find(callUser => {
        return callUser.userId === user.userId;
      })
    ) {
      this.users.push(new User(user.userId, user.userName));
    }
    return this.users.length;
  }

  removeUser(user: User): number {
    this.users = this.users.filter(callUser => {
      return callUser.userId !== user.userId;
    });
    return this.users.length;
  }
}
