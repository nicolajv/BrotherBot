import { AbstractCommand } from './abstract-command';
import { TcgService } from '../services/tcg-service';
import { errors } from '../data/constants';

const tcgService = new TcgService();

export class CardImageCommand extends AbstractCommand {
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
        result = errors.noCardFound;
      }
      return result;
    });
  }
}
