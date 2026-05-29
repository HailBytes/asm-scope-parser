# @hailbytes/asm-scope-parser
![npm](https://img.shields.io/npm/dt/@hailbytes/asm-scope-parser)


> Parses and normalizes attack surface scope definitions: IP ranges, CIDR, domains, wildcards, and exclusions. Framework-agnostic, zero-dependency.

[![npm version](https://img.shields.io/npm/v/%40hailbytes%2Fasm-scope-parser.svg)](https://www.npmjs.com/package/%40hailbytes%2Fasm-scope-parser)
[![npm downloads](https://img.shields.io/npm/dw/%40hailbytes%2Fasm-scope-parser.svg)](https://www.npmjs.com/package/@hailbytes/asm-scope-parser)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/%40hailbytes%2Fasm-scope-parser)](https://bundlephobia.com/package/@hailbytes/asm-scope-parser)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-davidhailbytes-blue?logo=linkedin&style=flat)](https://www.linkedin.com/in/davidhailbytes/)

---

## What it does

Parse and normalize attack surface scope definitions from any source — bug bounty programs, penetration test briefs, ASM platforms. Handles IPv4/IPv6, CIDR ranges, domain wildcards, and exclusion rules. Zero dependencies.

---

## Install

```bash
npm install @hailbytes/asm-scope-parser
```

---

## Quick Start

```ts
import { parseScope } from '@hailbytes/asm-scope-parser';

// 1. Parse a mixed scope definition
const scope = parseScope([
  '10.0.0.0/8',
  '*.example.com',
  '!192.168.1.0/24',  // exclusion
]);

// 2. Check membership
scope.includes('10.1.2.3');      // true
scope.includes('192.168.1.5');   // false (excluded)
scope.excludes('192.168.1.5');   // true

// 3. Export
scope.toCIDR();   // string[] of all CIDR ranges
scope.toJSON();   // NormalizedScope object
```

---

## Who Is This For

Pentesters, bug bounty hunters, and ASM platform engineers who need a reliable, framework-agnostic way to parse and validate scope definitions from diverse sources.

---

## See Also

- [`@hailbytes/sbom-diff`](https://github.com/HailBytes/sbom-diff) — Diff CycloneDX/SPDX SBOMs
- [`@hailbytes/phishing-template-linter`](https://github.com/HailBytes/phishing-template-linter) — Lint GoPhish email templates
- [HailBytes Platform](https://hailbytes.com)

---

*Part of the [HailBytes](https://hailbytes.com) open-source security toolkit.*