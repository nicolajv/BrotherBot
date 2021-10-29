import { translations } from '../data/translator';
import { AbstractWebServiceCommand } from '../commands/abstracts/abstract-web-service-command';

export class DictionarySearchCommand extends AbstractWebServiceCommand {
  constructor(dictionaryService: DictionaryService) {
    /* istanbul ignore next */
    super(
      'd',
      dictionaryService,
      translations.noDictionaryEntryFound,
      translations.dictionarySearchCommandHelp,
    );
  }
}
