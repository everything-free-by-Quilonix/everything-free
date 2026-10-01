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
| Resources | 726 |
| Verified (signed off by a maintainer) | 0 |
| Evidence complete, awaiting maintainer sign-off | 4 |
| Partially verified (free status confirmed, checklist incomplete) | 2 |
| Checks started, free status not yet confirmed | 4 |
| Not verified yet (no checks recorded) | 716 |

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
| 0 A.D. `0-ad` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| 7-Zip `seven-zip` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Actual Budget `actual-budget` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| addy.io `addy-io` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| AdGuard Home `adguard-home` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Aegis Authenticator `aegis-authenticator` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| AFFiNE `affine` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Aider `aider` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Akaunting `akaunting` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Alacritty `alacritty` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Anki `anki` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| AnkiDroid `ankidroid` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Ansible `ansible` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| AntennaPod `antennapod` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Apache NetBeans `apache-netbeans` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Apache Superset `apache-superset` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| AppFlowy `appflowy` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Ardour `ardour` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Arduino IDE `arduino-ide` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| ArmorPaint `armorpaint` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Astro `astro` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Audacity `audacity` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Avogadro `avogadro` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| axe-core `axe-core` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Bark `bark` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Baserow `baserow` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| bat `bat` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Beekeeper Studio Community `beekeeper-studio` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Bespoke Synth `bespoke-synth` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Bevy `bevy` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Bioconductor `bioconductor` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Biome `biome` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Biopython `biopython` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Bitwarden `bitwarden` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| BleachBit `bleachbit` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Bonsai BIM `bonsai-bim` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| BookStack `bookstack` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Boxicons `boxicons` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Brave `brave` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Breezy Weather `breezy-weather` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| BRL-CAD `brl-cad` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Bruno `bruno` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Bun `bun` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Caddy `caddy` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Cal.com `cal-com` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| calibre `calibre` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Cantera `cantera` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Carbon `carbon` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Catima `catima` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Celestia `celestia` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Chatwoot `chatwoot` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Chroma `chroma` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| CloudCompare `cloudcompare` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| CMake `cmake` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| ComfyUI `comfyui` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Continue `continue-dev` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Coq `coq` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Cryptomator `cryptomator` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| CryptPad `cryptpad` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| curl `curl` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| CyberChef `cyberchef` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Cyberduck `cyberduck` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Cytoscape `cytoscape` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Czkawka `czkawka` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| darktable `darktable` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Dasher `dasher` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| DB Browser for SQLite `sqlite-browser` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| DBeaver Community `dbeaver-community` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Defold `defold` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Deno `deno` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Deskreen `deskreen` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| DevToys `devtoys` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| digiKam `digikam` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Discourse `discourse` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Django `django` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Docusaurus `docusaurus` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| DocuSeal `docuseal` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| draw.io `drawio` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| drip `drip` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Duplicati `duplicati` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Dust3D `dust3d` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| DWSIM `dwsim` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Eclipse IDE `eclipse-ide` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Element `element` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Elmer FEM `elmer-fem` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| EnergyPlus `energyplus` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Ensembl `ensembl` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| EPANET `epanet` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| ERPNext `erpnext` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| ESLint `eslint` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| eSpeak NG `espeak-ng` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| EspoCRM `espocrm` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Excalidraw `excalidraw` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Exercism `exercism` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| F-Droid `f-droid` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Falstad Circuit Simulator `falstad-circuit` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| farmOS `farmos` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| FastAPI `fastapi` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| fd `fd` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Feather Icons `feather-icons` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Feeder `feeder` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| FFmpeg `ffmpeg` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Fiji `fiji` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| FileZilla `filezilla` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Firefly III `firefly-iii` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Firefox `firefox` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Fish `fish-shell` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Flameshot `flameshot` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Flask `flask` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Flowblade `flowblade` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Focalboard `focalboard` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| FontForge `fontforge` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Forgejo `forgejo` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Formbricks `formbricks` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Fossify Calendar `fossify-calendar` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Fossify Contacts `fossify-contacts` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Fossify Gallery `fossify-gallery` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Fossify SMS Messenger `fossify-sms` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Frappe HR `frappe-hr` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| FreeCAD `freecad` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Freeplane `freeplane` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Freesound `freesound` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| GCompris `gcompris` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| GDAL `gdal` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| GDevelop `gdevelop` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| GeoServer `geoserver` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Ghidra `ghidra` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Ghost `ghost` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Git `git` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Gitea `gitea` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| GitLab Community Edition `gitlab-community-edition` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Glaxnimate `glaxnimate` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| GNU Octave `gnu-octave` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| GNU PSPP `gnu-pspp` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| GNU Radio `gnuradio` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| GnuCash `gnucash` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Gnumeric `gnumeric` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Godot Engine `godot` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Grafana `grafana` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| GrapheneOS `grapheneos` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| GRASS GIS `grass-gis` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Gretl `gretl` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Grist `grist` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| GROMACS `gromacs` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| HandBrake `handbrake` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Haystack `haystack` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| HedgeDoc `hedgedoc` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Helix `helix` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Helm `helm` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Heroicons `heroicons` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Home Assistant `home-assistant` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Hoppscotch `hoppscotch` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Horilla HRMS `horilla` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Hydrogen `hydrogen` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| ImageMagick `imagemagick` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Immich `immich` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| IndicTrans2 `indictrans2` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Inkscape `inkscape` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Insomnia `insomnia` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Inter `inter-font` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Invoice Ninja `invoice-ninja` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| InvokeAI `invokeai` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Jalview `jalview` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Jan `jan` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| JASP `jasp` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Jellyfin `jellyfin` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Jest `jest` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Jitsi Meet `jitsi-meet` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Jmol `jmol` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Joplin `joplin` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| JOSM `josm` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| jq `jq` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| JSON Crack `json-crack` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Julia Programming Language `julia-lang` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| JupyterLab `jupyterlab` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| K-9 Mail `k9-mail` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| k3s `k3s` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| k6 `k6` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| K9s `k9s` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Kannada Wikisource `wikisource-kannada` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| KDE Connect `kde-connect` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Kdenlive `kdenlive` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| KeePassDX `keepassdx` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Keycloak `keycloak` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Keyman `keyman` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| KiCad `kicad` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Kiwix `kiwix` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Kodi `kodi` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Kolibri `kolibri` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Kresus `kresus` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Krita `krita` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| LangChain `langchain` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| LazyGit `lazygit` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Leaflet `leaflet` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Lean `lean` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Leantime `leantime` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| LibreCAD `librecad` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| LibrePCB `librepcb` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| LibreWolf `librewolf` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Lichess `lichess` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| listmonk `listmonk` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| LiteLLM `litellm` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Lively Wallpaper `lively-wallpaper` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| llama.cpp `llama-cpp` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| LlamaIndex `llamaindex` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| LMMS `lmms` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| LobeChat `lobe-chat` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| LocalAI `localai` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| LocalSend `localsend` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Locust `locust` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Logseq `logseq` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| LosslessCut `losslesscut` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| LÖVE `love2d` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Lucide `lucide` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| MariaDB `mariadb` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Markor `markor` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Marp `marp` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Matomo `matomo` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Matrix `matrix-org` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Mattermost `mattermost` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Maxima `maxima` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Mealie `mealie` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Meilisearch `meilisearch` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Mermaid Live Editor `mermaid-live-editor` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| MeshLab `meshlab` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Metabase `metabase` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Milvus `milvus` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| MinIO `minio` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| mitmproxy `mitmproxy` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Mixxx `mixxx` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| MkDocs `mkdocs` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Mockoon `mockoon` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| MoneyWallet `moneywallet` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| mpv `mpv` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Mullvad Browser `mullvad-browser` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| MuseScore `musescore` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Natron `natron` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Neovim `neovim` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| NewPipe `newpipe` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Nextcloud `nextcloud` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| NGSPICE `ngspice` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Ninja `ninja-build` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Nix `nix` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Nmap `nmap` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| NocoDB `nocodb` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Node.js `nodejs` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Noto fonts `noto-fonts` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| NVDA `nvda` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Odoo Community `odoo-community` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| ONLYOFFICE Desktop Editors `onlyoffice-desktop-editors` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| ONNX Runtime `onnx-runtime` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Open Babel `open-babel` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Open Food Facts `open-food-facts` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Open Interpreter `open-interpreter` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Open Tree of Life `open-tree-of-life` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Open WebUI `open-webui` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Open-Elevation `open-elevation` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| OpenAlex `openalex` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| OpenDSS `opendss` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| OpenDyslexic `opendyslexic` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| OpenFAST `openfast` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| OpenFOAM `openfoam` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| OpenHRMS `openhrms` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| OpenLayers `openlayers` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| OpenModelica `openmodelica` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| OpenProject `openproject` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| OpenRefine `openrefine` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| OpenSCAD `openscad` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| OpenSees `opensees` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| OpenShot `openshot` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| OpenTofu `opentofu` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| OpenToonz `opentoonz` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Openverse `openverse` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| OptiKey `optikey` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Orca `orca` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Organic Maps `organic-maps` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| OsmAnd `osmand` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| OWASP ZAP `owasp-zap` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Pa11y `pa11y` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Paisa `paisa` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Pandoc `pandoc` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Paperless-ngx `paperless-ngx` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| PeaZip `peazip` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| PeerTube `peertube` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Pencil2D `pencil2d` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Penpot `penpot` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| pgAdmin 4 `pgadmin` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Phaser `phaser` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Phosphor Icons `phosphor-icons` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Pi-hole `pi-hole` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Piper `piper-tts` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Pixelorama `pixelorama` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Plane `plane` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Playwright `playwright` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Podman `podman` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Portmaster `portmaster` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| PostGIS `postgis` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| PostGraphile `postgraphile` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| PostgreSQL `postgresql` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Prettier `prettier` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| PrusaSlicer `prusa-slicer` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| PyMOL Open-Source `pymol-open-source` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Python `python` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| PyTorch `pytorch` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| QCAD Community Edition `qcad-community` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Qdrant `qdrant` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| QGIS `qgis` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Quarto `quarto` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Qucs-S `qucs-s` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| R `r-project` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| RabbitMQ `rabbitmq` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Radiance `radiance` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Rasa `rasa` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| RawTherapee `rawtherapee` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| raylib `raylib` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| rclone `rclone` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Reactive Resume `reactive-resume` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Read Aloud `read-aloud` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Redmine `redmine` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| RedReader `redreader` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Remix Icon `remix-icon` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Remmina `remmina` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Ren'Py `renpy` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Revolt `revolt` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| ripgrep `ripgrep` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| RStudio Desktop `rstudio-desktop` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Rufus `rufus` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| RustDesk `rustdesk` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| SAGA GIS `saga-gis` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| SageMath `sagemath` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| scikit-learn `scikit-learn` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Scilab `scilab` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Scribus `scribus` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Sentence Transformers `sentence-transformers` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| ShareX `sharex` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Shotcut `shotcut` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Sigil `sigil` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Signal `signal` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Simple Icons `simple-icons` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| SimpleLogin `simplelogin` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| SimpleScreenRecorder `simplescreenrecorder` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| SimulIDE `simulide` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Siril `siril` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Slidev `slidev` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| SMC Malayalam fonts `smc-malayalam-fonts` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| SolveSpace `solvespace` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| SoundConverter `soundconverter` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Sozi `sozi` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| spaCy `spacy` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| SQLite `sqlite` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Squoosh `squoosh` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Stable Diffusion WebUI `sd-webui` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Standard Notes `standard-notes` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Starship `starship` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Stellarium `stellarium` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Storybook `storybook` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| StoryWeaver `storyweaver` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Strawberry Music Player `strawberry-music-player` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Subtitle Edit `subtitle-edit` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| SuiteCRM `suitecrm` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| SumatraPDF `sumatra-pdf` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Surge XT `surge-xt` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| SVGOMG `svgomg` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Swagger Editor `swagger-editor` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Sweet Home 3D `sweet-home-3d` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| SWMM `swmm` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| SymPy `sympy` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Syncthing `syncthing` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Synfig Studio `synfig` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Tabler Icons `tabler-icons` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Taiga `taiga` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| TensorFlow `tensorflow` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Tesseract OCR `tesseract-ocr` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Text Generation WebUI `text-generation-webui` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| The League of Moveable Type `the-league-of-moveable-type` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Thorium Reader `thorium-reader` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Tiled `tiled` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Tor Browser `tor-browser` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Traefik `traefik` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Transformers `transformers` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Transformers.js `transformers-js` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Trilium Notes `trilium-notes` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Trivy `trivy` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Tusky `tusky` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Tux Paint `tuxpaint` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| TuxGuitar `tuxguitar` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Twenty `twenty-crm` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Twine `twine` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Typst `typst` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| uBlock Origin `ublock-origin` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| UGENE `ugene` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| UltiMaker Cura `ultimaker-cura` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Upscayl `upscayl` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Uptime Kuma `uptime-kuma` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Valgrind `valgrind` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Valkey `valkey` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Vaultwarden `vaultwarden` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| VCV Rack Free `vcv-rack-free` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Ventoy `ventoy` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| VeraCrypt `veracrypt` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Vikunja `vikunja` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Vitest `vitest` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| vLLM `vllm` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| VSCodium `vscodium` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Webots `webots` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| WezTerm `wezterm` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| wger `wger` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Whisper `whisper` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| whisper.cpp `whisper-cpp` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Wikidata `wikidata` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Wikimedia Commons `wikimedia-commons` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Wikisource `wikisource` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Wings 3D `wings3d` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| WireGuard `wireguard` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Wireshark `wireshark` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| WordPress.org `wordpress-org` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Yaak `yaak` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Zed `zed` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Zenodo `zenodo` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Zotero `zotero` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Zrythm `zrythm` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Zulip `zulip` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |

