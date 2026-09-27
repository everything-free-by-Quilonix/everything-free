# Verification backlog

<!-- GENERATED FILE — do not edit by hand. -->
<!-- Regenerate: npm run build:static && npm run backlog -->

The work queue for verifying the library, generated from the resource data. CI fails if this file
does not match the data, so it is always current as of the last merged change.

The order below is a **verification workflow, not a ranking** of the resources. See
[`verification.md`](verification.md) for how to verify an entry and what counts as evidence.

## Summary

| | Count |
| --- | --- |
| Resources | 44 |
| Verified (signed off by a maintainer) | 0 |
| Evidence complete, awaiting maintainer sign-off | 4 |
| Partially verified (free status confirmed, checklist incomplete) | 2 |
| Checks started, free status not yet confirmed | 4 |
| Not verified yet (no checks recorded) | 34 |

No maintainer is registered in `src/config/maintainers.ts` yet, so nothing can be signed off. A maintainer adds their own handle there first.

`VERIFIED` requires all 10 required checks confirmed against official sources, a dated source for each, and
sign-off by a registered maintainer. Claims older than 90 days are shown on the site as needing a
re-check; the monthly freshness workflow reports those separately.

## Queue

### 1. Awaiting maintainer sign-off

Every required check is confirmed with an official source. A maintainer listed in `src/config/maintainers.ts` re-opens the sources, and signs off with their GitHub handle. This is the cheapest work in the queue.

