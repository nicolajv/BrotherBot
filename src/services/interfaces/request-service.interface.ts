interface RequestService {
  getAsObject(requestUri: string): Promise<Record<string, unknown>>;
}
