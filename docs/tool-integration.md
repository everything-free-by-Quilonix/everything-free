# Tool integration

Everything.Free is **not** going to rebuild every tool that already exists. The library is the primary answer: when someone needs to edit a video, the right response is a good listing for a real video editor, not a worse video editor built here.

The tools section exists only for jobs where running the tool *here* is genuinely better — small, focused work that can happen on the user's own device with no upload, no queue and no account.

---

## Integration mechanisms

Six legitimate ways to offer a tool, in the order they should be preferred:

| # | Type | What it means | Requirement |
| --- | --- | --- | --- |
| 1 | `BROWSER_LOCAL` | Runs entirely on the user's device | No input may leave the device. Costs nothing |
| 2 | `OPEN_SOURCE` | An existing open-source implementation, integrated under its licence | Licence permits the use; attribution honoured |
| 3 | `SELF_HOSTED` | We run an open-source implementation ourselves | Affordable to host; user data not put at unnecessary risk |
| 4 | `API` | A third-party API provides the capability | Provider named, free-tier ceiling recorded, privacy impact disclosed |
| 5 | `EMBED` | The provider's own tool, embedded with permission | **Written permission.** An iframe that renders is not permission |
| 6 | `EXTERNAL_LINK` | Send the user to the provider | Always acceptable; the default when nothing better applies |

The ordering is by cost and privacy, which happen to align. Browser-local is free and leaks nothing; a third-party API costs money at scale and sends user data somewhere else.

### Disambiguation rule

`integrationType` describes **where the work happens**, not where the code came from.

A tool built on an open-source library but executing in the browser is `BROWSER_LOCAL`, and the library is credited through `attributions`. Without that rule the categories overlap and the classification stops carrying information. The planned PDF tool is a worked example: it will use the MIT-licensed `pdf-lib`, but because it runs in the browser it is classified `BROWSER_LOCAL`, with `pdf-lib` in `attributions`.

---

## Every tool must document

Declared in `src/config/tools.ts` and validated at build time:

| Field | Purpose |
| --- | --- |
| `integrationType` | The delivery mechanism |
| `infrastructureCost` | `none`, `free-tier`, or `paid` |
| `freeTierLimitation` | The binding ceiling — required when cost is `free-tier` |
| `processing.location` | `browser`, `server`, or `third-party` |
| `processing.leavesDevice` | Whether input leaves the user's machine |
| `processing.explanation` | Plain-language disclosure, shown verbatim |
| `processing.thirdParty` | Who receives data, when anyone does |
| `attributions` | Open-source work used, with licence and whether credit is required |
| `limitations` | What it will not do. Never empty |

### Privacy claims are generated, not written

The disclosure a user reads is rendered from `processing`, not authored as page copy. There is no prop for "privacy text" and no way for a page to override it.

This matters because prose drifts from implementation. If a tool starts sending data to a server, the registry entry has to change, and the disclosure changes with it — they cannot disagree.

### Build-time guards

In `assertToolIntegrity()`:

- `BROWSER_LOCAL` **cannot** declare that data leaves the device
- `BROWSER_LOCAL` **cannot** declare any infrastructure cost
- Non-browser processing **must** declare that data leaves the device
- `third-party` processing **must** name the third party
- `API` **must** name the provider receiving data
- `OPEN_SOURCE` **must** credit at least one project
- `free-tier` **must** record its ceiling
- **`paid` is rejected outright**
- Every tool **must** document at least one limitation

The paid guard is the important one. The project runs on no paid infrastructure, and encoding that as a build failure means introducing a paid dependency requires deliberately deleting the check — a visible decision in a diff, not something that arrives quietly in review.

---

## Adding a tool

### 1. Should it exist here at all?

Ask honestly:

- Is there already a good free tool for this? **Then list it instead.** A well-verified listing is more useful than a weaker reimplementation.
- Can it run entirely in the browser? If not, the bar is much higher.
- Is it a small, focused job? Multi-step workflows belong in real applications.
- Does running it here give the user something real — privacy, no upload, no account, no queue?

The answer is often "list it, don't build it". That is a success, not a failure.

### 2. Pick the lowest-numbered mechanism that works

Prefer browser APIs. Then an existing permissively-licensed open-source library. Do not reimplement a solved problem — the point is to avoid duplicated effort, not to demonstrate it.

### 3. Register it honestly

