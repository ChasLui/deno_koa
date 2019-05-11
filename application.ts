import { serve } from './deps.ts';
import { Context } from './context.ts';
import { Middleware, compose } from './middleware.ts';

export class Application<S extends object = { [key: string]: any }> {
    /**
     * 注册的中间件
     *
     * @private
     * @type {Middleware[]}
     * @memberof Application
     */
    private _middleware: Middleware[] = []
    /**
     * 将状态传递给前端视图的对象。 这可以通过在创建新应用程序时提供通用状态参数来传入。
     *
     * @example
     * const app = new Application<{foo: string}>();
     * @type {S}
     * @memberof Application
     */
    state: S;

    async listen(addr: string): Promise<void> {
        const middleware = compose(this._middleware);
        const server = serve(addr);
        for await(const req of server) {
            const context = new Context(this, req);
            await middleware(context);
            await req.respond(context.response.toServerResponse());
        }
    }
    /**
     * 注册中间件
     * @param middleware 
     */
    use(middleware: Middleware): this {
        this._middleware.push(middleware);
        return this;
    }
}
