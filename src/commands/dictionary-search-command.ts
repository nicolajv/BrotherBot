import { AbstractWebServiceCommand } from '../commands/abstracts/abstract-web-service-command';
import { CommandOption } from './command-option';
import { translations } from '../data/translator';

export class DictionarySearchCommand extends AbstractWebServiceCommand {
  constructor(dictionaryService: DictionaryService) {
    /* istanbul ignore next */
    super(
      'd',
      dictionaryService,
      translations.noDictionaryEntryFound,
      translations.dictionarySearchCommandHelp,
      new Array<CommandOption>(
        new CommandOption('definition', 'Definitionen du gerne vil søge efter', true),
      ),
    );
  }
}
