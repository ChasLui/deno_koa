import { Context } from './context.ts';

export interface Middleware {
    (context: Context, next: () => Promise<void>): Promise<void> | void
}

/**
 * 将多个中间件功能合成成一个中间件功能
 * @param middleware 
 */
export function compose(
    middleware: Middleware[]
): (context: Context) => Promise<void> {
    return function (context: Context, next?: () => Promise<void>) {
        let index = -1;
        /**
         * 调度
         * @param i 
         */
        async function dispatch(i: number) {
            if (i <= index) {
                throw new Error('next() called multiple times');
            }
            index = i;
            let fn: Middleware | undefined = middleware[i];
            if (i === middleware.length) {
                fn = next;
            }
            if (!fn) {
                return;
            }
            return fn(context, dispatch.bind(null, i + 1));
        }
        return dispatch(0);
    }
}