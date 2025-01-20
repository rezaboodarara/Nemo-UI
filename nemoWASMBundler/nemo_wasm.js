import * as wasm from "./nemo_wasm_bg.wasm";
export * from "./nemo_wasm_bg.js";
import { __wbg_set_wasm } from "./nemo_wasm_bg.js";
__wbg_set_wasm(wasm);
wasm.__wbindgen_start();
