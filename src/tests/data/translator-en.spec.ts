import { englishDictionary } from '../../translations/en';

describe('English translation', () => {
  it('Uses english language', async () => {
    process.env = Object.assign(process.env, { LANGUAGE: 'en' });
    const translations = (await import('../../data/translator')).translations;
    expect(translations.callStarted).toEqual(englishDictionary.callStarted);
  });
});
