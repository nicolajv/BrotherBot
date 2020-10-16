interface ChatService {
  login(token?: string): void;
  logout(): void;
  setActivity(): Promise<void>;
}
