import { AbstractWebServiceCommand } from './abstracts/abstract-web-service-command';
import { CommandParameter } from './command-parameter';
import { translations } from '../data/translator';

export class CardImageCommand extends AbstractWebServiceCommand {
  constructor(tcgService: TcgService) {
    /* istanbul ignore next */
    super(
      translations.cardCommand,
      tcgService,
      translations.noCardFound,
      translations.cardImageCommandHelp,
      new Array<CommandParameter>(
        new CommandParameter(
          translations.cardImagineCommandParam1N,
          translations.cardImagineCommandParam1D,
          true,
        ),
      ),
    );
  }
}
