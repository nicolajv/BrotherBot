interface RequestService {
  getAsObject<T>(type: T, requestUri: string): Promise<T>;
}
