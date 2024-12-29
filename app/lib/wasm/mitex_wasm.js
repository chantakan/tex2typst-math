import init from "./mitex_wasm_bg.wasm?init";
import * as bg from "./mitex_wasm_bg.js";

const imports = {
    "./mitex_wasm_bg.js": Object.fromEntries(
        Object.entries(bg).filter(([_, value]) => typeof value === 'function')
    )
};

const instance = await init(imports);
bg.__wbg_set_wasm(instance.exports);  // instance.exports を設定

export * from "./mitex_wasm_bg.js";