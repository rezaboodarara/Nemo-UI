let wasm;
export function __wbg_set_wasm(val) {
    wasm = val;
}


const lTextDecoder = typeof TextDecoder === 'undefined' ? (0, module.require)('util').TextDecoder : TextDecoder;

let cachedTextDecoder = new lTextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachedUint8ArrayMemory0 = null;

function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

let WASM_VECTOR_LEN = 0;

const lTextEncoder = typeof TextEncoder === 'undefined' ? (0, module.require)('util').TextEncoder : TextEncoder;

let cachedTextEncoder = new lTextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

let cachedDataViewMemory0 = null;

function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

const CLOSURE_DTORS = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(state => {
    wasm.__wbindgen_export_3.get(state.dtor)(state.a, state.b)
});

function makeMutClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {
        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
            return f(a, state.b, ...args);
        } finally {
            if (--state.cnt === 0) {
                wasm.__wbindgen_export_3.get(state.dtor)(a, state.b);
                CLOSURE_DTORS.unregister(state);
            } else {
                state.a = a;
            }
        }
    };
    real.original = state;
    CLOSURE_DTORS.register(real, state, state);
    return real;
}
function __wbg_adapter_30(arg0, arg1, arg2) {
    wasm.closure3327_externref_shim(arg0, arg1, arg2);
}

function takeFromExternrefTable0(idx) {
    const value = wasm.__wbindgen_export_2.get(idx);
    wasm.__externref_table_dealloc(idx);
    return value;
}

function getArrayJsValueFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    const mem = getDataViewMemory0();
    const result = [];
    for (let i = ptr; i < ptr + 4 * len; i += 4) {
        result.push(wasm.__wbindgen_export_2.get(mem.getUint32(i, true)));
    }
    wasm.__externref_drop_slice(ptr, len);
    return result;
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
    return instance.ptr;
}

export function setPanicHook() {
    wasm.setPanicHook();
}

export function setAllocErrorHook() {
    wasm.setAllocErrorHook();
}

/**
 * @returns {string | undefined}
 */
export function getNemoVersion() {
    const ret = wasm.getNemoVersion();
    let v1;
    if (ret[0] !== 0) {
        v1 = getStringFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
    }
    return v1;
}

/**
 * Creates a Nemo language server
 * The server is split up into mutliple parts to allow concurrent sending/waiting for server/client-bound requests/responses.
 * To enable this with `wasm_bindgen`, multiple structs are required to ensure exclusive access, see https://stackoverflow.com/questions/75712197/rust-wasm-bindgen-recursive-use-of-an-object-detected-which-would-lead-to-unsaf#77013978 .
 * @returns {any}
 */
export function createNemoLanguageServer() {
    const ret = wasm.createNemoLanguageServer();
    return ret;
}

function notDefined(what) { return () => { throw new Error(`${what} is not defined`); }; }

function addToExternrefTable0(obj) {
    const idx = wasm.__externref_table_alloc();
    wasm.__wbindgen_export_2.set(idx, obj);
    return idx;
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        const idx = addToExternrefTable0(e);
        wasm.__wbindgen_exn_store(idx);
    }
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}
function __wbg_adapter_111(arg0, arg1, arg2, arg3) {
    wasm.closure3382_externref_shim(arg0, arg1, arg2, arg3);
}

const __wbindgen_enum_RequestCredentials = ["omit", "same-origin", "include"];

const __wbindgen_enum_RequestMode = ["same-origin", "no-cors", "cors", "navigate"];

const NemoEngineFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_nemoengine_free(ptr >>> 0, 1));

