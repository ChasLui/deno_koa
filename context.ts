import { Application } from './application.ts';
import { ServerRequest } from './deps.ts';
import { Response } from './response.ts';

export class Context<S extends object = { [key: string]: any }> {
    /**
     * 当期应用的引用
     *
     * @type {Application<any>}
     * @memberof Context
     */
    app: Application<any>;
    /**
     * 请求对象
     *
     * @type {*}
     * @memberof Context
     */
    request: any;
    /**
     * 响应对象
     *
     * @type {*}
     * @memberof Context
     */
    response = new Response();
    /**
     * 将状态传递给前端视图的对象。 这可以通过在创建新应用程序时提供通用状态参数来键入。
     *
     * @example
     * const app = new Application<{foo: string}>();
     * @type {S}
     * @memberof Context
     */
    state: S;
    constructor(app: Application<S>, serverRequest: ServerRequest) {
        this.app = app;
        this.state = app.state;
        this.request = serverRequest;
    }
}