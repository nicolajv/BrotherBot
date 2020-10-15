import { User } from './user';

export class Call {
  public id: string;
  public users = Array<User>();

  constructor(id: string) {
    this.id = id;
  }

  addUser(user: User) {
    if (
      this.users.find(callUser => {
        return callUser.userId === user.userId;
      })
    ) {
      return;
    } else {
      this.users.push(new User(user.userId, user.userName));
    }
  }
}