```ts
{
  id: "example-tool",
  slug: "example-tool",
  name: "Example tool",
  // …
  integrationType: "BROWSER_LOCAL",
  infrastructureCost: "none",
  processing: {
    location: "browser",
    leavesDevice: false,
    explanation:
      "Your input is processed by your own browser on your own device. Nothing is " +
      "sent to Everything.Free or anyone else. You can confirm this by opening your " +
      "browser's network panel while using the tool.",
  },
  attributions: [],
  limitations: [
    "Limited by your device's available memory rather than by a server.",
    "Does not handle <specific case>.",
  ],
  relatedResources: ["a-real-application-for-heavier-work"],
}
```

If the implementation sends data anywhere, **say so**. The tool will still be accepted, and the page will tell users the truth. Misdeclaring it is the only unacceptable option.

### 4. Implement it

Add the component under `features/tools/implementations/` and a case in `ToolSurface`. The switch is a static switch on purpose: resolving a component reference during render creates a new component identity each time and would reset the tool's state on every interaction.

### 5. Accessibility and failure handling

Not optional:

- Every control labelled; visible focus state, including on visually-hidden inputs whose focus ring has to be projected onto the label
- Results announced through a live region so screen-reader users learn the outcome
- Failure states explained in terms the user can act on — "the file is too large for this tab's memory, try a smaller maximum width", not "an error occurred"
- Sensible behaviour on large input, since the work happens on the user's device
- Usable at narrow widths
- `prefers-reduced-motion` respected

### 6. Document what it will not do

Every tool has trade-offs. A tool page with no limitations section is a tool page that has not been thought about.

---

## Legal obligations

Non-negotiable:

- **Licences.** Honour them, including copyleft implications for integrated code.
- **Terms of service.** Do not use an API in a way its terms forbid.
- **Attribution.** Where a licence requires credit, `attributions[].required` must be `true` and the tool page displays it.
- **Branding.** Some providers require specific attribution wording or marks when embedding.
- **Copyright.** Do not integrate anything that circumvents access controls or payment.

Convenience is not permission. An endpoint that responds to requests, or an iframe that happens to render, is not authorisation to build a product on it.

---

## Current tools

| Tool | Type | Cost | Data leaves device | Built on |
| --- | --- | --- | --- | --- |
| Private AI chat | `BROWSER_LOCAL` | none | No (the model is downloaded once, on request) | WebLLM (Apache-2.0), Qwen and SmolLM2 models (Apache-2.0) |
| Free-trial cancel reminder | `BROWSER_LOCAL` | none | No | iCalendar (RFC 5545), Blob download |
| Subscription audit & free swaps | `BROWSER_LOCAL` | none | No | Alternative targets baked in at build time |
| Image converter & compressor | `BROWSER_LOCAL` | none | No | Canvas API |
| Photo metadata viewer & remover | `BROWSER_LOCAL` | none | No | Exif 2.32 and PNG specifications; lossless segment removal |
| Colour contrast checker | `BROWSER_LOCAL` | none | No | WCAG 2.1 formulas (W3C) |
| Colour palette extractor | `BROWSER_LOCAL` | none | No | Canvas API, median cut (Heckbert, 1982) |
| Text toolkit | `BROWSER_LOCAL` | none | No | Web standards |

Eight tools, all working. That is deliberately a short list, and the tools index says so — the library is where breadth belongs. PDF merge, QR codes and most developer utilities live on the sister site, Everything.Free Tools, and are linked from the index rather than duplicated here.

The two "Keep it free" tools exist because they protect the thing this project is about. Surveys in 2025–26 found that roughly half to four in five US adults have been charged after forgetting to cancel a free trial, and that people underestimate their subscription spend by around 2.5×. Neither tool records a price or a provider's terms: the trial reminder computes dates from what the user enters, and the audit totals the user's own amounts and matches product names against the library's `/alternatives/` pages with the same `slugifyProductName` that generates them, so a match always links to a page that exists.

---

## Future integrations worth considering

Only where they clear the bar above:

| Idea | Likely mechanism | Note |
| --- | --- | --- |
| Audio transcription | `BROWSER_LOCAL` via WASM Whisper | Large model download; the private AI chat's declared-download pattern applies |
| WebP / HEIC metadata removal | `BROWSER_LOCAL` | Extends the photo metadata tool; HEIC needs an ISO-BMFF parser |

Explicitly **not** planned: anything requiring a paid API, anything needing an account, or anything that would duplicate a mature application better served by a listing.
