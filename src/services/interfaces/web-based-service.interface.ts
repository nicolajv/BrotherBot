interface WebBasedService {
  get(search: string): Promise<string[]>;
}