### 5. Likely to go out of date

Free tiers, trials, limited and personal-use offerings change with the vendor's pricing decisions, so their claims decay fastest.

| Resource | Status | Required checks confirmed | Remaining | Last checked | Checked by | Next action |
| --- | --- | --- | --- | --- | --- | --- |
| Airtable `airtable` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Asana `asana` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Auth0 `auth0` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| axe DevTools `axe-devtools` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| BandLab `bandlab` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| BBC Sound Effects `bbc-sound-effects` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Calendly `calendly` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Canva `canva` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Carrd `carrd` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| ChatGPT `chatgpt` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Claude `claude` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Clerk `clerk` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Clockify `clockify` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Cloudflare `cloudflare` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Coda `coda` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| CodeSandbox `codesandbox` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Datawrapper `datawrapper` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Duolingo `duolingo` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Figma `figma` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Firebase `firebase` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| FutureLearn `futurelearn` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Gemini Notebook (formerly NotebookLM) `gemini-notebook` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| GitHub `github` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| GitHub Actions `github-actions` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| GitHub Copilot Free `github-copilot-free` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Glitch `glitch` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Google AI Studio `google-ai-studio` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Google Colab `google-colab` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Google Docs, Sheets and Slides `google-docs-editors` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Google Earth `google-earth` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Google Earth Engine `google-earth-engine` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Google Gemini `google-gemini` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| HTTPie Desktop `httpie-desktop` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| HubSpot Free Tools `hubspot-free-tools` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Hugging Face `hugging-face` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Koyeb `koyeb` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| LanguageTool `languagetool` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| LTspice `ltspice` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Mailchimp `mailchimp` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Mappls `mappls` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Microsoft 365 for the web (free) `microsoft-365-web` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Miro `miro` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Mural `mural` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Neon `neon` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Netlify `netlify` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| ngrok `ngrok` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Notion `notion` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Onshape Free Plan `onshape-free` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Overleaf `overleaf` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Photopea `photopea` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Pocket Casts `pocket-casts` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| PostHog `posthog` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Proton Mail `proton-mail` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Proton VPN `proton-vpn` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| ReadEra `readera` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| remove.bg `remove-bg` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Render `render` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Resend `resend` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Rows `rows` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Sentry `sentry` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Shodan Free Tier `shodan-free` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Sketchfab Free 3D Models `sketchfab-free` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| StackBlitz `stackblitz` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Tailscale `tailscale` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Tally `tally` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| TinyPNG `tinypng` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Toggl Track `toggl-track` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Transit `transit` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| TrebEdit `treb-edit` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Trello `trello` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Turso `turso` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Tuta Mail `tuta-mail` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Upstash `upstash` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Vercel `vercel` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Wanderlog `wanderlog` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Windy `windy` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| XnView MP `xnview-mp` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Zoho Free Tools `zoho-free-suite` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |

