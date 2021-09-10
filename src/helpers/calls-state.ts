import { Call } from '../models/call';
import { User } from '../models/user';

export class CallState {
  private activeCalls = Array<Call>();

  addUserToCall(callId: string, user: User): number {
    const call = this.startCall(callId);
    const usersInCall = call.addUser(user);
    return usersInCall;
  }

  removeUserFromCall(callId: string, user: User): { userCount: number; duration?: string } {
    const call = this.findCallById(callId);
    if (call) {
      const usersInCall = call.removeUser(user);
      if (!usersInCall) {
        const callLength = this.endCall(callId);
        return { userCount: usersInCall, duration: callLength };
      }
      return { userCount: usersInCall };
    } else {
      throw new Error('No call found matching id');
    }
  }

  private endCall(callId: string): string {
    const call = this.findCallById(callId);
    let duration = '0:0:0';
    if (call) {
      duration = call.getDuration();
      this.activeCalls = this.activeCalls.filter(call => {
        return call.id !== callId;
      });
    }
    return duration;
  }

  private startCall(callId: string): Call {
    let call = this.findCallById(callId);
    if (call) {
      return call;
    }
    call = new Call(callId);
    this.activeCalls.push(call);
    return call;
  }

  private findCallById(callId: string): Call | undefined {
    return this.activeCalls.find(call => {
      return call.id === callId;
    });
  }
}
