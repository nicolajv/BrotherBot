import { danishDictionary } from '../translations/da';
import { englishDictionary } from '../translations/en';

export const translations = {
  callEnded: getTranslation('callEnded'),
  callEndedDuration: getTranslation('callEndedDuration'),
  callStarted: getTranslation('callStarted'),
  cardImageCommandHelp: getTranslation('cardImageCommandHelp'),
  helpCommandText: getTranslation('helpCommandText'),
  topEmotesCommandHelp: getTranslation('topEmotesCommandHelp'),
  videoSearchCommandHelp: getTranslation('videoSearchCommandHelp'),
  //Errors
  databaseError: getTranslation('databaseError'),
  noCallFound: getTranslation('noCallFound'),
  noCardFound: getTranslation('noCardFound'),
  noEmotesFound: getTranslation('noEmotesFound'),
  noMainChannelFound: getTranslation('noMainChannelFound'),
  noSearchString: getTranslation('noSearchString'),
  noServerConnected: getTranslation('noServerConnected'),
  noUsername: getTranslation('noUsername'),
  noVideoFound: getTranslation('noVideoFound'),
};

function getTranslation(key: string): string {
  let dictionary = englishDictionary;
  if (process.env.LANGUAGE === 'da') {
    dictionary = danishDictionary;
  }
  return dictionary[key] ? dictionary[key] : englishDictionary[key];
}
