import { Command } from './abstract-command';
import { TcgService } from '../services/tcg-service';

const tcgService = new TcgService();

export class CardImageCommand extends Command {
  constructor() {
    super('k', async (parameter?: string) => {
      let result: string;
      try {
        if (parameter) {
          result = await tcgService.getCardImage(parameter);
        } else {
          throw new Error('No search string provided');
        }
      } catch (err) {
        result = 'No card result found';
      }
      return result;
    });
  }
}
