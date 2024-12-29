import { getMiTexWasm } from '../lib';
import type { MiTexWasm } from '../lib/types';

let wasmModule: MiTexWasm | null = null;

self.onmessage = async (e) => {
    try {
        if (!wasmModule) {
            console.log('Initializing WASM module...');
            wasmModule = getMiTexWasm();
            console.log('WASM module methods:', Object.keys(wasmModule));
            // 関数が実際に存在するか確認
            if (typeof wasmModule.convert_math !== 'function') {
                throw new Error('convert_math is not a function');
            }
        }

        const { type, data } = e.data;
        switch (type) {
            case 'single':
                const result = wasmModule.convert_math(data, new Uint8Array());
                self.postMessage({ success: true, result });
                break;
            // ...
        }
    } catch (error) {
        console.error('Worker error:', error);
        self.postMessage({
            success: false,
            error: error instanceof Error ?
                `${error.message} (${typeof wasmModule?.convert_math})` :
                'Unknown error'
        });
    }
};