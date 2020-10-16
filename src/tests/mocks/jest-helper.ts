/* eslint-disable */
export class JestHelper {
  public mockPrivateFunction(
    classPrototype: any,
    method: string,
    mockImplementation?: () => any,
  ): jest.SpyInstance {
    if (mockImplementation) {
      return jest.spyOn(classPrototype as any, method).mockImplementationOnce(mockImplementation);
    } else {
      return jest.spyOn(classPrototype as any, method);
    }
  }

  public setPropertyToAnything(newValue: any): any {
    return newValue;
  }
}
