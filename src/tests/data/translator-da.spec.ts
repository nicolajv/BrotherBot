import { danishDictionary } from '../../translations/da';
import { englishDictionary } from '../../translations/en';

describe('Danish translation', () => {
  it('Uses danish language', async () => {
    process.env = Object.assign(process.env, { LANGUAGE: 'da' });
    const translations = (await import('../../data/translator')).translations;
    expect(translations.callStarted).toEqual(danishDictionary.callStarted);
  });

  it('Can fall back to english if the string is not found', async () => {
    process.env = Object.assign(process.env, { LANGUAGE: 'da' });
    const translations = (await import('../../data/translator')).translations;
    expect(danishDictionary).not.toHaveProperty('testString');
    expect(translations.testString).toEqual(englishDictionary.testString);
  });
});
