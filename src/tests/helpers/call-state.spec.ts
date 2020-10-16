import { CallState } from '../../helpers/calls-state';
import { JestHelper } from '../mocks/jest-helper';
import { User } from '../../models/user';
import { errors } from '../../data/constants';

const jestHelper = new JestHelper();

const call1 = 'call1';
const call2 = 'call2';

const testUser1 = new User('1', 'user1');
const testUser2 = new User('2', 'user2');

describe('Call state', () => {
  it('Can add users to a call', () => {
    const callState = new CallState();
    expect(callState.addUserToCall(call1, testUser1)).toEqual(1);
    expect(callState.addUserToCall(call1, testUser2)).toEqual(2);
  });

  it('Does not add the same user to the same call multiple times', () => {
    const callState = new CallState();
    expect(callState.addUserToCall(call1, testUser1)).toEqual(1);
    expect(callState.addUserToCall(call1, testUser1)).toEqual(1);
  });

  it('Can remove users from a call', () => {
    const callState = new CallState();
    expect(callState.addUserToCall(call1, testUser1)).toEqual(1);
    expect(callState.removeUserFromCall(call1, testUser1).userCount).toEqual(0);
  });

  it('Can have multiple calls', () => {
    const callState = new CallState();
    expect(callState.addUserToCall(call1, testUser1)).toEqual(1);
    expect(callState.addUserToCall(call2, testUser1)).toEqual(1);
  });

  it('Can not remove users from non-existent calls', () => {
    const callState = new CallState();
    try {
      callState.removeUserFromCall(call1, testUser1);
    } catch (err) {
      expect(err.message).toEqual(errors.noCallFound);
    }
  });

  it('Returns duration when ending call', () => {
    const callState = new CallState();
    const endCallSpy = jestHelper.mockPrivateFunction(CallState.prototype, 'endCall');
    callState.addUserToCall(call1, testUser1);
    callState.removeUserFromCall(call1, testUser1);
    expect(endCallSpy).toHaveBeenCalledTimes(1);
    expect(endCallSpy.mock.results[0].value).toMatch(/[0-9+]:[0-9+]:[0-9+]/);
  });

  it('Returns default duration when ending call without duration set', () => {
    const callState = new CallState();
    const endCallSpy = jestHelper.mockPrivateFunction(CallState.prototype, 'endCall');
    callState.addUserToCall(call1, testUser1);
    jestHelper.mockPrivateFunction(CallState.prototype, 'findCallById', () => {
      return {
        id: call1,
        removeUser: function (): number {
          return 0;
        },
        getDuration: function (): undefined {
          return undefined;
        },
      };
    });
    callState.removeUserFromCall(call1, testUser1);
    expect(endCallSpy).toHaveBeenCalledTimes(1);
    expect(endCallSpy.mock.results[0].value).toMatch('0:0:0');
  });
});
