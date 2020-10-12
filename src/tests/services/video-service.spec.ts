import { RequestService } from '../../services/request-service';
import { VideoService } from '../../services/video-service';
import { YoutubeVideo } from '../../models/youtube-video';

const videoService = new VideoService();
const testString = 'test';
const testVideo = 'catalyst';

describe('Video Service videos', () => {
  it('Can return a video from the api', async () => {
    jest.spyOn(RequestService.prototype, 'get').mockReturnValueOnce(
      new Promise<string>(resolve => {
        const video: YoutubeVideo = { items: [{ id: { videoId: testString } }] };
        resolve(JSON.stringify(video));
      }),
    );
    const video = videoService.getVideo(testVideo);
    await expect(video).resolves.not.toThrowError();
    expect(RequestService.prototype.get).toHaveBeenCalledTimes(1);
    expect(await video).toContain(testString);
  });

  it('Throws error if retrieving a video fails', async () => {
    jest.spyOn(RequestService.prototype, 'get').mockReturnValueOnce(
      new Promise<string>(resolve => {
        const video: YoutubeVideo = { items: undefined };
        resolve(JSON.stringify(video));
      }),
    );
    const video = videoService.getVideo(testVideo);
    await expect(video).rejects.toThrowError();
    expect(RequestService.prototype.get).toHaveBeenCalledTimes(1);
  });

  it('Can be created with custom api key', async () => {
    const videoService = new VideoService(testString);
    expect(videoService).toMatchObject(VideoService.prototype);
  });

  it('Throws error if missing the api key', async () => {
    try {
      process.env.YOUTUBE_TOKEN = undefined;
      new VideoService();
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      return;
    }
    fail('An error should have happened');
  });

  it('Throws error if the api key is "undefined"', async () => {
    try {
      new VideoService('undefined');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      return;
    }
    fail('An error should have happened');
  });
});
