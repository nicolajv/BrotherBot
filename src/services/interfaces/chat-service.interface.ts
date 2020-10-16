interface ChatService {
  login(token?: string): Promise<string>;
  logout(): void;
  setActivity(): Promise<void>;
}
