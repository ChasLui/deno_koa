/**
 * 判断是否为 html
 * @param value 
 */
export function isHtml(value: string): boolean {
    return /^\s*<(?:!DOCTYPE|html|body)/i.test(value);
}