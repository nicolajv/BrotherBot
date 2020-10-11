import { AbstractCommand } from './abstract-command';
import { errors } from '../data/constants';
import { TcgService } from '../services/tcg-service';

const tcgService = new TcgService();

export class CardImageCommand extends AbstractCommand {
  constructor() {
    super(
      'k',
      async (parameter?: string) => {
        let result: string;
        try {
          if (parameter) {
            result = await tcgService.getCardImage(parameter);
          } else {
            throw new Error(errors.noSearchString);
          }
        } catch (err) {
          result = errors.noCardFound;
        }
        return result;
      },
      'Searches for trading cards',
    );
  }
}
