interface VideoService {
  getVideo(search: string): Promise<string>;
}
