# @hailbytes/asm-scope-parser

> Parses and normalizes attack surface scope definitions: IP ranges, CIDR, domains, wildcards, and exclusions.

![Status: Incubation — not yet published to npm](https://img.shields.io/badge/Status-Incubation%20%E2%80%94%20not%20yet%20published%20to%20npm-yellow)

## Planned npm Package

```
npm install @hailbytes/asm-scope-parser
```

## Planned Audience

Pentesters, bug bounty hunters, and ASM platform engineers who need a reliable, framework-agnostic way to parse and validate scope definitions.

## Planned API Sketch

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
