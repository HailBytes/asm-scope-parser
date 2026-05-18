/** A single parsed scope entry before normalization */
export type EntryKind = 'ipv4' | 'cidr' | 'domain' | 'wildcard-domain';

export interface ParsedEntry {
  raw: string;
  kind: EntryKind;
  /** True if this entry is an exclusion (prefixed with !) */
  exclude: boolean;
  /** For CIDR/IPv4 entries: the network address as a 32-bit integer */
  networkInt?: number;
  /** For CIDR entries: the subnet mask as a 32-bit integer */
  maskInt?: number;
  /** For CIDR entries: the prefix length 0-32 */
  prefixLen?: number;
  /** For domain/wildcard entries: the normalized domain string */
  domain?: string;
  /** True if this is a wildcard (*.example.com) */
  isWildcard?: boolean;
}

export interface NormalizedScopeJSON {
  includes: string[];
  excludes: string[];
}
