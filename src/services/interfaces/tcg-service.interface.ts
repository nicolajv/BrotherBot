interface TcgService {
  getCardImage(search: string): Promise<string>;
}
