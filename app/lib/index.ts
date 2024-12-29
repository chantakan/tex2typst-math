import { convert_math, convert_text } from './wasm/mitex_wasm';
import type { MiTexWasm } from './types';

export function getMiTexWasm(): MiTexWasm {
    return {
        convert_math,
        convert_text
    };
}