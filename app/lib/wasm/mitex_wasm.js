import * as wasm from "./mitex_wasm_bg.wasm";
import { __wbg_set_wasm } from "./mitex_wasm_bg.js";
__wbg_set_wasm(wasm);
export * from "./mitex_wasm_bg.js";
