import { CallState } from '../../helpers/calls-state';
import { User } from '../../models/user';
import { errors } from '../../data/constants';

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
    expect(callState.removeUserFromCall(call1, testUser1)).toEqual(0);
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
});
