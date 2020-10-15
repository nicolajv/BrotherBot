import { Call } from '../models/call';
import { User } from '../models/user';

export class CallState {
  private activeCalls = Array<Call>();

  addUserToCall(callId: string, user: User): number {
    const call = this.startCall(callId);
    call.addUser(user);
    return call.users.length;
  }

  removeUserFromCall(callId: string, user: User): number {
    const call = this.findCallById(callId);
    if (call) {
      call.users = call.users.filter(callUser => {
        return callUser.userId !== user.userId;
      });
      if (!call.users.length) {
        this.endCall(callId);
        return 0;
      }
      return call.users.length;
    } else {
      throw new Error('No call found matching description');
    }
  }

  private endCall(callId: string): void {
    this.activeCalls = this.activeCalls.filter(call => {
      return call.id !== callId;
    });
  }

  private startCall(callId: string): Call {
    let call = this.findCallById(callId);
    if (call) {
      return call;
    }
    call = new Call(callId);
    this.activeCalls.push(new Call(callId));
    return call;
  }

  private findCallById(callId: string): Call | undefined {
    return this.activeCalls.find(call => {
      return call.id === callId;
    });
  }
}
