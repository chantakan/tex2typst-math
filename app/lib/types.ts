export interface MiTexWasm {
    convert_math: (input: string, spec: Uint8Array) => string;
    convert_text: (input: string, spec: Uint8Array) => string;
}