# @hailbytes/asm-scope-parser

> Parses and normalizes attack surface scope definitions: IP ranges, CIDR, domains, wildcards, and exclusions.

[![npm version](https://img.shields.io/npm/v/%40hailbytes%2Fasm-scope-parser.svg)](https://www.npmjs.com/package/%40hailbytes%2Fasm-scope-parser)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## Install

```bash
npm install @hailbytes/asm-scope-parser
```

## Who Is This For

Pentesters, bug bounty hunters, and ASM platform engineers who need a reliable, framework-agnostic way to parse and validate scope definitions.

## API

```ts
import { parseScope } from '@hailbytes/asm-scope-parser';

const scope = parseScope(['10.0.0.0/8', '*.example.com', '!192.168.1.0/24']);

scope.includes('10.1.2.3');    // true
scope.excludes('192.168.1.5'); // true
scope.toCIDR();                // string[]
scope.toJSON();                // NormalizedScope
```

## See Also

- [@hailbytes/sbom-diff](https://github.com/HailBytes/sbom-diff)
- [@hailbytes/phishing-template-linter](https://github.com/HailBytes/phishing-template-linter)
- [HailBytes Platform](https://hailbytes.com)

## Links

- [hailbytes.com](https://hailbytes.com)