export class NemoEngine {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        NemoEngineFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_nemoengine_free(ptr, 0);
    }
    /**
     * @param {NemoProgram} program
     * @param {any} resource_blobs_js_value
     */
    constructor(program, resource_blobs_js_value) {
        _assertClass(program, NemoProgram);
        const ret = wasm.nemoengine_new(program.__wbg_ptr, resource_blobs_js_value);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        NemoEngineFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    reason() {
        const ret = wasm.nemoengine_reason(this.__wbg_ptr);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @returns {number}
     */
    countFactsOfDerivedPredicates() {
        const ret = wasm.nemoengine_countFactsOfDerivedPredicates(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @param {string} predicate
     * @returns {number | undefined}
     */
    countFactsOfPredicate(predicate) {
        const ptr0 = passStringToWasm0(predicate, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.nemoengine_countFactsOfPredicate(this.__wbg_ptr, ptr0, len0);
        return ret[0] === 0 ? undefined : ret[1] >>> 0;
    }
    /**
     * @param {string} predicate
     * @returns {NemoResults}
     */
    getResult(predicate) {
        const ptr0 = passStringToWasm0(predicate, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.nemoengine_getResult(this.__wbg_ptr, ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return NemoResults.__wrap(ret[0]);
    }
    /**
     * @param {string} predicate
     * @param {FileSystemSyncAccessHandle} sync_access_handle
     */
    savePredicate(predicate, sync_access_handle) {
        const ptr0 = passStringToWasm0(predicate, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.nemoengine_savePredicate(this.__wbg_ptr, ptr0, len0, sync_access_handle);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @param {string} predicate
     * @param {number} row_index
     * @returns {string | undefined}
     */
    traceFactAtIndexAscii(predicate, row_index) {
        const ptr0 = passStringToWasm0(predicate, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.nemoengine_traceFactAtIndexAscii(this.__wbg_ptr, ptr0, len0, row_index);
        if (ret[3]) {
            throw takeFromExternrefTable0(ret[2]);
        }
        let v2;
        if (ret[0] !== 0) {
            v2 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v2;
    }
    /**
     * @param {string} predicate
     * @param {number} row_index
     * @returns {string | undefined}
     */
    traceFactAtIndexGraphMlTree(predicate, row_index) {
        const ptr0 = passStringToWasm0(predicate, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.nemoengine_traceFactAtIndexGraphMlTree(this.__wbg_ptr, ptr0, len0, row_index);
        if (ret[3]) {
            throw takeFromExternrefTable0(ret[2]);
        }
        let v2;
        if (ret[0] !== 0) {
            v2 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v2;
    }
    /**
     * @param {string} predicate
     * @param {number} row_index
     * @returns {string | undefined}
     */
    traceFactAtIndexGraphMlDag(predicate, row_index) {
        const ptr0 = passStringToWasm0(predicate, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.nemoengine_traceFactAtIndexGraphMlDag(this.__wbg_ptr, ptr0, len0, row_index);
        if (ret[3]) {
            throw takeFromExternrefTable0(ret[2]);
        }
        let v2;
        if (ret[0] !== 0) {
            v2 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v2;
    }
    /**
     * @param {string} fact
     * @returns {string | undefined}
     */
    parseAndTraceFactAscii(fact) {
        const ptr0 = passStringToWasm0(fact, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.nemoengine_parseAndTraceFactAscii(this.__wbg_ptr, ptr0, len0);
        if (ret[3]) {
            throw takeFromExternrefTable0(ret[2]);
        }
        let v2;
        if (ret[0] !== 0) {
            v2 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v2;
    }
    /**
     * @param {string} fact
     * @returns {string | undefined}
     */
    parseAndTraceFactGraphMlTree(fact) {
        const ptr0 = passStringToWasm0(fact, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.nemoengine_parseAndTraceFactGraphMlTree(this.__wbg_ptr, ptr0, len0);
        if (ret[3]) {
            throw takeFromExternrefTable0(ret[2]);
        }
        let v2;
        if (ret[0] !== 0) {
            v2 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v2;
    }
    /**
     * @param {string} fact
     * @returns {string | undefined}
     */
    parseAndTraceFactGraphMlDag(fact) {
        const ptr0 = passStringToWasm0(fact, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.nemoengine_parseAndTraceFactGraphMlDag(this.__wbg_ptr, ptr0, len0);
        if (ret[3]) {
            throw takeFromExternrefTable0(ret[2]);
        }
        let v2;
        if (ret[0] !== 0) {
            v2 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v2;
    }
}

const NemoErrorFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_nemoerror_free(ptr >>> 0, 1));

export class NemoError {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(NemoError.prototype);
        obj.__wbg_ptr = ptr;
        NemoErrorFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        NemoErrorFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_nemoerror_free(ptr, 0);
    }
    /**
     * @returns {string}
     */
    toString() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.nemoerror_toString(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}

const NemoLspChannelClientInitiatedFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_nemolspchannelclientinitiated_free(ptr >>> 0, 1));
/**
 * Handles requests initiated by the client and the corresponding responses
 */
export class NemoLspChannelClientInitiated {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(NemoLspChannelClientInitiated.prototype);
        obj.__wbg_ptr = ptr;
        NemoLspChannelClientInitiatedFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        NemoLspChannelClientInitiatedFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_nemolspchannelclientinitiated_free(ptr, 0);
    }
    /**
     * @param {any} request_json_object
     * @returns {Promise<any>}
     */
    sendRequest(request_json_object) {
        const ret = wasm.nemolspchannelclientinitiated_sendRequest(this.__wbg_ptr, request_json_object);
        return ret;
    }
}

const NemoLspRequestsServerInitiatedFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_nemolsprequestsserverinitiated_free(ptr >>> 0, 1));
/**
 * Handles requests initiated by the server
 */
export class NemoLspRequestsServerInitiated {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(NemoLspRequestsServerInitiated.prototype);
        obj.__wbg_ptr = ptr;
        NemoLspRequestsServerInitiatedFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        NemoLspRequestsServerInitiatedFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_nemolsprequestsserverinitiated_free(ptr, 0);
    }
    /**
     * @returns {Promise<any>}
     */
    getNextRequest() {
        const ret = wasm.nemolsprequestsserverinitiated_getNextRequest(this.__wbg_ptr);
        return ret;
    }
}

const NemoLspResponsesServerInitiatedFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_nemolspresponsesserverinitiated_free(ptr >>> 0, 1));
/**
 * Handles responses corresponding to requests initiated by the server
 */
export class NemoLspResponsesServerInitiated {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(NemoLspResponsesServerInitiated.prototype);
        obj.__wbg_ptr = ptr;
        NemoLspResponsesServerInitiatedFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        NemoLspResponsesServerInitiatedFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_nemolspresponsesserverinitiated_free(ptr, 0);
    }
    /**
     * Only one response may be sent at a time, wait for the promise to resolve before sending the next response
     * @param {any} response_json_object
     * @returns {Promise<void>}
     */
    sendResponse(response_json_object) {
        const ret = wasm.nemolspresponsesserverinitiated_sendResponse(this.__wbg_ptr, response_json_object);
        return ret;
    }
}

const NemoProgramFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_nemoprogram_free(ptr >>> 0, 1));

export class NemoProgram {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        NemoProgramFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_nemoprogram_free(ptr, 0);
    }
    /**
     * @param {string} input
     */
    constructor(input) {
        const ptr0 = passStringToWasm0(input, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.nemoprogram_new(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        NemoProgramFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Get all resources that are referenced in import directives of the program.
     * Returns an error if there are problems in some import directive.
     *
     * TODO: Maybe rethink the validation mechanism of NemoProgram. We could also
     * just make sure that things validate upon creation, and make sure that problems
     * are detected early.
     * @returns {(NemoResource)[]}
     */
    getResourcesUsedInImports() {
        const ret = wasm.nemoprogram_getResourcesUsedInImports(this.__wbg_ptr);
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    markDefaultOutputs() {
        wasm.nemoprogram_markDefaultOutputs(this.__wbg_ptr);
    }
    /**
     * @returns {Array<any>}
     */
    getOutputPredicates() {
        const ret = wasm.nemoprogram_getOutputPredicates(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {Set<any>}
     */
    getEDBPredicates() {
        const ret = wasm.nemoprogram_getEDBPredicates(this.__wbg_ptr);
        return ret;
    }
}

const NemoResourceFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_nemoresource_free(ptr >>> 0, 1));

export class NemoResource {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(NemoResource.prototype);
        obj.__wbg_ptr = ptr;
        NemoResourceFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        NemoResourceFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_nemoresource_free(ptr, 0);
    }
    /**
     * @returns {string}
     */
    accept() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.nemoresource_accept(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    url() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.nemoresource_url(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}

const NemoResultsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_nemoresults_free(ptr >>> 0, 1));

export class NemoResults {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(NemoResults.prototype);
        obj.__wbg_ptr = ptr;
        NemoResultsFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        NemoResultsFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_nemoresults_free(ptr, 0);
    }
    /**
     * @returns {NemoResultsIteratorNext}
     */
    next() {
        const ret = wasm.nemoresults_next(this.__wbg_ptr);
        return NemoResultsIteratorNext.__wrap(ret);
    }
}

const NemoResultsIteratorNextFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_nemoresultsiteratornext_free(ptr >>> 0, 1));

export class NemoResultsIteratorNext {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(NemoResultsIteratorNext.prototype);
        obj.__wbg_ptr = ptr;
        NemoResultsIteratorNextFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        NemoResultsIteratorNextFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_nemoresultsiteratornext_free(ptr, 0);
    }
    /**
     * @returns {boolean}
     */
    get done() {
        const ret = wasm.__wbg_get_nemoresultsiteratornext_done(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @param {boolean} arg0
     */
    set done(arg0) {
        wasm.__wbg_set_nemoresultsiteratornext_done(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {any}
     */
    get value() {
        const ret = wasm.__wbg_get_nemoresultsiteratornext_value(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {any} arg0
     */
    set value(arg0) {
        wasm.__wbg_set_nemoresultsiteratornext_value(this.__wbg_ptr, arg0);
    }
}

export function __wbg_nemoerror_new(arg0) {
    const ret = NemoError.__wrap(arg0);
    return ret;
};

export function __wbg_nemolspchannelclientinitiated_new(arg0) {
    const ret = NemoLspChannelClientInitiated.__wrap(arg0);
    return ret;
};

export function __wbindgen_string_new(arg0, arg1) {
    const ret = getStringFromWasm0(arg0, arg1);
    return ret;
};

export function __wbindgen_number_new(arg0) {
    const ret = arg0;
    return ret;
};

export function __wbindgen_bigint_from_u64(arg0) {
    const ret = BigInt.asUintN(64, arg0);
    return ret;
};

export function __wbindgen_bigint_from_i64(arg0) {
    const ret = arg0;
    return ret;
};

export function __wbindgen_string_get(arg0, arg1) {
    const obj = arg1;
    const ret = typeof(obj) === 'string' ? obj : undefined;
    var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

export function __wbg_nemolsprequestsserverinitiated_new(arg0) {
    const ret = NemoLspRequestsServerInitiated.__wrap(arg0);
    return ret;
};

export function __wbg_nemolspresponsesserverinitiated_new(arg0) {
    const ret = NemoLspResponsesServerInitiated.__wrap(arg0);
    return ret;
};

export function __wbg_nemoresource_new(arg0) {
    const ret = NemoResource.__wrap(arg0);
    return ret;
};

export function __wbindgen_is_undefined(arg0) {
    const ret = arg0 === undefined;
    return ret;
};

export function __wbg_new_abda76e883ba8a5f() {
    const ret = new Error();
    return ret;
};

export function __wbg_stack_658279fe44541cf6(arg0, arg1) {
    const ret = arg1.stack;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

export function __wbg_error_f851667af71bcfc6(arg0, arg1) {
    let deferred0_0;
    let deferred0_1;
    try {
        deferred0_0 = arg0;
        deferred0_1 = arg1;
        console.error(getStringFromWasm0(arg0, arg1));
    } finally {
        wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
    }
};

export function __wbindgen_is_function(arg0) {
    const ret = typeof(arg0) === 'function';
    return ret;
};

export function __wbg_queueMicrotask_848aa4969108a57e(arg0) {
    const ret = arg0.queueMicrotask;
    return ret;
};

export function __wbindgen_cb_drop(arg0) {
    const obj = arg0.original;
    if (obj.cnt-- == 1) {
        obj.a = 0;
        return true;
    }
    const ret = false;
    return ret;
};

export const __wbg_queueMicrotask_c5419c06eab41e73 = typeof queueMicrotask == 'function' ? queueMicrotask : notDefined('queueMicrotask');

export function __wbg_flush_3b01da1ee0aae649() { return handleError(function (arg0) {
    arg0.flush();
}, arguments) };

export function __wbg_write_2e67906f4fe33f04() { return handleError(function (arg0, arg1, arg2) {
    const ret = arg0.write(getArrayU8FromWasm0(arg1, arg2));
    return ret;
}, arguments) };

export function __wbg_new_5cc405835f95f5bf() { return handleError(function () {
    const ret = new FileReaderSync();
    return ret;
}, arguments) };

export function __wbg_readAsArrayBuffer_604a28a2075911b1() { return handleError(function (arg0, arg1) {
    const ret = arg0.readAsArrayBuffer(arg1);
    return ret;
}, arguments) };

export function __wbg_instanceof_Blob_702ee3ea790162e1(arg0) {
    let result;
    try {
        result = arg0 instanceof Blob;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};

export function __wbg_get_5419cf6b954aa11d(arg0, arg1) {
    const ret = arg0[arg1 >>> 0];
    return ret;
};

export function __wbg_length_f217bbbf7e8e4df4(arg0) {
    const ret = arg0.length;
    return ret;
};

export function __wbg_new_034f913e7636e987() {
    const ret = new Array();
    return ret;
};

export function __wbg_newnoargs_1ede4bf2ebbaaf43(arg0, arg1) {
    const ret = new Function(getStringFromWasm0(arg0, arg1));
    return ret;
};

export function __wbg_get_ef828680c64da212() { return handleError(function (arg0, arg1) {
    const ret = Reflect.get(arg0, arg1);
    return ret;
}, arguments) };

export function __wbg_call_a9ef466721e824f2() { return handleError(function (arg0, arg1) {
    const ret = arg0.call(arg1);
    return ret;
}, arguments) };

export function __wbg_new_be59c40d5ca0f2ed(arg0) {
    const ret = new Set(arg0);
    return ret;
};

export function __wbg_self_bf91bf94d9e04084() { return handleError(function () {
    const ret = self.self;
    return ret;
}, arguments) };

export function __wbg_window_52dd9f07d03fd5f8() { return handleError(function () {
    const ret = window.window;
    return ret;
}, arguments) };

export function __wbg_globalThis_05c129bf37fcf1be() { return handleError(function () {
    const ret = globalThis.globalThis;
    return ret;
}, arguments) };

export function __wbg_global_3eca19bb09e9c484() { return handleError(function () {
    const ret = global.global;
    return ret;
}, arguments) };

export function __wbg_push_36cf4d81d7da33d1(arg0, arg1) {
    const ret = arg0.push(arg1);
    return ret;
};

export function __wbg_call_3bfa248576352471() { return handleError(function (arg0, arg1, arg2) {
    const ret = arg0.call(arg1, arg2);
    return ret;
}, arguments) };

export function __wbg_add_df0212d6cf07e84c(arg0, arg1) {
    const ret = arg0.add(arg1);
    return ret;
};

export function __wbg_new_1073970097e5a420(arg0, arg1) {
    try {
        var state0 = {a: arg0, b: arg1};
        var cb0 = (arg0, arg1) => {
            const a = state0.a;
            state0.a = 0;
            try {
                return __wbg_adapter_111(a, state0.b, arg0, arg1);
            } finally {
                state0.a = a;
            }
        };
        const ret = new Promise(cb0);
        return ret;
    } finally {
        state0.a = state0.b = 0;
    }
};

export function __wbg_resolve_0aad7c1484731c99(arg0) {
    const ret = Promise.resolve(arg0);
    return ret;
};

export function __wbg_then_748f75edfb032440(arg0, arg1) {
    const ret = arg0.then(arg1);
    return ret;
};

export function __wbg_buffer_ccaed51a635d8a2d(arg0) {
    const ret = arg0.buffer;
    return ret;
};

export function __wbg_new_fec2611eb9180f95(arg0) {
    const ret = new Uint8Array(arg0);
    return ret;
};

export function __wbg_set_ec2fcf81bc573fd9(arg0, arg1, arg2) {
    arg0.set(arg1, arg2 >>> 0);
};

export function __wbg_length_9254c4bd3b9f23c4(arg0) {
    const ret = arg0.length;
    return ret;
};

export function __wbg_ownKeys_a3e285adb2ee593a() { return handleError(function (arg0) {
    const ret = Reflect.ownKeys(arg0);
    return ret;
}, arguments) };

export function __wbg_parse_51ee5409072379d3() { return handleError(function (arg0, arg1) {
    const ret = JSON.parse(getStringFromWasm0(arg0, arg1));
    return ret;
}, arguments) };

export function __wbg_stringify_eead5648c09faaf8() { return handleError(function (arg0) {
    const ret = JSON.stringify(arg0);
    return ret;
}, arguments) };

export function __wbindgen_debug_string(arg0, arg1) {
    const ret = debugString(arg1);
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

export function __wbindgen_throw(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};

export function __wbindgen_memory() {
    const ret = wasm.memory;
    return ret;
};

export function __wbindgen_closure_wrapper8501(arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 3328, __wbg_adapter_30);
    return ret;
};

export function __wbindgen_init_externref_table() {
    const table = wasm.__wbindgen_export_2;
    const offset = table.grow(4);
    table.set(0, undefined);
    table.set(offset + 0, undefined);
    table.set(offset + 1, null);
    table.set(offset + 2, true);
    table.set(offset + 3, false);
    ;
};

