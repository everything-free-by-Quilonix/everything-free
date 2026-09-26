# Security Policy

## Reporting a vulnerability

**Please do not open a public issue for a security problem.**

Report it privately through a [GitHub Security Advisory](https://github.com/everything-free-by-Quilonix/everything-free/security/advisories/new). This keeps the report confidential while it is being addressed.

Please include:

- What the issue is, and what an attacker could achieve
- Steps to reproduce it
- The affected version, commit or URL
- Anything you have already worked out about a fix

You can expect an acknowledgement within a few days. We will keep you informed while we investigate, and credit you when the fix ships unless you would rather remain anonymous.

Please give us a reasonable opportunity to fix the issue before disclosing it publicly.

## Scope

Everything.Free is a fully static site — no server runtime, no user accounts, no database and no stored user data at this stage. That removes whole categories of risk, and it also means the interesting surface is narrower than usual. Reports are particularly welcome on:

- **Cross-site scripting**, especially anywhere contributor-supplied strings are rendered. The JSON-LD renderer escapes `<` for exactly this reason, since a `</script>` sequence inside a data field would otherwise break out of the element.
- **Bypassing the Content Security Policy.** Every page carries a `<meta>` CSP that allows only the inline scripts present at build time, by SHA-256 hash (`scripts/csp.mjs`). A way to run script that the policy should have blocked is in scope.
- **Contribution form handling.** The submission and report forms validate input with Zod in the browser and compose a prefilled GitHub issue URL from it. Nothing is persisted, so validation is advisory rather than a trust boundary — but injection into the composed URL, or a way to make the prefilled issue misrepresent what the user entered, is in scope.
- **The link manifest** (`/link-manifest.json`), a build-time file consumed by the maintenance workflows. Anything that lets data in it influence those workflows unsafely is in scope.
- **The maintenance workflows** in `.github/workflows/`, which run with `issues: write`.
- **Dependency vulnerabilities** in `next`, `react` or `zod`.
- **Build-time code execution** through the data or configuration files.
- **Privacy claims that are not true.** If you find that a tool documented as processing data locally in fact transmits it, that is a security report, and an important one. The build validates the *declaration*, not the implementation, so an implementation that contradicts its declaration is a real bug.

### Out of scope

- Vulnerabilities in the third-party resources listed in the library. Report those to the provider; if a listing points somewhere genuinely harmful, please [report the listing](https://everything-free-by-quilonix.github.io/everything-free/report/) so it can be removed.
- Missing hardening headers with no demonstrable impact on a site with no authentication or user data. GitHub Pages cannot send custom headers, so `frame-ancestors`, `X-Frame-Options` and similar are absent by a documented limitation — see [`docs/deployment.md`](docs/deployment.md#limitations-on-github-pages).
- Volumetric denial of service against the hosting provider.
- Automated scanner output without a described impact.
- Inaccurate resource information. That is a correction, not a vulnerability — please use the report form.

## Supported versions

The project is pre-1.0. Security fixes are applied to the `main` branch, and there are no maintained release branches yet.
