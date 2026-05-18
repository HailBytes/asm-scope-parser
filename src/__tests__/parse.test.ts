import { describe, it, expect } from 'vitest';
import { ipToInt, intToIp, prefixToMask, parseEntry } from '../parse.js';

describe('ipToInt / intToIp', () => {
  it('round-trips correctly', () => {
    const cases = ['0.0.0.0', '10.0.0.1', '192.168.1.255', '255.255.255.255'];
    for (const ip of cases) {
      expect(intToIp(ipToInt(ip))).toBe(ip);
    }
  });

  it('ipToInt produces correct values', () => {
    expect(ipToInt('10.0.0.0')).toBe(0x0a000000);
    expect(ipToInt('192.168.0.1')).toBe(0xc0a80001);
  });
});

describe('prefixToMask', () => {
  it('generates correct masks', () => {
    expect(prefixToMask(8)).toBe(0xff000000);
    expect(prefixToMask(24)).toBe(0xffffff00);
    expect(prefixToMask(32)).toBe(0xffffffff);
    expect(prefixToMask(0)).toBe(0);
  });
});

describe('parseEntry', () => {
  it('parses IPv4', () => {
    const e = parseEntry('10.1.2.3');
    expect(e.kind).toBe('ipv4');
    expect(e.exclude).toBe(false);
  });

  it('parses CIDR', () => {
    const e = parseEntry('10.0.0.0/8');
    expect(e.kind).toBe('cidr');
    expect(e.prefixLen).toBe(8);
  });

  it('parses domain', () => {
    const e = parseEntry('example.com');
    expect(e.kind).toBe('domain');
    expect(e.domain).toBe('example.com');
  });

  it('parses wildcard domain', () => {
    const e = parseEntry('*.example.com');
    expect(e.kind).toBe('wildcard-domain');
    expect(e.isWildcard).toBe(true);
    expect(e.domain).toBe('example.com');
  });

  it('sets exclude=true for ! prefix', () => {
    const e = parseEntry('!10.1.2.3');
    expect(e.exclude).toBe(true);
    expect(e.kind).toBe('ipv4');
  });

  it('throws on invalid input', () => {
    expect(() => parseEntry('not-a-scope-entry!!!')).toThrow();
  });
});