| Resource | Status | Required checks confirmed | Remaining | Last checked | Checked by | Next action |
| --- | --- | --- | --- | --- | --- | --- |
| [GIMP](#gimp-gimp) `gimp` | Partially verified | 10/10 | — | 2026-09-26 | agent-assisted pass — awaiting maintainer review | Maintainer: re-open the sources and sign off |
| [KeePassXC](#keepassxc-keepassxc) `keepassxc` | Partially verified | 10/10 | — | 2026-09-26 | agent-assisted pass — awaiting maintainer review | Maintainer: re-open the sources and sign off |
| [LibreOffice](#libreoffice-libreoffice) `libreoffice` | Partially verified | 10/10 | — | 2026-09-26 | agent-assisted pass — awaiting maintainer review | Maintainer: re-open the sources and sign off |
| [Obsidian](#obsidian-obsidian) `obsidian` | Partially verified | 10/10 | — | 2026-09-26 | agent-assisted pass — awaiting maintainer review | Maintainer: re-open the sources and sign off |

### 2. High user value

Entries surfaced on the homepage. They are seen most, so an error in them misleads the most people. (Selected editorially — no usage data is collected.)

| Resource | Status | Required checks confirmed | Remaining | Last checked | Checked by | Next action |
| --- | --- | --- | --- | --- | --- | --- |
| Blender `blender` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| DaVinci Resolve `davinci-resolve` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Khan Academy `khan-academy` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| OBS Studio `obs-studio` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Ollama `ollama` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| [Supabase](#supabase-supabase) `supabase` | Partially verified | 9/10 | Credit-card requirement (unresolved) | 2026-09-26 | agent-assisted pass — awaiting maintainer review | Settle Credit-card requirement from an official source |
| Visual Studio Code `vs-code` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |

### 3. Checks already started

A pass has recorded sources. Finishing it is cheaper than starting a new one.

| Resource | Status | Required checks confirmed | Remaining | Last checked | Checked by | Next action |
| --- | --- | --- | --- | --- | --- | --- |
| [Autodesk Fusion for Personal Use](#autodesk-fusion-for-personal-use-autodesk-fusion-personal) `autodesk-fusion-personal` | Partially verified | 9/10 | Credit-card requirement (unresolved) | 2026-09-26 | agent-assisted pass — awaiting maintainer review | Settle Credit-card requirement from an official source |
| [Cloudflare Pages](#cloudflare-pages-cloudflare-pages) `cloudflare-pages` | Unverified | 1/10 | Free status, Free-tier limits, Account requirement, Credit-card requirement, Commercial use, Personal use, Licence, Major limitations, Pricing information | 2026-09-26 | agent-assisted pass — awaiting maintainer review | Confirm 9 remaining required check(s) |
| [Stirling PDF](#stirling-pdf-stirling-pdf) `stirling-pdf` | Unverified | 2/10 | Free status (unresolved), Free-tier limits, Account requirement, Credit-card requirement, Commercial use (unresolved), Personal use, Major limitations, Pricing information | 2026-09-26 | agent-assisted pass — awaiting maintainer review | Settle Free status, Commercial use from an official source |
| [Thunderbird](#thunderbird-thunderbird) `thunderbird` | Unverified | 1/10 | Free status, Free-tier limits, Account requirement, Credit-card requirement, Commercial use, Personal use, Licence, Major limitations, Pricing information | 2026-09-26 | agent-assisted pass — awaiting maintainer review | Confirm 9 remaining required check(s) |
| [VLC media player](#vlc-media-player-vlc) `vlc` | Unverified | 1/10 | Free status, Free-tier limits, Account requirement, Credit-card requirement, Commercial use, Personal use, Licence, Major limitations, Pricing information | 2026-09-26 | agent-assisted pass — awaiting maintainer review | Confirm 9 remaining required check(s) |

### 4. Straightforward official documentation

Open-source projects publish a licence file and usually a single project site, so most checks can be settled from one or two official pages.

| Resource | Status | Required checks confirmed | Remaining | Last checked | Checked by | Next action |
| --- | --- | --- | --- | --- | --- | --- |
| Anki `anki` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Audacity `audacity` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Excalidraw `excalidraw` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| FreeCAD `freecad` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Godot Engine `godot` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Inkscape `inkscape` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Kdenlive `kdenlive` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Krita `krita` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Organic Maps `organic-maps` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Penpot `penpot` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Shotcut `shotcut` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Signal `signal` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Whisper `whisper` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Zotero `zotero` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |

### 5. Likely to go out of date

Free tiers, trials, limited and personal-use offerings change with the vendor's pricing decisions, so their claims decay fastest.

| Resource | Status | Required checks confirmed | Remaining | Last checked | Checked by | Next action |
| --- | --- | --- | --- | --- | --- | --- |
| GitHub `github` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Google Colab `google-colab` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Hugging Face `hugging-face` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| LanguageTool `languagetool` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Photopea `photopea` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |

### 6. Remaining

Everything else not yet verified.

| Resource | Status | Required checks confirmed | Remaining | Last checked | Checked by | Next action |
| --- | --- | --- | --- | --- | --- | --- |
| freeCodeCamp `freecodecamp` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Google Fonts `google-fonts` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Internet Archive `internet-archive` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| MIT OpenCourseWare `mit-opencourseware` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| OpenStreetMap `openstreetmap` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Pexels `pexels` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Project Gutenberg `project-gutenberg` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Unsplash `unsplash` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Wikipedia `wikipedia` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |

## Worksheets

Every resource with recorded checks, check by check. **Not checked** rows show the question still to answer.
For a resource with no checks yet, run `npm run worksheet -- <slug>` for a blank worksheet and a record template.

### GIMP `gimp`

**Evidence complete, awaiting maintainer sign-off** · shown on the site as Partially verified · 10/10 required checks confirmed · last checked 2026-09-26 · checked by agent-assisted pass — awaiting maintainer review

| Check | Result | Evidence | Source | Read on |
| --- | --- | --- | --- | --- |
| Official URL | ✅ Confirmed | gimp.org is the GIMP project's own site; the FAQ, downloads page and licence file under it all loaded. | [Downloads page: current stable release 3.2.6, direct downloads for Linux, macOS and Windows with no sign-in or payment step](https://www.gimp.org/downloads/) | 2026-09-26 |
| Free status | ✅ Confirmed | The FAQ states GIMP is distributed under the GPL v3 and later and that you are free to use, study, change and distribute it. That is OPEN_SOURCE. | [User FAQ: commercial use allowed; GPL v3 and later, free to use for any purpose; interface deliberately not a Photoshop copy; no Android or iOS version; CMYK converted on import and export, not a core image mode; development funded by volunteers and donations](https://www.gimp.org/docs/userfaq.html) | 2026-09-26 |
| Free-tier limits | ✅ Confirmed | There is no free tier to cap: the FAQ says you are free to use GIMP for any purpose, and the downloads page offers the full current release (3.2.6) with no paid edition. | [User FAQ: commercial use allowed; GPL v3 and later, free to use for any purpose; interface deliberately not a Photoshop copy; no Android or iOS version; CMYK converted on import and export, not a core image mode; development funded by volunteers and donations](https://www.gimp.org/docs/userfaq.html) | 2026-09-26 |
| Account requirement | ✅ Confirmed | The downloads page links installers directly (and via BitTorrent, Flathub and the Snap Store) with no sign-in step. | [Downloads page: current stable release 3.2.6, direct downloads for Linux, macOS and Windows with no sign-in or payment step](https://www.gimp.org/downloads/) | 2026-09-26 |
| Credit-card requirement | ✅ Confirmed | The downloads page has no payment step; the FAQ describes funding through voluntary donations and contributor fundraisers. No card is needed. | [Downloads page: current stable release 3.2.6, direct downloads for Linux, macOS and Windows with no sign-in or payment step](https://www.gimp.org/downloads/) | 2026-09-26 |
| Commercial use | ✅ Confirmed | The FAQ answers 'Can I use GIMP commercially?' with 'Yes, you can', adding that it puts no restrictions on the kind of work you produce. | [User FAQ: commercial use allowed; GPL v3 and later, free to use for any purpose; interface deliberately not a Photoshop copy; no Android or iOS version; CMYK converted on import and export, not a core image mode; development funded by volunteers and donations](https://www.gimp.org/docs/userfaq.html) | 2026-09-26 |
| Personal use | ✅ Confirmed | The FAQ states you are free to use GIMP for any purpose. | [User FAQ: commercial use allowed; GPL v3 and later, free to use for any purpose; interface deliberately not a Photoshop copy; no Android or iOS version; CMYK converted on import and export, not a core image mode; development funded by volunteers and donations](https://www.gimp.org/docs/userfaq.html) | 2026-09-26 |
| Licence | ✅ Confirmed | The FAQ gives the licence as GPL v3 and later, and the licence file on gimp.org is the GNU GPL version 3. That matches the recorded GPL-3.0-or-later. | [Licence file published on gimp.org: GNU General Public License, version 3](https://www.gimp.org/about/COPYING) | 2026-09-26 |
| Major limitations | ✅ Confirmed | The FAQ says the interface is deliberately not a copy of Photoshop's, that there is no Android or iOS version, and that CMYK is handled by converting on import and export rather than as a core image mode, with GCR not planned. The 3.2 release notes show non-destructive layers now exist, so the old limitation saying they did not was removed. | [User FAQ: commercial use allowed; GPL v3 and later, free to use for any purpose; interface deliberately not a Photoshop copy; no Android or iOS version; CMYK converted on import and export, not a core image mode; development funded by volunteers and donations](https://www.gimp.org/docs/userfaq.html) | 2026-09-26 |
| Pricing information | ✅ Confirmed | No paid version exists. The FAQ describes a volunteer project, with development funded by donations and fundraisers by trusted contributors. That matches 'no paid tier'. | [User FAQ: commercial use allowed; GPL v3 and later, free to use for any purpose; interface deliberately not a Photoshop copy; no Android or iOS version; CMYK converted on import and export, not a core image mode; development funded by volunteers and donations](https://www.gimp.org/docs/userfaq.html) | 2026-09-26 |
| Platform availability *(optional)* | ✅ Confirmed | The downloads page offers builds for GNU/Linux, macOS and Microsoft Windows — the three platforms recorded. | [Downloads page: current stable release 3.2.6, direct downloads for Linux, macOS and Windows with no sign-in or payment step](https://www.gimp.org/downloads/) | 2026-09-26 |
| Open-source status *(optional)* | ✅ Confirmed | GPL v3 and later, with the right to study and change the source, per the FAQ. Matches openSource: true. | [User FAQ: commercial use allowed; GPL v3 and later, free to use for any purpose; interface deliberately not a Photoshop copy; no Android or iOS version; CMYK converted on import and export, not a core image mode; development funded by volunteers and donations](https://www.gimp.org/docs/userfaq.html) | 2026-09-26 |

### KeePassXC `keepassxc`

**Evidence complete, awaiting maintainer sign-off** · shown on the site as Partially verified · 10/10 required checks confirmed · last checked 2026-09-26 · checked by agent-assisted pass — awaiting maintainer review

| Check | Result | Evidence | Source | Read on |
| --- | --- | --- | --- | --- |
| Official URL | ✅ Confirmed | keepassxc.org is the project's site, and the official repository keepassxreboot/keepassxc names it as its homepage. The download page and FAQ loaded. | [Download page: version 2.7.12 for macOS, Windows 10/11 and Linux; direct downloads and package managers with no sign-in; donations optional for 'this free software'](https://keepassxc.org/download/) | 2026-09-26 |
| Free status | ✅ Confirmed | The licence file releases KeePassXC under the GNU GPL version 2 or 3, and the download page calls it free software. That is OPEN_SOURCE. | [Licence file in the official repository: GNU GPL version 2 or (at your option) version 3](https://github.com/keepassxreboot/keepassxc/blob/develop/COPYING) | 2026-09-26 |
| Free-tier limits | ✅ Confirmed | There is no tier to cap: the download page offers the full current release (2.7.12) and mentions no paid edition. | [Download page: version 2.7.12 for macOS, Windows 10/11 and Linux; direct downloads and package managers with no sign-in; donations optional for 'this free software'](https://keepassxc.org/download/) | 2026-09-26 |
| Account requirement | ✅ Confirmed | The download page links installers and package-manager commands directly, with no sign-in, and describes it as keeping passwords on your own computer with no clouds and no third parties. | [Download page: version 2.7.12 for macOS, Windows 10/11 and Linux; direct downloads and package managers with no sign-in; donations optional for 'this free software'](https://keepassxc.org/download/) | 2026-09-26 |
| Credit-card requirement | ✅ Confirmed | The download page has no payment step; donating is presented as optional support for 'this free software'. No card is needed. | [Download page: version 2.7.12 for macOS, Windows 10/11 and Linux; direct downloads and package managers with no sign-in; donations optional for 'this free software'](https://keepassxc.org/download/) | 2026-09-26 |
| Commercial use | ✅ Confirmed | The GNU GPL versions 2 and 3, under which it is released, place no restriction on running the program for any purpose, including at work. | [Licence file in the official repository: GNU GPL version 2 or (at your option) version 3](https://github.com/keepassxreboot/keepassxc/blob/develop/COPYING) | 2026-09-26 |
| Personal use | ✅ Confirmed | Released as free software under the GPL, which permits running it for any purpose. | [Licence file in the official repository: GNU GPL version 2 or (at your option) version 3](https://github.com/keepassxreboot/keepassxc/blob/develop/COPYING) | 2026-09-26 |
| Licence | ✅ Confirmed | The COPYING file says the program may be redistributed and modified under the GNU GPL 'either version 2 or (at your option) version 3'. Recorded as GPL-2.0-only OR GPL-3.0-only. | [Licence file in the official repository: GNU GPL version 2 or (at your option) version 3](https://github.com/keepassxreboot/keepassxc/blob/develop/COPYING) | 2026-09-26 |
| Major limitations | ✅ Confirmed | The FAQ states there is no KeePassXC mobile app, that syncing is done by storing the database in a shared cloud folder, that plugins are not supported, and that Auto-Type on Linux works only under X11, not Wayland. | [FAQ: no own mobile app (recommends KeePassDX, KeePass2Android, Strongbox, KeePassium); sync by storing the database in a synced folder; no plugins; Auto-Type on Linux X11 only; network access only for opt-in favicons](https://keepassxc.org/docs/) | 2026-09-26 |
| Pricing information | ✅ Confirmed | No paid edition is offered; the download page asks only for optional donations to cover the team's expenses. | [Download page: version 2.7.12 for macOS, Windows 10/11 and Linux; direct downloads and package managers with no sign-in; donations optional for 'this free software'](https://keepassxc.org/download/) | 2026-09-26 |
| Platform availability *(optional)* | ✅ Confirmed | The download page offers macOS, Windows 10/11 and Linux builds — the three platforms recorded. | [Download page: version 2.7.12 for macOS, Windows 10/11 and Linux; direct downloads and package managers with no sign-in; donations optional for 'this free software'](https://keepassxc.org/download/) | 2026-09-26 |
| Open-source status *(optional)* | ✅ Confirmed | GPL version 2 or 3, with the source published in the official GitHub repository. Matches openSource: true. | [Licence file in the official repository: GNU GPL version 2 or (at your option) version 3](https://github.com/keepassxreboot/keepassxc/blob/develop/COPYING) | 2026-09-26 |

### LibreOffice `libreoffice`

**Evidence complete, awaiting maintainer sign-off** · shown on the site as Partially verified · 10/10 required checks confirmed · last checked 2026-09-26 · checked by agent-assisted pass — awaiting maintainer review

| Check | Result | Evidence | Source | Read on |
| --- | --- | --- | --- | --- |
| Official URL | ✅ Confirmed | libreoffice.org is The Document Foundation's site for LibreOffice; the FAQ, licences and system requirements pages under it loaded. | [LibreOffice FAQ: free and open source under MPL 2.0; usable in a business on any number of computers without licence fees; donations optional and the download always free](https://www.libreoffice.org/faq/) | 2026-09-26 |
| Free status | ✅ Confirmed | The FAQ describes LibreOffice as free and open source software that you can use, share and modify under the Mozilla Public License 2.0. That is OPEN_SOURCE. | [LibreOffice FAQ: free and open source under MPL 2.0; usable in a business on any number of computers without licence fees; donations optional and the download always free](https://www.libreoffice.org/faq/) | 2026-09-26 |
| Free-tier limits | ✅ Confirmed | There is no tier to cap: the FAQ says it can be used on one computer or 10,000+ without licence fees, and the download is always free. | [LibreOffice FAQ: free and open source under MPL 2.0; usable in a business on any number of computers without licence fees; donations optional and the download always free](https://www.libreoffice.org/faq/) | 2026-09-26 |
| Account requirement | ✅ Confirmed | The FAQ describes the download as clicking Download and then a direct link on the next page; no account or sign-in is involved. | [LibreOffice FAQ: free and open source under MPL 2.0; usable in a business on any number of computers without licence fees; donations optional and the download always free](https://www.libreoffice.org/faq/) | 2026-09-26 |
| Credit-card requirement | ✅ Confirmed | The FAQ states donations are purely optional and LibreOffice can always be downloaded for free. No card is needed. | [LibreOffice FAQ: free and open source under MPL 2.0; usable in a business on any number of computers without licence fees; donations optional and the download always free](https://www.libreoffice.org/faq/) | 2026-09-26 |
| Commercial use | ✅ Confirmed | The FAQ answers 'Can I use LibreOffice in my business?' with yes — on one computer or 10,000+ in an enterprise, without licence fees. | [LibreOffice FAQ: free and open source under MPL 2.0; usable in a business on any number of computers without licence fees; donations optional and the download always free](https://www.libreoffice.org/faq/) | 2026-09-26 |
| Personal use | ✅ Confirmed | The FAQ says anyone can use, share and modify the software under the MPL 2.0. | [LibreOffice FAQ: free and open source under MPL 2.0; usable in a business on any number of computers without licence fees; donations optional and the download always free](https://www.libreoffice.org/faq/) | 2026-09-26 |
| Licence | ✅ Confirmed | The licences page states LibreOffice is made available under the MPL v2.0, based on Apache-licensed OpenOffice code and bundling other open-source components. Matches the recorded MPL-2.0 and the licence note. | [Licences page: made available under MPL v2.0, based on Apache OpenOffice code, bundling other open-source components (the former /about-us/licenses/ address answers 301 here)](https://www.libreoffice.org/licenses/) | 2026-09-26 |
| Major limitations | ✅ Confirmed | The project's feature comparison rates Microsoft OOXML import and export as partial and says synchronous collaborative editing is not available in the desktop applications. The system requirements page says Java is required for some features, notably Base. | [The Document Foundation's feature comparison: partial OOXML support; no synchronous collaborative editing in the desktop applications](https://wiki.documentfoundation.org/Feature_Comparison:_LibreOffice_-_Microsoft_Office) | 2026-09-26 |
| Pricing information | ✅ Confirmed | No paid edition from The Document Foundation: the FAQ says it is free, with optional donations, and points larger deployments to paid support from third-party professionals. | [LibreOffice FAQ: free and open source under MPL 2.0; usable in a business on any number of computers without licence fees; donations optional and the download always free](https://www.libreoffice.org/faq/) | 2026-09-26 |
| Platform availability *(optional)* | ✅ Confirmed | The system requirements page covers Windows, macOS and GNU/Linux — the three platforms recorded. Android has only a separate viewer, so it is not listed. | [System requirements: Windows, macOS and GNU/Linux; Java needed for some features, notably Base; Android has a separate viewer](https://www.libreoffice.org/get-help/system-requirements/) | 2026-09-26 |
| Open-source status *(optional)* | ✅ Confirmed | Free and open source under the MPL 2.0, per the FAQ and the licences page. Matches openSource: true. | [Licences page: made available under MPL v2.0, based on Apache OpenOffice code, bundling other open-source components (the former /about-us/licenses/ address answers 301 here)](https://www.libreoffice.org/licenses/) | 2026-09-26 |

### Obsidian `obsidian`

**Evidence complete, awaiting maintainer sign-off** · shown on the site as Partially verified · 10/10 required checks confirmed · last checked 2026-09-26 · checked by agent-assisted pass — awaiting maintainer review

| Check | Result | Evidence | Source | Read on |
| --- | --- | --- | --- | --- |
| Official URL | ✅ Confirmed | obsidian.md is the vendor's own domain; the homepage and the licence, pricing and download pages under it all loaded. | [Obsidian homepage on the vendor's own domain](https://obsidian.md) | 2026-09-26 |
| Free status | ✅ Confirmed | The licence overview states Obsidian can be downloaded and used for free, forever, for any purpose. That matches FREE: no time limit and no paid upgrade needed for normal use. | [Licence overview: free for any purpose, no account needed to download or use, rights to app code reserved](https://obsidian.md/license) | 2026-09-26 |
| Free-tier limits | ✅ Confirmed | The announcement states all features are available for free without limits. The only paid items are the optional supporter licences and the separate Sync and Publish services, so the app itself has no free-tier cap. | [Vendor announcement making the Commercial licence optional; all features free without limits](https://obsidian.md/blog/free-for-work/) | 2026-09-26 |
| Account requirement | ✅ Confirmed | The licence overview states that you can download and use Obsidian without creating an account. | [Licence overview: free for any purpose, no account needed to download or use, rights to app code reserved](https://obsidian.md/license) | 2026-09-26 |
| Credit-card requirement | ✅ Confirmed | The licence overview states that you can download and use Obsidian without creating an account, and that an account is only needed for payments or add-on services. Using the app involves no account and no payment step, so no card is required. | [Licence overview: free for any purpose, no account needed to download or use, rights to app code reserved](https://obsidian.md/license) | 2026-09-26 |
| Commercial use | ✅ Confirmed | The pricing FAQ answers 'Do I have to pay for commercial use?' with 'No'; the Commercial licence is encouraged but optional. | [Pricing FAQ: no payment required for commercial use; Sync and Publish are refundable paid purchases](https://obsidian.md/pricing) | 2026-09-26 |
| Personal use | ✅ Confirmed | The licence overview lists personal use first among the purposes Obsidian may be used for free. | [Licence overview: free for any purpose, no account needed to download or use, rights to app code reserved](https://obsidian.md/license) | 2026-09-26 |
| Licence | ✅ Confirmed | The licence overview says the vendor owns and reserves rights to the code in the app, and use is governed by its Terms of Service. That matches the recorded 'Proprietary'. | [Licence overview: free for any purpose, no account needed to download or use, rights to app code reserved](https://obsidian.md/license) | 2026-09-26 |
| Major limitations | ✅ Confirmed | Sync is sold as a per-user monthly subscription; the pricing FAQ describes Sync and Publish as refundable purchases, confirming both are paid; the licence overview reserves the vendor's rights to the app's code, confirming it is closed source. Every listed limitation is now one of these vendor-stated facts. | [Sync page pricing Obsidian Sync as a paid per-user subscription](https://obsidian.md/sync) | 2026-09-26 |
| Pricing information | ✅ Confirmed | The pricing FAQ confirms the Commercial and Catalyst licences are optional supporter purchases, and that Sync and Publish are the paid services. This matches the recorded free/paid boundary. | [Pricing FAQ: no payment required for commercial use; Sync and Publish are refundable paid purchases](https://obsidian.md/pricing) | 2026-09-26 |
| Platform availability *(optional)* | ✅ Confirmed | The download page offers builds for iOS, Android, Windows, Mac and Linux — the five platforms recorded. | [Download page listing iOS, Android, Windows, Mac and Linux builds](https://obsidian.md/download) | 2026-09-26 |
| Open-source status *(optional)* | ✅ Confirmed | Not open source: the licence overview reserves the vendor's rights to the app's code rather than publishing it under an open-source licence. Matches openSource: false. | [Licence overview: free for any purpose, no account needed to download or use, rights to app code reserved](https://obsidian.md/license) | 2026-09-26 |

### Autodesk Fusion for Personal Use `autodesk-fusion-personal`

**Partially verified** · shown on the site as Partially verified · 9/10 required checks confirmed · last checked 2026-09-26 · checked by agent-assisted pass — awaiting maintainer review

| Check | Result | Evidence | Source | Read on |
| --- | --- | --- | --- | --- |
| Credit-card requirement | ⚠️ Could not confirm | Neither the comparison page, the subscription-types guide nor the installation guide says whether signing up for Personal Use asks for a payment method. Community forum answers discuss activation but are not Autodesk statements and were not used. Recorded as unknown; settling it needs an explicit Autodesk statement or a dated sign-up test by a maintainer. | [Comparison page: personal non-commercial use only, under USD 1,000 a year, not in primary employment or company environments; list of reduced features; paid subscription options](https://www.autodesk.com/products/fusion-360/personal) | 2026-09-26 |
| Official URL | ✅ Confirmed | The listed URL is the Personal Use page on autodesk.com, the vendor's own domain, and it loaded. | [Comparison page: personal non-commercial use only, under USD 1,000 a year, not in primary employment or company environments; list of reduced features; paid subscription options](https://www.autodesk.com/products/fusion-360/personal) | 2026-09-26 |
| Free status | ✅ Confirmed | The page describes free cloud-based design and 3D modelling tools under Special Terms: personal, non-commercial projects only. That is PERSONAL_FREE. | [Comparison page: personal non-commercial use only, under USD 1,000 a year, not in primary employment or company environments; list of reduced features; paid subscription options](https://www.autodesk.com/products/fusion-360/personal) | 2026-09-26 |
| Free-tier limits | ✅ Confirmed | The subscription-types guide states Personal Use has a 10 active editable document limit. The comparison page lists the reduced features: limited CAM, single-user data management, limited electronics and PCB designs, limited 2D documentation and drawings, forum support only, limited import/export file types. | [Autodesk's Fusion subscription-types guide: Personal Use is free, for non-commercial home-based projects, limited to 10 active editable documents, with no commercial-use rights](https://www.autodesk.com/products/fusion-360/blog/fusion-subscription-types/) | 2026-09-26 |
| Account requirement | ✅ Confirmed | The installation guide states that on first run you are asked to sign in to your Autodesk Account, and that each licence type must be signed up for before activation. | [Autodesk installation guide: runs on Windows and Mac; requires signing in with an Autodesk Account](https://www.autodesk.com/products/fusion-360/blog/how-to-install-autodesk-fusion-360-windows-mac/) | 2026-09-26 |
| Commercial use | ✅ Confirmed | Excluded: the Special Terms restrict use to personal, non-commercial projects, and not in primary employment, company environments or commercial training. | [Comparison page: personal non-commercial use only, under USD 1,000 a year, not in primary employment or company environments; list of reduced features; paid subscription options](https://www.autodesk.com/products/fusion-360/personal) | 2026-09-26 |
| Personal use | ✅ Confirmed | Permitted: the Personal Use offering is specifically for personal, home-based, non-commercial projects. | [Comparison page: personal non-commercial use only, under USD 1,000 a year, not in primary employment or company environments; list of reduced features; paid subscription options](https://www.autodesk.com/products/fusion-360/personal) | 2026-09-26 |
| Licence | ✅ Confirmed | Use is governed by Autodesk's Fusion for Personal Use Special Terms and Conditions, which the page links to. That matches the recorded proprietary licence. | [Comparison page: personal non-commercial use only, under USD 1,000 a year, not in primary employment or company environments; list of reduced features; paid subscription options](https://www.autodesk.com/products/fusion-360/personal) | 2026-09-26 |
| Major limitations | ✅ Confirmed | The eligibility restrictions and reduced features come from the comparison page, and the 10 active editable documents limit from the subscription-types guide. The renewal FAQ confirms the licence expires, with renewal only in the last 30 days. The installation guide confirms Autodesk Account sign-in. | [Account renewal FAQ: a Fusion personal use licence can only be renewed in the last 30 days before it expires](https://www.autodesk.com/uk/support/account/manage/renew/faq) | 2026-09-26 |
| Pricing information | ✅ Confirmed | The page presents the paid Autodesk Fusion subscription (1-year or 1-month) as the route to full functionality and to any commercial use. That matches the recorded boundary. | [Comparison page: personal non-commercial use only, under USD 1,000 a year, not in primary employment or company environments; list of reduced features; paid subscription options](https://www.autodesk.com/products/fusion-360/personal) | 2026-09-26 |
| Open-source status *(optional)* | ⬜ Not checked | _Is the source genuinely published under an open-source licence?_ | — | — |
| Platform availability *(optional)* | ✅ Confirmed | The installation guide states Fusion runs on both Windows and Mac, with a Windows or Mac installer depending on the operating system — the two platforms recorded. | [Autodesk installation guide: runs on Windows and Mac; requires signing in with an Autodesk Account](https://www.autodesk.com/products/fusion-360/blog/how-to-install-autodesk-fusion-360-windows-mac/) | 2026-09-26 |

### Supabase `supabase`

**Partially verified** · shown on the site as Partially verified · 9/10 required checks confirmed · last checked 2026-09-26 · checked by agent-assisted pass — awaiting maintainer review

| Check | Result | Evidence | Source | Read on |
| --- | --- | --- | --- | --- |
| Credit-card requirement | ⚠️ Could not confirm | The sign-up form asks only for an email and password (or SSO), with no payment step. But the Terms reserve the right to preauthorise or validate a payment method upon account creation or before provisioning services, and no official page says the Free Plan never asks for one. The form alone does not show what happens when a project is created. Recorded as unknown; settling it needs an explicit Supabase statement or a dated sign-up test by a maintainer. | [Terms of Service: use for the customer's business purposes; reserves the right to preauthorise or validate a payment method upon account creation or before provisioning services](https://supabase.com/terms) | 2026-09-26 |
| Official URL | ✅ Confirmed | supabase.com is the vendor's own domain; the pricing, documentation and terms pages under it all loaded. | [Pricing page: Free plan with 500 MB database per project, pausing after 1 week of inactivity, no automatic backups or PITR, community support only](https://supabase.com/pricing) | 2026-09-26 |
| Free status | ✅ Confirmed | The subscription guide states a Free Plan subscription runs indefinitely unless the organisation is deleted, and the pricing page lists paid tiers above it. That is FREE_TIER: permanent, capped, not a trial. | [Subscription guide: a Free Plan subscription runs indefinitely](https://supabase.com/docs/guides/platform/manage-your-subscription) | 2026-09-26 |
| Free-tier limits | ✅ Confirmed | The pricing page lists 500 MB database size per project, 5 GB egress, 1 GB storage and pausing after 1 week of inactivity for Free; the billing FAQ gives two active free projects per person. | [Pricing page: Free plan with 500 MB database per project, pausing after 1 week of inactivity, no automatic backups or PITR, community support only](https://supabase.com/pricing) | 2026-09-26 |
| Account requirement | ✅ Confirmed | Using the hosted service starts at the sign-up form, which creates a Supabase account; projects then belong to organisations with Owner and Admin members. An account is required. | [Sign-up form: creating an account asks for an email and password, or SSO; the form has no payment step](https://supabase.com/dashboard/sign-up) | 2026-09-26 |
| Commercial use | ✅ Confirmed | The Terms grant access for the customer's business purposes and contain no Free-plan-specific restriction on commercial use; the arbitration clause expressly addresses customers using the service for commercial purposes. | [Terms of Service: use for the customer's business purposes; reserves the right to preauthorise or validate a payment method upon account creation or before provisioning services](https://supabase.com/terms) | 2026-09-26 |
| Personal use | ✅ Confirmed | The Terms expressly contemplate an individual using the Services for non-commercial purposes, with provisions specific to that case. | [Terms of Service: use for the customer's business purposes; reserves the right to preauthorise or validate a payment method upon account creation or before provisioning services](https://supabase.com/terms) | 2026-09-26 |
| Licence | ✅ Confirmed | The LICENSE file in the official supabase/supabase repository is the Apache License 2.0. The Terms describe the hosted platform itself as proprietary, which the licence notes already say. | [Licence file in Supabase's official repository: Apache License 2.0](https://raw.githubusercontent.com/supabase/supabase/master/LICENSE) | 2026-09-26 |
| Major limitations | ✅ Confirmed | The pausing guide says a paused Free project must be resumed from the dashboard and can be restored for up to a year — the listing previously claimed it would cold-start on the next request, which was wrong and has been corrected. The pricing page marks automatic backups and point-in-time recovery as not included on Free, with community support only. | [Project pausing guide: inactive Free projects paused, restored manually from the dashboard within 1 year](https://supabase.com/docs/guides/platform/free-project-pausing) | 2026-09-26 |
| Pricing information | ✅ Confirmed | The pricing page shows the Pro plan removing pausing ('Never'), adding automatic backups and email support. That matches the recorded free/paid boundary. | [Pricing page: Free plan with 500 MB database per project, pausing after 1 week of inactivity, no automatic backups or PITR, community support only](https://supabase.com/pricing) | 2026-09-26 |
| Platform availability *(optional)* | ✅ Confirmed | Used through the browser-based dashboard (hosted), and the self-hosting guide documents running it on your own infrastructure — the two platforms recorded. | [Self-hosting guide: Supabase can be run on your own infrastructure with Docker](https://supabase.com/docs/guides/self-hosting) | 2026-09-26 |
| Open-source status *(optional)* | ✅ Confirmed | The official repository is Apache-2.0 licensed, and the self-hosting guide documents running the stack yourself. | [Self-hosting guide: Supabase can be run on your own infrastructure with Docker](https://supabase.com/docs/guides/self-hosting) | 2026-09-26 |

### Cloudflare Pages `cloudflare-pages`

**Checks started, free status not yet confirmed** · shown on the site as Unverified · 1/10 required checks confirmed · last checked 2026-09-26 · checked by agent-assisted pass — awaiting maintainer review

| Check | Result | Evidence | Source | Read on |
| --- | --- | --- | --- | --- |
| Free status | ⬜ Not checked | _Does the provider's own documentation support the free-status classification?_ | — | — |
| Free-tier limits | ⬜ Not checked | _What exactly does the free offering cap, and is that recorded?_ | — | — |
| Account requirement | ⬜ Not checked | _Can it be used without creating an account?_ | — | — |
| Credit-card requirement | ⬜ Not checked | _Is a payment method required to start using the free offering?_ | — | — |
| Commercial use | ⬜ Not checked | _Do the terms permit paid or business use of the free offering?_ | — | — |
| Personal use | ⬜ Not checked | _Do the terms permit personal, non-commercial use?_ | — | — |
| Licence | ⬜ Not checked | _Is the recorded licence the one the provider actually publishes?_ | — | — |
| Major limitations | ⬜ Not checked | _Are the significant limitations documented, including inconvenient ones?_ | — | — |
| Pricing information | ⬜ Not checked | _Where does the free/paid boundary sit, according to the provider?_ | — | — |
| Official URL | ✅ Confirmed | pages.cloudflare.com permanently redirects to www.cloudflare.com/products/pages/, a page on Cloudflare's own domain describing Cloudflare Pages. It loaded, and the listing now points there. | [Cloudflare Pages product page on cloudflare.com; the former address pages.cloudflare.com answers 301 to it](https://www.cloudflare.com/products/pages/) | 2026-09-26 |
| Platform availability *(optional)* | ⬜ Not checked | _Are the listed platforms the ones the provider supports?_ | — | — |
| Open-source status *(optional)* | ⬜ Not checked | _Is the source genuinely published under an open-source licence?_ | — | — |

### Stirling PDF `stirling-pdf`

**Checks started, free status not yet confirmed** · shown on the site as Unverified · 2/10 required checks confirmed · last checked 2026-09-26 · checked by agent-assisted pass — awaiting maintainer review

| Check | Result | Evidence | Source | Read on |
| --- | --- | --- | --- | --- |
| Free status | ⚠️ Could not confirm | The MIT core supports OPEN_SOURCE, but the site now says "free for individual use" and part of the code is under other licences. Whether self-hosted team or company use is free was not established, so the classification is not confirmed. | [Project site: describes Stirling PDF as open source and "free for individual use", alongside team and processing products](https://www.stirling.com) | 2026-09-26 |
| Commercial use | ⚠️ Could not confirm | MIT permits commercial use of the MIT-licensed part, but the separately licensed directories and the "free for individual use" wording leave commercial use of the product as shipped unsettled. Recorded as unknown. | [LICENSE file: MIT for everything outside listed directories (app/proprietary/, app/saas/, engine/ and several frontend directories), which carry their own licences](https://github.com/Stirling-Tools/Stirling-PDF/blob/main/LICENSE) | 2026-09-26 |
| Free-tier limits | ⬜ Not checked | _What exactly does the free offering cap, and is that recorded?_ | — | — |
| Account requirement | ⬜ Not checked | _Can it be used without creating an account?_ | — | — |
| Credit-card requirement | ⬜ Not checked | _Is a payment method required to start using the free offering?_ | — | — |
| Personal use | ⬜ Not checked | _Do the terms permit personal, non-commercial use?_ | — | — |
| Major limitations | ⬜ Not checked | _Are the significant limitations documented, including inconvenient ones?_ | — | — |
| Pricing information | ⬜ Not checked | _Where does the free/paid boundary sit, according to the provider?_ | — | — |
| Official URL | ✅ Confirmed | The official repository's website field is stirling.com, and the old address stirlingpdf.com permanently redirects to www.stirling.com, which loaded and presents Stirling PDF. | [Official repository: names https://stirling.com as the project's website; stirlingpdf.com answers 301 to www.stirling.com](https://github.com/Stirling-Tools/Stirling-PDF) | 2026-09-26 |
| Licence | ✅ Confirmed | The LICENSE file grants MIT for content outside a listed set of directories, which are licensed separately. The listing records MIT with a licence note naming that exception; it previously said plain MIT. | [LICENSE file: MIT for everything outside listed directories (app/proprietary/, app/saas/, engine/ and several frontend directories), which carry their own licences](https://github.com/Stirling-Tools/Stirling-PDF/blob/main/LICENSE) | 2026-09-26 |
| Platform availability *(optional)* | ⬜ Not checked | _Are the listed platforms the ones the provider supports?_ | — | — |
| Open-source status *(optional)* | ⬜ Not checked | _Is the source genuinely published under an open-source licence?_ | — | — |

### Thunderbird `thunderbird`

**Checks started, free status not yet confirmed** · shown on the site as Unverified · 1/10 required checks confirmed · last checked 2026-09-26 · checked by agent-assisted pass — awaiting maintainer review

| Check | Result | Evidence | Source | Read on |
| --- | --- | --- | --- | --- |
| Free status | ⬜ Not checked | _Does the provider's own documentation support the free-status classification?_ | — | — |
| Free-tier limits | ⬜ Not checked | _What exactly does the free offering cap, and is that recorded?_ | — | — |
| Account requirement | ⬜ Not checked | _Can it be used without creating an account?_ | — | — |
| Credit-card requirement | ⬜ Not checked | _Is a payment method required to start using the free offering?_ | — | — |
| Commercial use | ⬜ Not checked | _Do the terms permit paid or business use of the free offering?_ | — | — |
| Personal use | ⬜ Not checked | _Do the terms permit personal, non-commercial use?_ | — | — |
| Licence | ⬜ Not checked | _Is the recorded licence the one the provider actually publishes?_ | — | — |
| Major limitations | ⬜ Not checked | _Are the significant limitations documented, including inconvenient ones?_ | — | — |
| Pricing information | ⬜ Not checked | _Where does the free/paid boundary sit, according to the provider?_ | — | — |
| Official URL | ✅ Confirmed | thunderbird.net is the project's own domain. The root address redirects temporarily to a page in the visitor's language, which loaded, so the language-neutral address is the right one to list. | [Thunderbird's own domain: answers 302 to a language-specific page (/en-US/ for an English request), which loads](https://www.thunderbird.net) | 2026-09-26 |
| Platform availability *(optional)* | ⬜ Not checked | _Are the listed platforms the ones the provider supports?_ | — | — |
| Open-source status *(optional)* | ⬜ Not checked | _Is the source genuinely published under an open-source licence?_ | — | — |

### VLC media player `vlc`

**Checks started, free status not yet confirmed** · shown on the site as Unverified · 1/10 required checks confirmed · last checked 2026-09-26 · checked by agent-assisted pass — awaiting maintainer review

| Check | Result | Evidence | Source | Read on |
| --- | --- | --- | --- | --- |
| Free status | ⬜ Not checked | _Does the provider's own documentation support the free-status classification?_ | — | — |
| Free-tier limits | ⬜ Not checked | _What exactly does the free offering cap, and is that recorded?_ | — | — |
| Account requirement | ⬜ Not checked | _Can it be used without creating an account?_ | — | — |
| Credit-card requirement | ⬜ Not checked | _Is a payment method required to start using the free offering?_ | — | — |
| Commercial use | ⬜ Not checked | _Do the terms permit paid or business use of the free offering?_ | — | — |
| Personal use | ⬜ Not checked | _Do the terms permit personal, non-commercial use?_ | — | — |
| Licence | ⬜ Not checked | _Is the recorded licence the one the provider actually publishes?_ | — | — |
| Major limitations | ⬜ Not checked | _Are the significant limitations documented, including inconvenient ones?_ | — | — |
| Pricing information | ⬜ Not checked | _Where does the free/paid boundary sit, according to the provider?_ | — | — |
| Official URL | ✅ Confirmed | videolan.org is the VideoLAN project's own domain and the VLC page loaded over HTTPS. The listing uses the trailing-slash address because the slashless one redirects to plain HTTP. | [VLC page on VideoLAN's own domain: returns 200 over HTTPS at this address; the address without the trailing slash answers 301 to http://www.videolan.org/vlc/](https://www.videolan.org/vlc/) | 2026-09-26 |
| Platform availability *(optional)* | ⬜ Not checked | _Are the listed platforms the ones the provider supports?_ | — | — |
| Open-source status *(optional)* | ⬜ Not checked | _Is the source genuinely published under an open-source licence?_ | — | — |

---

Automation can generate this list, check links and flag stale dates. It cannot decide that anything is
free, and it cannot mark anything verified — both need a person reading the provider's own pages.
