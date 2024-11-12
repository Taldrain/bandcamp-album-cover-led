import { join, basename } from 'node:path';
import { tmpdir } from 'node:os';
import { writeFile, mkdir, access, constants } from 'node:fs/promises';
import { xdgCache } from 'xdg-basedir';

export default class CoverCache {
  private folder = join(xdgCache || tmpdir(), 'bandcamp-cover-album-led');

  public async init() {
    return mkdir(this.folder, { recursive: true });
  }

  private async saveCover(url: string, filepath: string) {
    const response = await fetch(url);
    const buffer = Buffer.from(await response.arrayBuffer());
    return writeFile(filepath, buffer);
  }

  private async localFileExists(filepath: string) {
    try {
      await access(filepath, constants.R_OK);
      return true;
    } catch (error) {
      return false;
    }
  }

  private getFilename(url: string) {
    return basename(url);
  }

  public async getPath(url: string): Promise<string> {
    const filename = this.getFilename(url);
    const filepath = join(this.folder, filename);
    const fileExists = await this.localFileExists(filepath);
    if (!fileExists) {
      await this.saveCover(url, filepath);
    }

    return filepath;
  }
}
