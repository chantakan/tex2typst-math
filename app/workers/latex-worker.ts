import { getMiTexWasm } from '../lib';
import type { MiTexWasm } from '../lib/types';

let wasmModule: MiTexWasm | null = null;

self.onmessage = async (e) => {
    if (!wasmModule) {
        wasmModule = getMiTexWasm();
    }

    const { type, data } = e.data;
    try {
        switch (type) {
            case 'single':
                const result = wasmModule.convert_math(data, new Uint8Array());
                self.postMessage({ success: true, result });
                break;
            case 'batch':
                const startTime = performance.now();
                const results = data.map((formula: string) => {
                    const start = performance.now();
                    const result = wasmModule!.convert_math(formula, new Uint8Array());
                    const end = performance.now();
                    return { formula, result, time: end - start };
                });
                const totalTime = performance.now() - startTime;
                self.postMessage({ success: true, results, totalTime });
                break;
        }
    } catch (error) {
        self.postMessage({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};