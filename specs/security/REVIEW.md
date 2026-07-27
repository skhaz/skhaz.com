# Security review

- Reviewed: 2026-07-27
- Base: `669a5dc79f9522912741f5aab980c6cccfa6774d`
- Scope: the pending restoration diff, excluding the preexisting unstaged change to `archive/sources/wayback-home-2008-09.html`
- Verdict: **PASS — no unresolved HIGH findings**

## Assessment

- Historical raw captures remain outside `dist/`; generated pages use sanitized content and escaped provenance fields.
- Validation rejects active post/comment HTML, dangerous URI schemes, unauthorized iframes, inline scripts, and third-party generated scripts.
- Local JSON parsing and subprocess execution do not expose attacker-controlled command interpolation.
- The Pages workflow uses minimal permissions, disables persisted checkout credentials, installs with `npm ci --ignore-scripts`, and pins actions to commit SHAs.
- No credentials or authentication secrets were found in the intended diff.

## Low finding resolved

Raw archived HTML can contain active third-party HTTP scripts if opened directly. `archive/sources/README.md` now requires inspecting captures as text or in a network-isolated environment; these files are never deployed.
