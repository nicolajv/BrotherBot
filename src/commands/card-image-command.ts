import { translations } from '../data/translator';
import { AbstractWebServiceCommand } from './abstracts/abstract-web-service-command';

export class CardImageCommand extends AbstractWebServiceCommand {
  constructor(tcgService: TcgService) {
    /* istanbul ignore next */
    super('k', tcgService, translations.noCardFound, translations.cardImageCommandHelp);
  }
}
