/* tslint:disable */
/* eslint-disable */
/**
* Converts a LaTeX math equation into a plain text. You can pass an binary
* (rkyv) command specification by `spec` at the same time to customize
* parsing.
* @param {string} input
* @param {Uint8Array} spec
* @returns {string}
*/
export function convert_math(input: string, spec: Uint8Array): string;
/**
* Converts a LaTeX code into a plain text. You can pass an binary (rkyv)
* command specification by `spec` at the same time to customize parsing.
* @param {string} input
* @param {Uint8Array} spec
* @returns {string}
*/
export function convert_text(input: string, spec: Uint8Array): string;
