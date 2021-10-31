interface WebBasedService {
  get(search: string): Promise<Array<string>>;
}
