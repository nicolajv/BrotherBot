import { AbstractWebServiceCommand } from './abstracts/abstract-web-service-command';
import { CommandOption } from './command-option';
import { translations } from '../data/translator';

export class CardImageCommand extends AbstractWebServiceCommand {
  constructor(tcgService: TcgService) {
    /* istanbul ignore next */
    super(
      'k',
      tcgService,
      translations.noCardFound,
      translations.cardImageCommandHelp,
      new Array<CommandOption>(
        new CommandOption(
          translations.cardImagineCommandParam1N,
          translations.cardImagineCommandParam1D,
          true,
        ),
      ),
    );
  }
}
