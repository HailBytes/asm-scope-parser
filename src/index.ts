import { NormalizedScope } from './NormalizedScope.js';

export { NormalizedScope } from './NormalizedScope.js';
export { parseEntry, ipToInt, intToIp, prefixToMask } from './parse.js';
export type { ParsedEntry, EntryKind, NormalizedScopeJSON } from './types.js';

/**
 * Parse a scope definition into a NormalizedScope.
 *
 * @param input - One or more scope entries. Each entry can be:
 *   - IPv4 address: `"10.1.2.3"`
 *   - CIDR block: `"10.0.0.0/8"`
 *   - Domain: `"example.com"`
 *   - Wildcard domain: `"*.example.com"`
 *   - Exclusion (any of the above prefixed with `!`): `"!192.168.1.0/24"`
 *
 * @example
 * const scope = parseScope(['10.0.0.0/8', '*.example.com', '!10.1.2.3']);
 * scope.includes('10.2.3.4');    // true
 * scope.excludes('10.1.2.3');    // true
 * scope.toCIDR();                // ['10.0.0.0/8', '*.example.com']
 * scope.toJSON();                // { includes: [...], excludes: [...] }
 */
export function parseScope(input: string | string[]): NormalizedScope {
  return new NormalizedScope(input);
}
