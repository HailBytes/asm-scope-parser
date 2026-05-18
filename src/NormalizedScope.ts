import { parseEntry, ipToInt, intToIp } from './parse.js';
import type { ParsedEntry, NormalizedScopeJSON } from './types.js';

/**
 * A parsed and normalized scope with include/exclude entries.
 *
 * @example
 * const scope = new NormalizedScope(['10.0.0.0/8', '*.example.com', '!10.1.2.3']);
 * scope.includes('10.2.3.4');    // true
 * scope.includes('10.1.2.3');    // false (excluded)
 * scope.excludes('10.1.2.3');    // true
 */
export class NormalizedScope {
  private readonly _includes: ParsedEntry[];
  private readonly _excludes: ParsedEntry[];

  constructor(entries: string | string[]) {
    const list = Array.isArray(entries) ? entries : [entries];
    const parsed = list
      .map((e) => e.trim())
      .filter((e) => e.length > 0 && !e.startsWith('#'))
      .map((e) => parseEntry(e));

    this._includes = parsed.filter((e) => !e.exclude);
    this._excludes = parsed.filter((e) => e.exclude);
  }

  /** Returns true if `target` is within scope (matches an include, not matched by any exclude) */
  includes(target: string): boolean {
    const matchesAnyInclude = this._includes.some((e) => this._matches(e, target));
    if (!matchesAnyInclude) return false;
    const matchesAnyExclude = this._excludes.some((e) => this._matches(e, target));
    return !matchesAnyExclude;
  }

  /** Returns true if `target` is explicitly excluded */
  excludes(target: string): boolean {
    return this._excludes.some((e) => this._matches(e, target));
  }

  /** Returns all include entries as CIDR strings (IPv4 only; domains returned as-is) */
  toCIDR(): string[] {
    return this._includes.map((e) => {
      if (e.kind === 'cidr') {
        return `${intToIp(e.networkInt!)}/${e.prefixLen}`;
      }
      if (e.kind === 'ipv4') {
        return `${intToIp(e.networkInt!)}/32`;
      }
      // domains returned as-is
      return e.raw;
    });
  }

  /** Serialize scope to a plain JSON-compatible object */
  toJSON(): NormalizedScopeJSON {
    return {
      includes: this._includes.map((e) => e.raw),
      excludes: this._excludes.map((e) => e.raw.slice(1).trim()),
    };
  }

  // --- private matching logic ---

  private _matches(entry: ParsedEntry, target: string): boolean {
    const trimmed = target.trim();

    if (entry.kind === 'ipv4' || entry.kind === 'cidr') {
      return this._matchesIP(entry, trimmed);
    }
    if (entry.kind === 'domain' || entry.kind === 'wildcard-domain') {
      return this._matchesDomain(entry, trimmed);
    }
    return false;
  }

  private _matchesIP(entry: ParsedEntry, target: string): boolean {
    let targetInt: number;
    try {
      // Accept plain IP or CIDR target
      const ipPart = target.includes('/') ? target.split('/')[0] : target;
      targetInt = ipToInt(ipPart);
    } catch {
      return false;
    }

    if (entry.kind === 'ipv4') {
      return targetInt === entry.networkInt;
    }
    // CIDR containment
    if (entry.kind === 'cidr') {
      return (targetInt & entry.maskInt!) >>> 0 === entry.networkInt!;
    }
    return false;
  }

  private _matchesDomain(entry: ParsedEntry, target: string): boolean {
    let targetDomain: string;
    try {
      // Accept bare domain or URL
      if (target.startsWith('http://') || target.startsWith('https://')) {
        targetDomain = new URL(target).hostname.toLowerCase();
      } else {
        targetDomain = target.toLowerCase();
      }
    } catch {
      return false;
    }

    if (entry.kind === 'domain') {
      return targetDomain === entry.domain;
    }
    if (entry.kind === 'wildcard-domain') {
      // *.example.com matches sub.example.com and example.com itself
      return (
        targetDomain === entry.domain ||
        targetDomain.endsWith('.' + entry.domain!)
      );
    }
    return false;
  }
}
