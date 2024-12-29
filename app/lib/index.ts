import { convert_math, convert_text } from './wasm/mitex_wasm';
import type { MiTexWasm } from './types';

export function getMiTexWasm(): MiTexWasm {
    // 初期化の状態を確認
    if (typeof convert_math !== 'function' || typeof convert_text !== 'function') {
        throw new Error('WASM functions are not properly initialized');
    }

    return {
        convert_math,
        convert_text
    };
}