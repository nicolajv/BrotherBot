interface RequestService {
  get(requestUri: string): Promise<string>;
}
