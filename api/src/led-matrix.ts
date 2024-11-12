import { ChildProcess, spawn } from "node:child_process";

import {
  IMAGE_VIEWER_BINARY_PATH,
  GPIO_MAPPING,
  PIXEL_MAPPER,
  BRIGHTNESS,
} from "./env.ts";

export default class LedMatrix {
  private childProcess: ChildProcess | null = null;

  public async displayCover(filepath: string) {
    if (this.childProcess) {
      this.childProcess.kill();
    }

    this.childProcess = spawn(IMAGE_VIEWER_BINARY_PATH, [
      `--led-gpio-mapping=${GPIO_MAPPING}`,
      `--led-pixel-mapper=${PIXEL_MAPPER}`,
      `--led-brightness=${BRIGHTNESS}`,
      filepath,
    ]);
  }
}
