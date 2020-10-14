import { VideoSearchCommand } from '../../commands/video-search-command';
import { errors } from '../../data/constants';
import { makeVideoService } from '../../dependency-injection/dependency-factory';

const videoService: VideoService = makeVideoService();

const testString = 'test';

describe('Video Search command', () => {
  it('Can return a card from the api', async () => {
    jest.spyOn(videoService, 'get').mockImplementationOnce(() => {
      return new Promise<string>(resolve => {
        resolve(testString);
      });
    });
    const videoSearchCommand = new VideoSearchCommand(videoService);
    expect(videoSearchCommand.name.length).toBeGreaterThan(0);
    const result = videoSearchCommand.execute(testString);
    await expect(result).resolves.not.toThrowError();
    await expect(result).resolves.toMatch(testString);
    await expect(result).resolves.not.toMatch(errors.noVideoFound);
  });

  it('Returns an error message if no parameter is provided', async () => {
    jest.spyOn(videoService, 'get').mockImplementationOnce(() => {
      return new Promise<string>(resolve => {
        resolve(testString);
      });
    });
    const videoSearchCommand = new VideoSearchCommand(videoService);
    expect(videoSearchCommand.name.length).toBeGreaterThan(0);
    const result = videoSearchCommand.execute();
    await expect(result).resolves.not.toThrowError();
    await expect(result).resolves.toMatch(errors.noVideoFound);
  });
});
