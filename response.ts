import { contentType, Status } from './deps.ts';
import { isHtml } from './util.ts';
/**
 * 服务响应对象
 */
interface ServerResponse {
    status?: number,
    headers?: Headers;
    body?:Uint8Array;
}

/**
 * body 类型
 */
const BODY_TYPES = ['string', 'number', 'bigint', 'boolean', 'symbol'];

/**
 * body 编码对象
 */
const encoder = new TextEncoder();

export class Response {
    /**
     * 响应对象 body
     *
     * @type {*}
     * @memberof Response
     */
    body?: any;
    /**
     * 响应头
     */
    headers = new Headers();
    /**
     * 响应状态码
     *
     * @type {Status}
     * @memberof Response
     */
    status?: Status;
    /**
     * 响应对象 mime 类型
     *
     * @type {string}
     * @memberof Response
     */
    type: string;

    toServerResponse(): ServerResponse {
        const body = this._getBody();
        this._setContentType();
        // 如果没有正文且没有内容类型且没有设置长度，则设置内容长度为0
        if(!(
            body ||
            this.headers.has('Content-Type') ||
            this.headers.has('Content-Length')
        )) {
            this.headers.append('Content-Length', '0');
        }
        return {
            status: this.status || (body ? Status.OK : Status.NotFound),
            body,
            headers: this.headers
        }
    }
    /**
     * 获取响应对象
     * @private
     * @memberof Response
     */
    private _getBody(): Uint8Array | undefined {
        const typeofBody = typeof this.body;
        let result: Uint8Array | undefined;
        if (BODY_TYPES.includes(typeofBody)) {
            const bodyText = String(this.body);
            result = encoder.encode(bodyText);
            this.type = this.type || isHtml(bodyText) ? "html" : "text/plain";
        } else if(this.body instanceof Uint8Array) {
            result = this.body;
        } else if(typeofBody === 'object' && this.body !== null) {
            result = encoder.encode(JSON.stringify(this.body));
            this.type = this.type || 'json';
        }
        return result;
    }
    /**
     * 设置响应对象内容类型字段
     * @private
     * @memberof Response
     */
    private _setContentType() {
        if(this.type) {
            const contentTypeString = contentType(this.type);
            if(contentTypeString && !this.headers.has("Content-Type")) {
                this.headers.append("Content-Type", contentTypeString);
            }
        }
    }
}