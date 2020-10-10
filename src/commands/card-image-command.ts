import { Command } from './abstract-command';
import { TcgService } from '../services/tcg-service';

const tcgService = new TcgService();

export class CardImageCommand extends Command {
  constructor() {
    super('k', async (parameter?: string) => {
      if (!parameter) {
        throw new Error('No search string provided');
      }
      return await tcgService.getCardImage(parameter);
    });
  }
}
