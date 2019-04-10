import { 
    green,
    cyan,
    bold,
    yellow
 } from 'https://deno.land/x/std@v0.3.4/colors/mod.ts';

 import { Application } from '../mod.ts';
 (async() => {
     const app = new Application();

     // 注册中间件
     app.use(async (ctx, next) => {
         await next();
         const rt = ctx.response.headers.get('X-Response-Time');
         console.log(
             `${green(ctx.request.method)} ${cyan(ctx.request.url)} - ${bold(
                 String(rt)
             )}`
         );
     });
     app.use(async (ctx, next) => {
         const start = Date.now();
         await next();
         const ms = Date.now() - start;
         ctx.response.headers.set('X-Response-Time', `${ms}ms`);
     });
     app.use(ctx => {
         ctx.response.body = 'Hellow World!';
     });

     const address = '0.0.0.0:8000';
     console.log(bold('Start listening on ') + yellow(address));
     await app.listen(address);
     console.log(bold('Finished.'))
 })();