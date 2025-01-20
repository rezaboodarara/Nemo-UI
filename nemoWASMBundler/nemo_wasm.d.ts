/* tslint:disable */
/* eslint-disable */
export function setPanicHook(): void;
export function setAllocErrorHook(): void;
/**
 * @returns {string | undefined}
 */
export function getNemoVersion(): string | undefined;
/**
 * Creates a Nemo language server
 * The server is split up into mutliple parts to allow concurrent sending/waiting for server/client-bound requests/responses.
 * To enable this with `wasm_bindgen`, multiple structs are required to ensure exclusive access, see https://stackoverflow.com/questions/75712197/rust-wasm-bindgen-recursive-use-of-an-object-detected-which-would-lead-to-unsaf#77013978 .
 * @returns {any}
 */
export function createNemoLanguageServer(): any;
export class NemoEngine {
  free(): void;
  /**
   * @param {NemoProgram} program
   * @param {any} resource_blobs_js_value
   */
  constructor(program: NemoProgram, resource_blobs_js_value: any);
  reason(): void;
  /**
   * @returns {number}
   */
  countFactsOfDerivedPredicates(): number;
  /**
   * @param {string} predicate
   * @returns {number | undefined}
   */
  countFactsOfPredicate(predicate: string): number | undefined;
  /**
   * @param {string} predicate
   * @returns {NemoResults}
   */
  getResult(predicate: string): NemoResults;
  /**
   * @param {string} predicate
   * @param {FileSystemSyncAccessHandle} sync_access_handle
   */
  savePredicate(predicate: string, sync_access_handle: FileSystemSyncAccessHandle): void;
  /**
   * @param {string} predicate
   * @param {number} row_index
   * @returns {string | undefined}
   */
  traceFactAtIndexAscii(predicate: string, row_index: number): string | undefined;
  /**
   * @param {string} predicate
   * @param {number} row_index
   * @returns {string | undefined}
   */
  traceFactAtIndexGraphMlTree(predicate: string, row_index: number): string | undefined;
  /**
   * @param {string} predicate
   * @param {number} row_index
   * @returns {string | undefined}
   */
  traceFactAtIndexGraphMlDag(predicate: string, row_index: number): string | undefined;
  /**
   * @param {string} fact
   * @returns {string | undefined}
   */
  parseAndTraceFactAscii(fact: string): string | undefined;
  /**
   * @param {string} fact
   * @returns {string | undefined}
   */
  parseAndTraceFactGraphMlTree(fact: string): string | undefined;
  /**
   * @param {string} fact
   * @returns {string | undefined}
   */
  parseAndTraceFactGraphMlDag(fact: string): string | undefined;
}
export class NemoError {
  free(): void;
  /**
   * @returns {string}
   */
  toString(): string;
}
/**
 * Handles requests initiated by the client and the corresponding responses
 */
export class NemoLspChannelClientInitiated {
  free(): void;
  /**
   * @param {any} request_json_object
   * @returns {Promise<any>}
   */
  sendRequest(request_json_object: any): Promise<any>;
}
/**
 * Handles requests initiated by the server
 */
export class NemoLspRequestsServerInitiated {
  free(): void;
  /**
   * @returns {Promise<any>}
   */
  getNextRequest(): Promise<any>;
}
/**
 * Handles responses corresponding to requests initiated by the server
 */
export class NemoLspResponsesServerInitiated {
  free(): void;
  /**
   * Only one response may be sent at a time, wait for the promise to resolve before sending the next response
   * @param {any} response_json_object
   * @returns {Promise<void>}
   */
  sendResponse(response_json_object: any): Promise<void>;
}
export class NemoProgram {
  free(): void;
  /**
   * @param {string} input
   */
  constructor(input: string);
  /**
   * Get all resources that are referenced in import directives of the program.
   * Returns an error if there are problems in some import directive.
   *
   * TODO: Maybe rethink the validation mechanism of NemoProgram. We could also
   * just make sure that things validate upon creation, and make sure that problems
   * are detected early.
   * @returns {(NemoResource)[]}
   */
  getResourcesUsedInImports(): (NemoResource)[];
  markDefaultOutputs(): void;
  /**
   * @returns {Array<any>}
   */
  getOutputPredicates(): Array<any>;
  /**
   * @returns {Set<any>}
   */
  getEDBPredicates(): Set<any>;
}
export class NemoResource {
  free(): void;
  /**
   * @returns {string}
   */
  accept(): string;
  /**
   * @returns {string}
   */
  url(): string;
}
export class NemoResults {
  free(): void;
  /**
   * @returns {NemoResultsIteratorNext}
   */
  next(): NemoResultsIteratorNext;
}
export class NemoResultsIteratorNext {
  free(): void;
  done: boolean;
  value: any;
}
