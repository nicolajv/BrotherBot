interface ChatService {
  login(token?: string): Promise<string>;
  logout(): Promise<void>;
  setActivity(): Promise<void>;
}
