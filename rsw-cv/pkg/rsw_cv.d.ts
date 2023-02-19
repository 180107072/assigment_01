/* tslint:disable */
/* eslint-disable */
/**
*
* * This function generates a gaussian kernel using the generate_gaussian_kernel function
* * applies the kernel to each pixel in the input image
* * for each pixel function calculates weighted sum of neighboring pixels using the kernel 
* * rounds the sum to the nearest integer
* * and then writes result to the output 
* 
* @param {string} base64_img
* @returns {string}
*/
export function apply_basic_gaussian(base64_img: string): string;
/**
*
* * This function applies the inversion operation to each pixel in the input image 
* 
* @param {string} base64_img
* @returns {string}
*/
export function apply_invert(base64_img: string): string;
/**
*
* * This function applies the flip operation to each pixel in the input image
* 
* @param {string} base64_img
* @returns {string}
*/
export function apply_flip(base64_img: string): string;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly apply_basic_gaussian: (a: number, b: number, c: number) => void;
  readonly apply_invert: (a: number, b: number, c: number) => void;
  readonly apply_flip: (a: number, b: number, c: number) => void;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_malloc: (a: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number) => number;
  readonly __wbindgen_free: (a: number, b: number) => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {SyncInitInput} module
*
* @returns {InitOutput}
*/
export function initSync(module: SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