### 6. Remaining

Everything else not yet verified.

| Resource | Status | Required checks confirmed | Remaining | Last checked | Checked by | Next action |
| --- | --- | --- | --- | --- | --- | --- |
| 1.1.1.1 DNS `cloudflare-dns` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Academic Earth `academic-earth` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| African Journals Online `ajol` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| African Storybook `african-storybook` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Agmarknet `agmarknet` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Aksharamukha `aksharamukha` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Alar `alar` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Allen Brain Map `allen-brain-map` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| AlphaFold Protein Structure Database `alphafold-protein-structure-database` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| ambientCG `ambient-cg` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Art Institute of Chicago Open Access `art-institute-chicago` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| arXiv `arxiv` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Autodesk Tinkercad `tinkercad` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Be My Eyes `be-my-eyes` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Bharat Skills `bharat-skills` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Bharatavani Portal `bharatavani` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| BHASHINI `bhashini` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Bhuvan `bhuvan` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Biodiversity Heritage Library `biodiversity-heritage-library` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Bookboon `bookboon` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| BrowserLeaks `browserleaks` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| ccMixter `ccmixter` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| CERN Open Data Portal `cern-open-data` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| CGIAR Open Access `cgiar-open-access` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| ChemRxiv `chemrxiv` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| ChemSpider `chemspider` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Chrome Music Lab `chrome-music-lab` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| CiNii Research `cinii-research` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| CircuitVerse `circuitverse` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| CK-12 `ck-12` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Climate TRACE `climate-trace` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Cologne Digital Sanskrit Dictionaries `cologne-sanskrit-dictionaries` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Color Oracle `color-oracle` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Colour Contrast Analyser `colour-contrast-analyser` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Consortium for Educational Communication `cec-ugc` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Coolors `coolors` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Copernicus Browser `copernicus-browser` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Copernicus Climate Data Store `copernicus-climate-data-store` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| CORE `core-ac-uk` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Crontab Guru `crontab-guru` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Crossref `crossref` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| CS50 `cs50` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| CSIR NIScPR Journals `csir-niscpr` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| DaFont `dafont-free` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| data.europa.eu `data-europa-eu` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| David Rumsey Map Collection `david-rumsey-map-collection` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Desmos Graphing Calculator `desmos-calculator` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Diffchecker `diffchecker` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| DigiLocker `digilocker` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Digital Earth Africa `digital-earth-africa` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Digital Public Library of America `digital-public-library-america` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| DIKSHA `diksha` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Directory of Open Access Journals `doaj` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| DNS Leak Test `dnsleaktest` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| DOAB `doab` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| e-PG Pathshala `e-pg-pathshala` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| e-ShodhSindhu `e-shodh-sindhu` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Edraak `edraak` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| eGyanKosh `ignou-egyankosh` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| EMSC `emsc-csem` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| eNAM `enam` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Europeana `europeana` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| FAOSTAT `faostat` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Font Meme `fontmeme` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Font Squirrel `font-squirrel` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| foobar2000 `foobar2000` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Forvo `forvo` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| FOSSEE `fossee` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| freeCodeCamp `freecodecamp` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| FreeConvert `free-pdf-convert` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Full Stack Open `full-stack-open` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Gallica `gallica` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| GenBank `ncbi-genbank` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| GeoGebra `geogebra` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| GeoNames `geonames` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Global Biodiversity Information Facility `gbif` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Global Fishing Watch `global-fishing-watch` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Google Fonts `google-fonts` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Google Search Console `google-search-console` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Gyandarshan `gyandarshan` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| HAL Open Science `hal-science` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Harvard Online Free Courses `harvard-online-free` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Have I Been Pwned `haveibeenpwned` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Hindwi `hindwi` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| HTML5 UP `html5-up` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| iFixit `ifixit` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| IMSLP `imslp` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| iNaturalist `inaturalist` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Income Tax e-Filing portal `income-tax-e-filing` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Incompetech `incompetech` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| India Meteorological Department `india-meteorological-department` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Indian Academy of Sciences Journals `ias-open-access` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Internet Archive `internet-archive` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Kaggle `kaggle` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Kanaja Digital Knowledge Treasury `kanaja` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Karnataka Open Data `data-karnataka` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Kenney Assets `kenney-assets` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| LaTeX Templates `latex-templates` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Let's Encrypt `lets-encrypt` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| LibreTexts `libretexts` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| LibriVox `librivox` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| LM Studio `lm-studio` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Malayalam Lexicon `malayalam-lexicon` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Manager.io Desktop `manager-io` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| MDN Web Docs `mdn-web-docs` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| MedlinePlus `medlineplus` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| MIT App Inventor `mit-app-inventor` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| MIT OpenCourseWare `mit-opencourseware` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Mixkit `mixkit` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Mozilla Common Voice `mozilla-common-voice` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Muktabodha `muktabodha` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| NASA APOD `nasa-apod` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| NASA Image and Video Library `nasa-images` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| NASA Open Data Portal `nasa-open-data` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| NASA POWER `nasa-power` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| National Career Service `national-career-service` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| National Digital Library of India `national-digital-library-india` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Natural Earth `natural-earth` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| NCERT e-Books `ncert-books` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| NPTEL `nptel` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Octopart `octopart` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| OEIS `oeis` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| OER Commons `oer-commons` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Olam `olam` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Open Culture `open-culture` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Open Education Global `open-education-global` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Open Government Data Platform India `data-gov-in` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Open Textbook Library `open-textbook-library` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Open Yale Courses `open-yale-courses` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Open-Meteo `open-meteo` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Openclipart `openclipart` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| OpenLearn `openlearn` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| OpenStax `openstax` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| OpenStreetMap `openstreetmap` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Our World in Data `our-world-in-data` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| PDF24 Tools `pdf24-tools` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Persée `persee` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Pexels `pexels` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| PhET Interactive Simulations `phet` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Pixabay `pixabay` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Pl@ntNet `plantnet` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Poly Haven `poly-haven` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Poly Pizza `poly-pizza` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| PriceHistory.app `pricehistory` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Project Euler `project-euler` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Project Gutenberg `project-gutenberg` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Project Madurai `project-madurai` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Protein Data Bank in Europe `pdbe` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| PubChem `pubchem` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| PubMed Central `pubmed-central` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Quad9 `quad9-dns` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| RCSB Protein Data Bank `rcsb-pdb` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Redalyc `redalyc` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Regex101 `regex101` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Registry of Open Data on AWS `registry-open-data-aws` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Rekhta `rekhta` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Sakshat `sakshat` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Samarth `samarth` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| SATHEE `sathee` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Saylor Academy `saylor-academy` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| SciELO `scielo` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Scratch `scratch` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Seeing AI `seeing-ai` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Shodhganga `shodhganga` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| ShodhGangotri `shodhgangotri` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Shutter Encoder `shutter-encoder` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Siyavula open textbooks `siyavula-open-textbooks` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Smithsonian Open Access `smithsonian-open-access` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| SoilGrids `soilgrids` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Spoken Tutorial `spoken-tutorial` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Standard Ebooks `standard-ebooks` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Stanford Online Free Courses `stanford-online-free` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| STRING Database `string-db` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Surveillance Self-Defense `eff-surveillance-self-defense` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| SVG Repo `svg-repo` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| SWAYAM `swayam` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| SWAYAM PRABHA `swayam-prabha` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Tamil Virtual Academy `tamil-virtual-academy` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| The Man in Seat 61 `the-man-in-seat-61` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| The Met Open Access `met-open-access` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| The Odin Project `the-odin-project` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Traditional Knowledge Digital Library `tkdl-portal` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Trove `trove` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| TU Delft OpenCourseWare `tu-delft-ocw` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| UGC MOOCs `ugc-moocs` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| UNdata `un-data` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| unDraw `undraw` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| UniProt `uniprot` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Unsplash `unsplash` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| urlscan.io `urlscan-io` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| USDA FoodData Central `usda-fooddata-central` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| USGS EarthExplorer `usgs-earthexplorer` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| VESTA `vesta` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Vidwan `vidwan` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Vimarsh Portal `vimarsh-portal` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Virtual Labs `virtual-labs` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| VirusTotal `virustotal` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| W3Schools `w3schools` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| WAVE Web Accessibility Evaluation Tool `wave-accessibility-tool` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| WHO Global Health Observatory `who-gho` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Wikipedia `wikipedia` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Wikivoyage `wikivoyage` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Wiktionary `wiktionary` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Wolfram Alpha `wolfram-alpha` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Wolfram MathWorld `wolfram-mathworld` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| World Bank Open Data `world-bank-open-data` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| World Digital Library `world-digital-library` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| WorldClim `worldclim` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Wormhole `wormhole` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |
| Zerodha Varsity `zerodha-varsity` | Unverified | 0/10 | All | never | — | Start a verification pass (begin with Free status) |

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
