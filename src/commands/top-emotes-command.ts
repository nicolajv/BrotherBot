import { emotesTable, errors } from '../data/constants';
import { Emote } from '../models/emote';
import { AbstractCommand } from './abstracts/abstract-command';

export class TopEmotesCommand extends AbstractCommand {
  constructor(databaseService: DatabaseService) {
    super(
      'top10',
      async () => {
        let topEmotes = ((await databaseService.getAllFromTable(emotesTable)) as unknown) as Array<
          Emote
        >;
        if (topEmotes.length > 0) {
          topEmotes = topEmotes.sort((a: Emote, b: Emote) => {
            return b['amount'] - a['amount'];
          });
          let i: number;
          let finalString = '';
          for (i = 0; i < topEmotes.length; i++) {
            finalString = `${finalString}${i + 1}. ${topEmotes[i]['name']}\n`;
          }
          return finalString;
        }
        return errors.noEmotesFound;
      },
      'Gets the top emotes for the channel',
    );
  }
}
