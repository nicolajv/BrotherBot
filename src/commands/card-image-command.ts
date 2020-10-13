import { AbstractCommand } from './abstract-command';
import { errors } from '../data/constants';

export class CardImageCommand extends AbstractCommand {
  private tcgService: TcgService;

  constructor(tcgService: TcgService) {
    super(
      'k',
      async (parameter?: string) => {
        let result: string;
        try {
          if (parameter) {
            result = await this.tcgService.getCardImage(parameter);
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
    this.tcgService = tcgService;
  }
}
