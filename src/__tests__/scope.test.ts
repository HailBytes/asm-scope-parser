import { describe, it, expect } from 'vitest';
import { parseScope } from '../index.js';

describe('parseScope — IP/CIDR', () => {
  it('includes an IP within a CIDR range', () => {
    const scope = parseScope('10.0.0.0/8');
    expect(scope.includes('10.1.2.3')).toBe(true);
    expect(scope.includes('10.255.255.255')).toBe(true);
  });

  it('excludes an IP outside a CIDR range', () => {
    const scope = parseScope('10.0.0.0/8');
    expect(scope.includes('192.168.1.1')).toBe(false);
  });

  it('handles individual IPv4 address', () => {
    const scope = parseScope('10.1.2.3');
    expect(scope.includes('10.1.2.3')).toBe(true);
    expect(scope.includes('10.1.2.4')).toBe(false);
  });

  it('respects exclusions', () => {
    const scope = parseScope(['10.0.0.0/8', '!10.1.2.3']);
    expect(scope.includes('10.0.0.1')).toBe(true);
    expect(scope.includes('10.1.2.3')).toBe(false); // excluded
    expect(scope.excludes('10.1.2.3')).toBe(true);
  });

  it('toCIDR returns CIDR notation', () => {
    const scope = parseScope(['10.0.0.0/8', '192.168.1.1']);
    const cidrs = scope.toCIDR();
    expect(cidrs).toContain('10.0.0.0/8');
    expect(cidrs).toContain('192.168.1.1/32');
  });
});

describe('parseScope — domains', () => {
  it('matches exact domain', () => {
    const scope = parseScope('example.com');
    expect(scope.includes('example.com')).toBe(true);
    expect(scope.includes('other.com')).toBe(false);
  });

  it('wildcard matches subdomains', () => {
    const scope = parseScope('*.example.com');
    expect(scope.includes('sub.example.com')).toBe(true);
    expect(scope.includes('deep.sub.example.com')).toBe(true);
    expect(scope.includes('example.com')).toBe(true); // apex included
    expect(scope.includes('other.com')).toBe(false);
  });

  it('accepts https URLs as targets', () => {
    const scope = parseScope('*.example.com');
    expect(scope.includes('https://api.example.com')).toBe(true);
    expect(scope.includes('https://evil.com')).toBe(false);
  });
});

describe('parseScope — toJSON', () => {
  it('serializes includes and excludes', () => {
    const scope = parseScope(['10.0.0.0/8', '!10.1.2.3', '*.example.com']);
    const json = scope.toJSON();
    expect(json.includes).toEqual(['10.0.0.0/8', '*.example.com']);
    expect(json.excludes).toEqual(['10.1.2.3']);
  });
});

describe('parseScope — edge cases', () => {
  it('handles string input (not array)', () => {
    const scope = parseScope('10.0.0.0/8');
    expect(scope.includes('10.5.5.5')).toBe(true);
  });

  it('ignores empty entries and comment lines', () => {
    const scope = parseScope(['', '  ', '# comment', '10.0.0.0/8']);
    expect(scope.includes('10.1.2.3')).toBe(true);
  });
});
