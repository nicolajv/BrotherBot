import { AbstractWebServiceCommand } from './abstracts/abstract-web-service-command';
import { errors } from '../data/constants';

export class CardImageCommand extends AbstractWebServiceCommand {
  constructor(tcgService: TcgService) {
    /* istanbul ignore next */
    super('k', tcgService, errors.noCardFound, 'Searches for trading cards');
  }
}
