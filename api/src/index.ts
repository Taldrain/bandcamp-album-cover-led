import Koa from "koa";
import Router from "@koa/router";

import { PORT } from "./env.ts";
import CoverCache from "./cover-cache.ts";
import LedMatrix from "./led-matrix.ts";

const app = new Koa();
const router = new Router();
const coverCache = new CoverCache();
const ledMatrix = new LedMatrix();

router.get('/cover', async ctx => {
  const queryParams = new URLSearchParams(ctx.querystring);
  const cover = queryParams.get('cover');
  if (cover !== null) {
    const coverPath = await coverCache.getPath(cover);
    await ledMatrix.displayCover(coverPath);
  }
  ctx.status = 200;
});


(async () => {
  app.use(router.routes());
  app.listen(PORT);
  console.log(`Server running on port ${PORT}`);
  await coverCache.init();
})();
