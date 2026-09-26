# Pull request

## What does this change?

<!-- A short description. Link any related issue: Closes #123 -->

## Why?

<!-- What problem does this solve? If it changes a product decision — a
classification rule, a filter's semantics, how something is worded — say why the
new behaviour is better. -->

## Type of change

- [ ] New resource(s) in the library
- [ ] Correction to existing resource data
- [ ] Verification pass on existing entries
- [ ] Bug fix
- [ ] New feature
- [ ] Design or accessibility improvement
- [ ] Documentation
- [ ] Refactor with no behaviour change

## Checks

```bash
npm run build      # includes all data validation
npm run lint
npx tsc --noEmit
```

- [ ] `npm run build` passes
- [ ] `npm run lint` passes
- [ ] `npx tsc --noEmit` passes

## If this changes resource data

- [ ] Free status follows the [definitions](../blob/main/CONTRIBUTING.md#choosing-a-free-status) — no trial described as free
- [ ] Limitations are documented for any conditional status, including the inconvenient ones
- [ ] `officialUrl` is the provider's own HTTPS URL, with no affiliate or tracking parameters
- [ ] Tri-state fields use `unknown` where the answer has not actually been established
- [ ] `verificationStatus` reflects what was really checked, and `verificationNotes` say what that was
- [ ] Each `verificationChecks` record states what the official source says, and cites it
- [ ] `docs/verification-backlog.md` regenerated (`npm run build:static && npm run backlog`)
- [ ] `PARTIALLY_VERIFIED` only with a confirmed `FREE_STATUS` check; pre-verification notes are in `compilationNotes`
- [ ] `VERIFIED` is only set by a maintainer in `src/config/maintainers.ts` who re-opened the sources, under their own `@handle`

## If this changes the UI

- [ ] Works by keyboard alone, with a visible focus state
- [ ] Interactive elements have accessible names; icon-only controls are labelled
- [ ] No information is conveyed by colour alone
- [ ] Tested at narrow widths as well as desktop
- [ ] Tested in both light and dark themes
- [ ] Honours `prefers-reduced-motion`
- [ ] Empty, loading and error states are handled

## If this adds a tool

- [ ] Processing happens in the browser, or the registry declares honestly that it does not
- [ ] The `processing` declaration matches what the implementation actually does
- [ ] Limitations are documented
- [ ] Any third-party library used is credited with its licence

## If this adds a dependency

- [ ] Explained below why it cannot reasonably be done without it

<!-- The runtime dependency list is React, Next.js and Zod. A fourth needs an argument. -->

## Anything reviewers should know?

<!-- Trade-offs, things you were unsure about, parts you would like a second
opinion on. Flagging uncertainty is welcome, not a weakness. -->
