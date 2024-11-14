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
  const url = queryParams.get('url');
  if (url !== null) {
    const coverPath = await coverCache.getPath(url);
    await ledMatrix.displayCover(coverPath);
  }
  ctx.status = 200;
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
