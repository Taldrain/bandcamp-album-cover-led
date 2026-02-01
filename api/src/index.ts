import Koa from "koa";
import Router from "@koa/router";

import { PORT } from "./env.ts";
import CoverCache from "./cover-cache.ts";
import LedMatrix from "./led-matrix.ts";
import {
  validateImageBuffer,
  generateSafeFilename,
  getImageExtension,
  ImageValidationError
} from "./image-validator.ts";

const app = new Koa();
const router = new Router();
const coverCache = new CoverCache();
const ledMatrix = new LedMatrix();

// Middleware to parse raw binary data for POST /cover endpoint
async function parseRawBody(ctx: Koa.Context, next: Koa.Next) {
  if (ctx.method === 'POST' && ctx.path === '/cover') {
    const chunks: Buffer[] = [];

    return new Promise<void>((resolve, reject) => {
      ctx.req.on('data', (chunk: Buffer) => {
        chunks.push(chunk);
      });

      ctx.req.on('end', () => {
        ctx.state.rawBody = Buffer.concat(chunks);
        resolve();
      });

      ctx.req.on('error', (err) => {
        reject(err);
      });
    }).then(() => next());
  }

  return next();
}

app.use(parseRawBody);

router.get('/cover', async ctx => {
  const queryParams = new URLSearchParams(ctx.querystring);
  const url = queryParams.get('url');
  if (url !== null) {
    const coverPath = await coverCache.getPath(url);
    await ledMatrix.displayCover(coverPath);
  }
  ctx.status = 200;
});

router.post('/cover', async ctx => {
  try {
    const buffer = ctx.state.rawBody as Buffer;

    if (!Buffer.isBuffer(buffer)) {
      ctx.status = 400;
      ctx.body = { error: 'Invalid request body. Expected binary image data.' };
      return;
    }

    // Validate the image buffer
    await validateImageBuffer(buffer);

    // Get the image extension and generate a safe filename
    const extension = await getImageExtension(buffer);
    const filename = generateSafeFilename(extension);

    // Save the image to cache
    const coverPath = await coverCache.saveBinaryImage(filename, buffer);

    // Display on LED matrix
    await ledMatrix.displayCover(coverPath);

    ctx.status = 200;
    ctx.body = {
      success: true,
      message: 'Image uploaded and displayed successfully',
      filename
    };
  } catch (error) {
    if (error instanceof ImageValidationError) {
      ctx.status = 400;
      ctx.body = { error: error.message };
    } else {
      console.error('Error processing image upload:', error);
      ctx.status = 500;
      ctx.body = { error: 'Internal server error while processing image' };
    }
  }
});

router.get('/clear', async ctx => {
  ledMatrix.clear();
  ctx.status = 200;
});


(async () => {
  app.use(router.routes());
  app.listen(PORT);
  console.log(`Server running on port ${PORT}`);
  await coverCache.init();
})();
