import { YoutubeVideo } from '../../models/youtube-video';
import { YoutubeVideoService } from '../../services/youtube-video-service';
import { makeRequestService } from '../../dependency-injection/dependency-factory';

const requestService: RequestService = makeRequestService();
const youtubeVideoService = new YoutubeVideoService(requestService);

const testString = 'test';
const testVideo = 'catalyst';

describe('Youtube video search', () => {
  it('Can return a video from the api', async () => {
    jest.spyOn(requestService, 'get').mockReturnValueOnce(
      new Promise<string>(resolve => {
        const video: YoutubeVideo = { items: [{ id: { videoId: testString } }] };
        resolve(JSON.stringify(video));
      }),
    );
    const video = youtubeVideoService.getVideo(testVideo);
    await expect(video).resolves.not.toThrowError();
    expect(requestService.get).toHaveBeenCalledTimes(1);
    expect(await video).toContain(testString);
  });

  it('Throws error if retrieving a video fails', async () => {
    jest.spyOn(requestService, 'get').mockReturnValueOnce(
      new Promise<string>(resolve => {
        const video: YoutubeVideo = { items: undefined };
        resolve(JSON.stringify(video));
      }),
    );
    const video = youtubeVideoService.getVideo(testVideo);
    await expect(video).rejects.toThrowError();
    expect(requestService.get).toHaveBeenCalledTimes(1);
  });

  it('Can be created with custom api key', async () => {
    const videoService = new YoutubeVideoService(requestService, testString);
    expect(videoService).toMatchObject(YoutubeVideoService.prototype);
  });

  it('Throws error if missing the api key', async () => {
    try {
      process.env.YOUTUBE_TOKEN = undefined;
      new YoutubeVideoService(requestService);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      return;
    }
    fail('An error should have happened');
  });

  it('Throws error if the api key is "undefined"', async () => {
    try {
      new YoutubeVideoService(requestService, 'undefined');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      return;
    }
    fail('An error should have happened');
  });
});