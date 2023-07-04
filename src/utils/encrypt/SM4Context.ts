/**
 * @author lzb
 *
 */
export default class SM4Context {
    mode: number = 1;
    isPadding: boolean = true;
    sk = new Array(32);
}
