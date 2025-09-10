import prom from 'prom-client';
import type { Context } from 'koa';

export default  {
  async find(ctx: Context) {
    if (ctx.request.headers['accept']?.includes('application/json') || false) {
      ctx.response.headers['Content-Type'] = 'application/json';
      ctx.body = await prom.register.getMetricsAsJSON()
      return
    }

    ctx.response.headers['Content-Type'] = prom.register.contentType;
    ctx.body = await prom.register.metrics()
  },
}
