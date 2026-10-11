import type { Resource, VerificationCheck, VerificationCheckRecord } from "@/types/resource";

import type { ResearchSource } from "../entertainment/define-media";
import { defineResearchedList } from "./define-researched";

/**
 * Expansion batch: self-hostable and desktop open-source projects that circulate
 * widely in developer and homelab videos. Every value below comes from the
 * project's own GitHub repository (repo page, README, LICENSE) or official site,
 * read on 2026-10-11. Star counts are deliberately not recorded.
 */

const DATE = "2026-10-11";
const ok = (check: VerificationCheck, sourceUrl: string, evidence: string): VerificationCheckRecord => ({
  check,
  result: "confirmed",
  evidence,
  sourceUrl,
});
const src = (url: string, label: string): ResearchSource => ({ url, label });

/* Dokploy */
const DOKPLOY_REPO = "https://github.com/Dokploy/dokploy";
const DOKPLOY_README = "https://raw.githubusercontent.com/Dokploy/dokploy/canary/README.md";
const DOKPLOY_LICENSE = "https://raw.githubusercontent.com/Dokploy/dokploy/canary/LICENSE.MD";

/* ZITADEL */
const ZITADEL_REPO = "https://github.com/zitadel/zitadel";
const ZITADEL_README = "https://raw.githubusercontent.com/zitadel/zitadel/main/README.md";

/* Pocket ID */
const POCKETID_REPO = "https://github.com/pocket-id/pocket-id";
const POCKETID_README = "https://raw.githubusercontent.com/pocket-id/pocket-id/main/README.md";
const POCKETID_LICENSE = "https://raw.githubusercontent.com/pocket-id/pocket-id/main/LICENSE";

/* Netdata */
const NETDATA_REPO = "https://github.com/netdata/netdata";
const NETDATA_README = "https://raw.githubusercontent.com/netdata/netdata/master/README.md";

/* Beszel */
const BESZEL_REPO = "https://github.com/henrygd/beszel";
const BESZEL_README = "https://raw.githubusercontent.com/henrygd/beszel/main/readme.md";

/* Dozzle */
const DOZZLE_REPO = "https://github.com/amir20/dozzle";
const DOZZLE_README = "https://raw.githubusercontent.com/amir20/dozzle/master/README.md";

/* Gatus */
const GATUS_REPO = "https://github.com/TwiN/gatus";
const GATUS_README = "https://raw.githubusercontent.com/TwiN/gatus/master/README.md";
const GATUS_LICENSE = "https://raw.githubusercontent.com/TwiN/gatus/master/LICENSE";

/* Homepage */
const HOMEPAGE_REPO = "https://github.com/gethomepage/homepage";
const HOMEPAGE_README = "https://raw.githubusercontent.com/gethomepage/homepage/dev/README.md";
const HOMEPAGE_LICENSE = "https://raw.githubusercontent.com/gethomepage/homepage/dev/LICENSE";

/* Homarr */
const HOMARR_REPO = "https://github.com/homarr-labs/homarr";

/* PowerToys */
const POWERTOYS_REPO = "https://github.com/microsoft/PowerToys";
const POWERTOYS_README = "https://raw.githubusercontent.com/microsoft/PowerToys/main/README.md";

/* qBittorrent */
const QBT_SITE = "https://www.qbittorrent.org/";
const QBT_REPO = "https://github.com/qbittorrent/qBittorrent";
const QBT_COPYING = "https://raw.githubusercontent.com/qbittorrent/qBittorrent/master/COPYING";

/* Portainer CE */
const PORTAINER_REPO = "https://github.com/portainer/portainer";
const PORTAINER_README = "https://raw.githubusercontent.com/portainer/portainer/develop/README.md";

/* Kopia */
const KOPIA_REPO = "https://github.com/kopia/kopia";
const KOPIA_README = "https://raw.githubusercontent.com/kopia/kopia/master/README.md";
const KOPIA_INSTALL = "https://kopia.io/docs/installation/";

/* restic */
const RESTIC_REPO = "https://github.com/restic/restic";
const RESTIC_README = "https://raw.githubusercontent.com/restic/restic/master/README.md";

/* Nginx Proxy Manager */
const NPM_REPO = "https://github.com/NginxProxyManager/nginx-proxy-manager";
const NPM_README = "https://raw.githubusercontent.com/NginxProxyManager/nginx-proxy-manager/develop/README.md";
const NPM_LICENSE = "https://raw.githubusercontent.com/NginxProxyManager/nginx-proxy-manager/develop/LICENSE";

/* Headscale */
const HEADSCALE_REPO = "https://github.com/juanfont/headscale";
const HEADSCALE_README = "https://raw.githubusercontent.com/juanfont/headscale/main/README.md";
const HEADSCALE_LICENSE = "https://raw.githubusercontent.com/juanfont/headscale/main/LICENSE";

export const developerGithub1Resources: Resource[] = defineResearchedList([
  {
    slug: "dokploy",
    name: "Dokploy",
    shortDescription: "Self-hostable platform for deploying apps and databases on your own VPS, with Docker Compose and Traefik.",
    longDescription:
      "Dokploy is a self-hostable Platform as a Service that deploys applications (Node.js, PHP, Python, Go, Ruby and more) and manages MySQL, PostgreSQL, MongoDB, MariaDB, libsql and Redis databases. It supports Docker Compose, multi-node clusters through Docker Swarm, automated database backups and one-click templates. The code is Apache-2.0, except anything under a /proprietary directory; a hosted Dokploy Cloud is offered separately.",
    whyListed: "A self-hosted alternative to managed app platforms for anyone who already rents a VPS.",
    category: "deployment",
    resourceType: "DEVELOPER_TOOL",
    officialUrl: DOKPLOY_REPO,
    sourceUrl: DOKPLOY_REPO,
    freeStatus: "OPEN_SOURCE",
    openSource: true,
    license: "Apache-2.0",
    platforms: ["SELF_HOSTED"],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "unknown",
    personalUse: "unknown",
    limitations: [
      "Content under a /proprietary directory, if present, is under a separate proprietary licence rather than Apache-2.0",
      "You supply and pay for the server it runs on",
    ],
    features: [
      "Deploy applications in several languages",
      "Create and manage MySQL, PostgreSQL, MongoDB, MariaDB, libsql and Redis databases",
      "Automated database backups to external storage",
      "Native Docker Compose support and multi-node scaling with Docker Swarm",
      "Traefik integration for routing and load balancing",
      "Per-resource CPU, memory, storage and network monitoring",
    ],
    tags: ["paas", "docker", "self-hosted", "vps", "deployment"],
    research: {
      date: DATE,
      sources: [
        src(DOKPLOY_REPO, "GitHub repository page"),
        src(DOKPLOY_README, "README: description and feature list"),
        src(DOKPLOY_LICENSE, "LICENSE.MD: Apache-2.0 with proprietary-directory carve-out"),
      ],
      checks: [
        ok("OFFICIAL_URL", DOKPLOY_REPO, "Public repository Dokploy/dokploy, linked to dokploy.com."),
        ok("FREE_STATUS", DOKPLOY_README, "\"Dokploy is a free, self-hostable Platform as a Service (PaaS)\""),
        ok("LICENSE", DOKPLOY_LICENSE, "Content outside \"/proprietary\" directories \"is available under the 'Apache License 2.0' license\"."),
        ok("OPEN_SOURCE_STATUS", DOKPLOY_LICENSE, "Source published under Apache License 2.0 outside the proprietary directory."),
        ok("LIMITATIONS", DOKPLOY_LICENSE, "\"All content that resides under a '/proprietary' directory ... is licensed under the license defined in 'LICENSE_PROPRIETARY'.\""),
        ok("PLATFORM_AVAILABILITY", DOKPLOY_README, "\"Self-Hosted: Self-host Dokploy on your VPS.\""),
      ],
      notes: "Read the repo page, README and LICENSE.MD. Dokploy Cloud pricing was not checked; this listing covers the self-hosted software only.",
    },
  },
  {
    slug: "zitadel",
    name: "ZITADEL",
    shortDescription: "Open-source identity and access management with SSO, MFA, passkeys, OIDC, SAML and SCIM. Self-hostable.",
    longDescription:
      "ZITADEL is an identity and access management platform covering single sign-on, multi-factor authentication, passkeys, OpenID Connect, SAML 2.0 and SCIM, with a multi-tenant model of organizations and projects. It can be self-hosted with Docker Compose or Kubernetes on PostgreSQL. The repository is AGPL-3.0, with Apache-2.0 and MIT exceptions for specific directories; a hosted ZITADEL Cloud is also offered.",
    whyListed: "A self-hostable option for adding sign-in and identity to your own apps without a per-user SaaS bill.",
    category: "authentication",
    resourceType: "DEVELOPER_TOOL",
    officialUrl: ZITADEL_REPO,
    sourceUrl: ZITADEL_REPO,
    freeStatus: "OPEN_SOURCE",
    openSource: true,
    license: "AGPL-3.0",
    platforms: ["SELF_HOSTED"],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "unknown",
    personalUse: "unknown",
    limitations: [
      "Self-hosting requires PostgreSQL 14 or later",
      "AGPL-3.0 obligations apply if you modify and offer it over a network",
    ],
    features: [
      "Single sign-on, username/password and passkeys (FIDO2/WebAuthn)",
      "MFA via OTP, U2F, email and SMS",
      "OpenID Connect and SAML 2.0, SCIM 2.0 server",
      "Multi-tenant organizations and projects",
      "gRPC, connectRPC and REST APIs",
      "Event-based audit trail",
    ],
    tags: ["identity", "sso", "oidc", "saml", "passkeys", "iam"],
    research: {
      date: DATE,
      sources: [
        src(ZITADEL_REPO, "GitHub repository page: AGPL-3.0 licence badge"),
        src(ZITADEL_README, "README: features, self-hosting, licence"),
      ],
      checks: [
        ok("OFFICIAL_URL", ZITADEL_REPO, "Public repository zitadel/zitadel, linked to zitadel.com."),
        ok("FREE_STATUS", ZITADEL_README, "\"ZITADEL is an open-source identity and access management platform\"; self-hosted via Docker Compose."),
        ok("LICENSE", ZITADEL_README, "\"AGPL-3.0 — see LICENSING.md for the full licensing policy, including Apache 2.0 and MIT exceptions for specific directories.\""),
        ok("OPEN_SOURCE_STATUS", ZITADEL_REPO, "Repository sidebar lists \"AGPL-3.0 license\"."),
        ok("PLATFORM_AVAILABILITY", ZITADEL_README, "Self-hosted deployment guides for Docker Compose and Kubernetes."),
        ok("LIMITATIONS", ZITADEL_README, "Deployment requires \"PostgreSQL (≥ 14)\"."),
      ],
      notes: "Read repo page and README. The README says ZITADEL Cloud can be started \"for free ... no credit card required\" with pay-as-you-go pricing; the Cloud plan was not checked and is not what this listing describes.",
    },
  },
  {
    slug: "pocket-id",
    name: "Pocket ID",
    shortDescription: "Self-hosted OpenID Connect and OAuth 2.0 provider that signs users in with passkeys only.",
    longDescription:
      "Pocket ID is an OpenID Connect Certified and OAuth 2.0 provider meant to be simpler than larger identity servers. It supports only passkey authentication, so there are no passwords; a hardware key such as a YubiKey can sign you in to self-hosted services. Docker is the recommended setup. It is released under the BSD 2-Clause licence.",
    whyListed: "A lightweight way to put passkey sign-in in front of your self-hosted apps.",
    category: "authentication",
    resourceType: "DEVELOPER_TOOL",
    officialUrl: POCKETID_REPO,
    sourceUrl: POCKETID_REPO,
    freeStatus: "OPEN_SOURCE",
    openSource: true,
    license: "BSD-2-Clause",
    platforms: ["SELF_HOSTED"],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "unknown",
    personalUse: "unknown",
    limitations: ["Only passkey authentication is supported; there is no password sign-in"],
    features: [
      "OpenID Connect Certified provider",
      "OAuth 2.0 support",
      "Passkey-only sign-in, including hardware security keys",
      "Docker-based setup",
    ],
    tags: ["oidc", "oauth", "passkeys", "self-hosted", "identity"],
    research: {
      date: DATE,
      sources: [
        src(POCKETID_README, "README: description and design goal"),
        src(POCKETID_LICENSE, "LICENSE: BSD 2-Clause"),
      ],
      checks: [
        ok("OFFICIAL_URL", POCKETID_README, "README of the pocket-id/pocket-id repository, linking demo and docs.pocket-id.org."),
        ok("FREE_STATUS", POCKETID_LICENSE, "BSD 2-Clause: redistribution and use in source and binary forms are permitted."),
        ok("LICENSE", POCKETID_LICENSE, "\"BSD 2-Clause License Copyright (c) 2024, Elias Schneider\""),
        ok("OPEN_SOURCE_STATUS", POCKETID_LICENSE, "Source published under the BSD 2-Clause licence."),
        ok("LIMITATIONS", POCKETID_README, "\"it only supports passkey authentication, which means you don't need a password\""),
        ok("PLATFORM_AVAILABILITY", POCKETID_README, "\"The easiest and recommended way is to use Docker.\""),
      ],
      notes: "Read raw README and LICENSE from the repository's main branch.",
    },
  },
  {
    slug: "netdata",
    name: "Netdata",
    shortDescription: "Real-time, per-second infrastructure monitoring agent with auto-discovery, alerts and ML anomaly detection.",
    longDescription:
      "Netdata is a monitoring agent that collects per-second metrics from systems, containers, VMs, applications and logs, with auto-generated dashboards, built-in alerts and unsupervised anomaly detection at the edge. The agent is GPL-3.0-or-later and runs on Linux, macOS, FreeBSD and Windows. The dashboard UI is closed-source but free to use, and Netdata Cloud is an optional closed-source service with free and paid tiers.",
    whyListed: "Detailed server monitoring that works without a central SaaS; Netdata Cloud is optional.",
    category: "monitoring",
    resourceType: "DEVELOPER_TOOL",
    officialUrl: NETDATA_REPO,
    sourceUrl: NETDATA_REPO,
    freeStatus: "OPEN_SOURCE",
    openSource: true,
    license: "GPL-3.0-or-later",
    platforms: ["LINUX", "MACOS", "WINDOWS", "SELF_HOSTED"],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "unknown",
    personalUse: "unknown",
    limitations: [
      "The Netdata UI is closed-source (free to use under its own licence); only the agent is GPL",
      "Netdata Cloud is closed-source with free and paid tiers",
      "Anonymous telemetry is on by default and can be disabled",
      "Several collectors (systemd services, network connections, containers) are Linux-only",
    ],
    features: [
      "Per-second metric collection with zero-configuration auto-discovery",
      "Unsupervised ML anomaly detection per metric",
      "Hundreds of built-in alerts with email, Slack, Telegram, Discord and more",
      "Tiered long-term storage",
      "Parent-child streaming for central dashboards",
      "Export to Prometheus, InfluxDB, Graphite and others",
    ],
    tags: ["observability", "metrics", "alerts", "servers", "docker"],
    research: {
      date: DATE,
      sources: [
        src(NETDATA_REPO, "GitHub repository page: GPL-3.0 licence badge"),
        src(NETDATA_README, "README: ecosystem, licences, platforms, FAQ"),
      ],
      checks: [
        ok("OFFICIAL_URL", NETDATA_REPO, "Public repository netdata/netdata, linked to www.netdata.cloud."),
        ok("FREE_STATUS", NETDATA_README, "\"Netdata Agent – Open-source core (GPLv3+).\""),
        ok("LICENSE", NETDATA_README, "Netdata Agent licence listed as \"GPL v3+\"."),
        ok("OPEN_SOURCE_STATUS", NETDATA_REPO, "Repository sidebar lists \"GPL-3.0 license\"."),
        ok("LIMITATIONS", NETDATA_README, "\"Netdata UI – Closed-source but free to use with Netdata Agent and Cloud.\" \"Netdata Cloud – Closed-source, with free and paid tiers.\""),
        ok("PLATFORM_AVAILABILITY", NETDATA_README, "Platforms badge: \"Linux | macOS | FreeBSD | Windows\"; installation guides for each."),
      ],
      notes: "Read repo page and README. The README says \"Netdata Cloud is optional\", but does not state outright that the agent needs no account, so requiresAccount stays unknown. Cloud tier limits not checked.",
    },
  },
  {
    slug: "beszel",
    name: "Beszel",
    shortDescription: "Lightweight server monitoring hub and agent with Docker stats, history, alerts and S.M.A.R.T. disk health.",
    longDescription:
      "Beszel is a server monitoring platform made of a hub (a web dashboard built on PocketBase) and an agent that runs on each monitored system. It records CPU, memory, disk, network, temperature, GPU and container metrics with history, sends configurable alerts, reads S.M.A.R.T. disk health, and supports multiple users, OAuth/OIDC and automatic backups to disk or S3-compatible storage. It is MIT-licensed.",
    whyListed: "A small, easy-to-run dashboard for keeping an eye on a few home or hobby servers.",
    category: "monitoring",
    resourceType: "DEVELOPER_TOOL",
    officialUrl: BESZEL_REPO,
    sourceUrl: BESZEL_REPO,
    freeStatus: "OPEN_SOURCE",
    openSource: true,
    license: "MIT",
    platforms: ["SELF_HOSTED"],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "unknown",
    personalUse: "unknown",
    limitations: ["An agent must be installed on every system you want to monitor"],
    features: [
      "Historical CPU, memory, disk, network and temperature metrics",
      "Per-container Docker and Podman stats",
      "Configurable alerts with many notification services",
      "S.M.A.R.T. disk health and drive-failure notifications",
      "Multi-user with OAuth/OIDC sign-in",
      "Automatic backups to disk or S3-compatible storage",
    ],
    tags: ["server-monitoring", "docker", "homelab", "alerts", "self-hosted"],
    research: {
      date: DATE,
      sources: [src(BESZEL_README, "README: features, architecture, licence")],
      checks: [
        ok("OFFICIAL_URL", BESZEL_README, "README of the henrygd/beszel repository; documentation at beszel.dev."),
        ok("FREE_STATUS", BESZEL_README, "\"Beszel is licensed under the MIT License.\""),
        ok("LICENSE", BESZEL_README, "\"Beszel is licensed under the MIT License. See the LICENSE file for more details.\""),
        ok("OPEN_SOURCE_STATUS", BESZEL_README, "MIT licence badge linking to the repository LICENSE file."),
        ok("LIMITATIONS", BESZEL_README, "\"Agent: Runs on each system you want to monitor and communicates system metrics to the hub.\""),
      ],
      notes: "Read raw README from the main branch.",
    },
  },
  {
    slug: "dozzle",
    name: "Dozzle",
    shortDescription: "Small web app for viewing Docker container logs live, with fuzzy, regex and SQL search. MIT-licensed.",
    longDescription:
      "Dozzle is a lightweight web application for watching Docker logs in real time. It does not store log files; it is built for live viewing, with fuzzy container search, regex and SQL log search, split-screen views, live CPU and memory stats, multi-user authentication, Swarm mode and an agent mode for several Docker hosts. The image is around 7 MB compressed. It is MIT-licensed.",
    whyListed: "A quick way to read container logs in a browser without setting up a full logging stack.",
    category: "monitoring",
    resourceType: "DEVELOPER_TOOL",
    officialUrl: DOZZLE_REPO,
    sourceUrl: DOZZLE_REPO,
    freeStatus: "OPEN_SOURCE",
    openSource: true,
    license: "MIT",
    platforms: ["SELF_HOSTED"],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "unknown",
    personalUse: "unknown",
    limitations: [
      "Does not store logs and does not support offline searching",
      "Collects anonymous configuration analytics via Google Analytics unless started with --no-analytics",
      "Requires Docker Engine 19.03 or newer",
    ],
    features: [
      "Live Docker log streaming in the browser",
      "Fuzzy container search, regex and SQL log search",
      "Split screen for multiple logs",
      "Live memory and CPU stats",
      "Swarm mode and agent mode for multiple hosts",
      "Works with Podman via its remote socket",
    ],
    tags: ["docker", "logs", "containers", "homelab", "self-hosted"],
    research: {
      date: DATE,
      sources: [src(DOZZLE_README, "README: features, analytics, licence")],
      checks: [
        ok("OFFICIAL_URL", DOZZLE_README, "README of the amir20/dozzle repository; site at dozzle.dev."),
        ok("FREE_STATUS", DOZZLE_README, "\"License: MIT\"; \"Dozzle is an open source project with no funding\"."),
        ok("LICENSE", DOZZLE_README, "License section: \"[MIT](LICENSE)\"."),
        ok("OPEN_SOURCE_STATUS", DOZZLE_README, "Described as \"an open source project\" under the MIT licence."),
        ok("LIMITATIONS", DOZZLE_README, "\"It doesn't store any log files\"; \"it doesn't support offline searching\"; analytics can be disabled with \"--no-analytics\"."),
      ],
      notes: "Read raw README from master.",
    },
  },
  {
    slug: "gatus",
    name: "Gatus",
    shortDescription: "Health dashboard that checks HTTP, TCP, ICMP, DNS and more against conditions and sends alerts.",
    longDescription:
      "Gatus is a developer-oriented status and health dashboard. It runs checks over HTTP, ICMP, TCP, UDP, DNS, SSH, TLS, gRPC and WebSocket, evaluates conditions on status code, response time, body and certificate expiry, and alerts through Slack, Discord, PagerDuty, Telegram, ntfy and many other providers. Configuration is a YAML file; storage can be memory, SQLite or PostgreSQL. It is Apache-2.0 licensed; a managed service is offered separately.",
    whyListed: "A config-file status page and uptime checker you can run on your own server.",
    category: "monitoring",
    resourceType: "DEVELOPER_TOOL",
    officialUrl: GATUS_REPO,
    sourceUrl: GATUS_REPO,
    freeStatus: "OPEN_SOURCE",
    openSource: true,
    license: "Apache-2.0",
    platforms: ["SELF_HOSTED"],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "unknown",
    personalUse: "unknown",
    limitations: [
      "Default in-memory storage does not survive a restart; configure SQLite or PostgreSQL to keep history",
      "Cannot be served from a sub-path such as example.org/status/",
    ],
    features: [
      "HTTP, ICMP, TCP, UDP, DNS, SSH, TLS, gRPC and WebSocket checks",
      "Conditions on status, response time, body, IP and certificate expiry",
      "Alerting to dozens of providers plus custom webhooks",
      "Uptime and response-time badges",
      "Prometheus metrics endpoint",
      "Maintenance windows and announcements",
    ],
    tags: ["uptime", "status-page", "health-checks", "alerts", "self-hosted"],
    research: {
      date: DATE,
      sources: [
        src(GATUS_README, "README: features, storage, deployment, FAQ"),
        src(GATUS_LICENSE, "LICENSE: Apache License 2.0"),
      ],
      checks: [
        ok("OFFICIAL_URL", GATUS_README, "README of the TwiN/gatus repository."),
        ok("FREE_STATUS", GATUS_LICENSE, "Apache License 2.0 grants a \"no-charge, royalty-free\" copyright licence."),
        ok("LICENSE", GATUS_LICENSE, "\"Apache License Version 2.0, January 2004\""),
        ok("OPEN_SOURCE_STATUS", GATUS_LICENSE, "Source published under the Apache License 2.0."),
        ok("LIMITATIONS", GATUS_README, "\"Because the data is stored in memory, the data will not survive a restart.\" \"it does not support path-based routing\"."),
      ],
      notes: "Read raw README and LICENSE from master. The README mentions a managed Gatus.io service; it was not checked.",
    },
  },
  {
    slug: "gethomepage",
    name: "Homepage (gethomepage)",
    shortDescription: "Static, YAML-configured dashboard for self-hosted services, with Docker discovery and 100+ widgets.",
    longDescription:
      "Homepage is an application dashboard generated statically at build time and configured with YAML files or Docker labels. It proxies all API calls to backend services so keys stay hidden, integrates with over 100 services, shows container status and stats, and includes weather, time, search and bookmark widgets in over 40 languages. Images are built for AMD64 and ARM64. It is GPL-3.0 licensed.",
    whyListed: "A popular start page for homelabs that pulls status from the services you already run.",
    category: "open-source",
    resourceType: "OPEN_SOURCE",
    officialUrl: HOMEPAGE_REPO,
    sourceUrl: HOMEPAGE_REPO,
    freeStatus: "OPEN_SOURCE",
    openSource: true,
    license: "GPL-3.0",
    platforms: ["SELF_HOSTED"],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "unknown",
    personalUse: "unknown",
    limitations: [
      "If reachable from an untrusted network it must sit behind a reverse proxy or VPN that enforces authentication; built-in login is opt-in",
    ],
    features: [
      "Statically generated for fast loads",
      "API requests proxied so keys stay hidden",
      "Docker label service discovery and container stats",
      "Over 100 service integrations",
      "Weather, time, date, search and bookmark widgets",
      "Support for over 40 languages",
    ],
    tags: ["dashboard", "homelab", "docker", "self-hosted", "start-page"],
    research: {
      date: DATE,
      sources: [
        src(HOMEPAGE_README, "README: features and security notice"),
        src(HOMEPAGE_LICENSE, "LICENSE: GNU GPL v3"),
      ],
      checks: [
        ok("OFFICIAL_URL", HOMEPAGE_README, "README of the gethomepage/homepage repository; docs at gethomepage.dev."),
        ok("FREE_STATUS", HOMEPAGE_LICENSE, "GNU General Public License Version 3 — a free, copyleft licence."),
        ok("LICENSE", HOMEPAGE_LICENSE, "\"GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007\""),
        ok("OPEN_SOURCE_STATUS", HOMEPAGE_LICENSE, "Source published under the GPL-3.0."),
        ok("LIMITATIONS", HOMEPAGE_README, "If reachable from an untrusted network it \"must sit behind a reverse proxy (and/or VPN) that enforces authentication\"."),
        ok("PLATFORM_AVAILABILITY", HOMEPAGE_README, "\"Images built for AMD64, ARM64.\"; Docker and from-source install."),
      ],
      notes: "Read raw README and LICENSE from the dev branch. LICENSE text does not say \"or later\", so recorded as GPL-3.0.",
    },
  },
  {
    slug: "homarr",
    name: "Homarr",
    shortDescription: "Drag-and-drop dashboard for self-hosted apps with 80+ integrations, user management and SSO. Apache-2.0.",
    longDescription:
      "Homarr is a self-hosted dashboard configured through a drag-and-drop grid rather than YAML. It integrates with self-hosted applications, has user management with permissions and groups, single sign-on through OIDC or LDAP, real-time widget updates and a built-in icon picker. It runs on common hardware including Raspberry Pi, and on Windows, Linux, TrueNAS and Unraid, with Helm support for Kubernetes. It is Apache-2.0 licensed.",
    whyListed: "A homelab dashboard for people who prefer clicking to editing config files.",
    category: "open-source",
    resourceType: "OPEN_SOURCE",
    officialUrl: HOMARR_REPO,
    sourceUrl: HOMARR_REPO,
    freeStatus: "OPEN_SOURCE",
    openSource: true,
    license: "Apache-2.0",
    platforms: ["SELF_HOSTED"],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "yes",
    personalUse: "unknown",
    limitations: ["Maintained by volunteers; there is no stated commercial support"],
    features: [
      "Drag-and-drop grid configuration, no YAML",
      "Integrations with self-hosted applications",
      "User management with permissions and groups",
      "Single sign-on via OIDC or LDAP",
      "Real-time widget updates",
      "Kubernetes support with Helm",
    ],
    tags: ["dashboard", "homelab", "self-hosted", "sso", "start-page"],
    research: {
      date: DATE,
      sources: [src(HOMARR_REPO, "GitHub repository page: README, Apache-2.0 badge")],
      checks: [
        ok("OFFICIAL_URL", HOMARR_REPO, "Public repository homarr-labs/homarr, linked to homarr.dev."),
        ok("FREE_STATUS", HOMARR_REPO, "\"Homarr is a free-to-use open source project maintained by volunteers\""),
        ok("LICENSE", HOMARR_REPO, "\"We publish under the Apache License 2.0 license which allows commercial usage.\""),
        ok("OPEN_SOURCE_STATUS", HOMARR_REPO, "Repository sidebar lists \"Apache-2.0 license\"."),
        ok("COMMERCIAL_USE", HOMARR_REPO, "\"Apache License 2.0 license which allows commercial usage\""),
        ok("PLATFORM_AVAILABILITY", HOMARR_REPO, "\"Compatible with any major consumer hardware (x86, Raspberry Pi, old laptops) and most OS (Windows, Linux, TrueNAS, Unraid)\""),
        ok("LIMITATIONS", HOMARR_REPO, "\"maintained by volunteers and developers from all over the world\""),
      ],
      notes: "Read the repository page (raw README path returned 404).",
    },
  },
  {
    slug: "microsoft-powertoys",
    name: "Microsoft PowerToys",
    shortDescription: "Microsoft's MIT-licensed set of 30+ Windows utilities: FancyZones, PowerRename, Color Picker and more.",
    longDescription:
      "PowerToys is a collection of over 30 utilities from Microsoft for customising Windows, including FancyZones window layouts, PowerRename bulk renaming, Color Picker, Text Extractor, Image Resizer, Keyboard Manager, Always on Top, Peek, Command Palette and ZoomIt. It installs from GitHub releases, the Microsoft Store or WinGet. The source is MIT-licensed.",
    whyListed: "Adds many small productivity tools to Windows from a single install.",
    category: "utilities",
    resourceType: "DESKTOP_APP",
    officialUrl: POWERTOYS_REPO,
    sourceUrl: POWERTOYS_REPO,
    freeStatus: "OPEN_SOURCE",
    openSource: true,
    license: "MIT",
    platforms: ["WINDOWS"],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "unknown",
    personalUse: "unknown",
    limitations: ["Windows only", "Logs basic diagnostic data (telemetry)"],
    features: [
      "FancyZones window layouts",
      "PowerRename bulk renaming",
      "Color Picker, Screen Ruler and Text Extractor",
      "Image Resizer and File Explorer add-ons",
      "Keyboard Manager and Mouse Without Borders",
      "Command Palette and PowerToys Run launchers",
    ],
    tags: ["windows", "productivity", "desktop", "microsoft"],
    research: {
      date: DATE,
      sources: [
        src(POWERTOYS_REPO, "GitHub repository page: MIT licence badge"),
        src(POWERTOYS_README, "README: utilities, installation, privacy"),
      ],
      checks: [
        ok("OFFICIAL_URL", POWERTOYS_REPO, "Public repository microsoft/PowerToys."),
        ok("FREE_STATUS", POWERTOYS_REPO, "Repository published under the MIT licence; installers on GitHub releases."),
        ok("LICENSE", POWERTOYS_REPO, "Repository sidebar lists \"MIT license\"."),
        ok("OPEN_SOURCE_STATUS", POWERTOYS_REPO, "Source on GitHub under MIT; contributions accepted under a CLA."),
        ok("PLATFORM_AVAILABILITY", POWERTOYS_README, "\"a collection of utilities that help you customize Windows\"; install via GitHub, Microsoft Store or WinGet."),
        ok("LIMITATIONS", POWERTOYS_README, "\"The application logs basic diagnostic data (telemetry).\""),
      ],
      notes: "Read repo page and raw README from main.",
    },
  },
  {
    slug: "qbittorrent",
    name: "qBittorrent",
    shortDescription: "Ad-free open-source BitTorrent client for Windows, macOS and Linux, with a Web UI and RSS support.",
    longDescription:
      "qBittorrent is a BitTorrent client written in C++/Qt on top of libtorrent-rasterbar. It has no ads and includes RSS feeds with download filters, a remote Web UI, sequential downloading, a bandwidth scheduler, a torrent creation tool, IP filtering and magnet, DHT and encryption support. It runs on Windows, Linux, macOS, FreeBSD and OS/2 in about 70 languages. Source is GPL-2.0-or-later; binaries are GPL-3.0-or-later.",
    whyListed: "An ad-free client for downloading Linux ISOs, open datasets and other legitimately shared files.",
    category: "utilities",
    resourceType: "DESKTOP_APP",
    officialUrl: QBT_SITE,
    sourceUrl: QBT_REPO,
    freeStatus: "OPEN_SOURCE",
    openSource: true,
    license: "GPL-2.0-or-later",
    platforms: ["WINDOWS", "MACOS", "LINUX"],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "unknown",
    personalUse: "unknown",
    limitations: [
      "Only use it for content you have the right to download and share",
      "Binary releases are under GPL-3.0-or-later because they bundle GPLv3+ assets",
    ],
    features: [
      "No ads",
      "RSS feeds with regex download filters",
      "Remote control through a Web UI",
      "Sequential downloading and bandwidth scheduler",
      "Torrent creation tool and IP filtering",
      "Magnet links, DHT, PEX and encrypted connections",
    ],
    tags: ["bittorrent", "downloads", "desktop", "p2p"],
    research: {
      date: DATE,
      sources: [
        src(QBT_SITE, "Official site: about, features, platforms"),
        src(QBT_REPO, "GitHub repository page"),
        src(QBT_COPYING, "COPYING: licence terms"),
      ],
      checks: [
        ok("OFFICIAL_URL", QBT_SITE, "Official site www.qbittorrent.org, linked from the GitHub repository."),
        ok("FREE_STATUS", QBT_SITE, "\"The qBittorrent project aims to provide an open-source software alternative to µTorrent.\" Features list includes \"No Ads\"."),
        ok("LICENSE", QBT_COPYING, "\"The qBittorrent source code is licensed under the GNU General Public License, version 2 or (at your option) any later version (GPLv2+).\""),
        ok("OPEN_SOURCE_STATUS", QBT_REPO, "Public source repository with COPYING, GPLv2 and GPLv3 licence files."),
        ok("PLATFORM_AVAILABILITY", QBT_SITE, "\"Available on all platforms: Windows, Linux, macOS, FreeBSD, OS/2\""),
        ok("LIMITATIONS", QBT_COPYING, "\"the binary distribution is licensed under GNU General Public License, version 3 or (at your option) any later version (GPLv3+), because it contains GPLv3+ assets\""),
      ],
      notes: "Read the official site, repo page and COPYING. The search-engine plugin feature is not described here; the listing is for the client only.",
    },
  },
  {
    slug: "portainer-ce",
    name: "Portainer Community Edition",
    shortDescription: "Web UI for managing Docker, Swarm, Podman and Kubernetes environments. zlib-licensed, for non-production use.",
    longDescription:
      "Portainer Community Edition is a lightweight container management UI for Docker, Swarm, Podman, Kubernetes and ACI environments. Portainer says CE is provided as-is, at no cost, for homelabs, learning and personal projects, without support or warranty. Portainer Business Edition, a paid product, adds RBAC, GitOps, edge management, audit, SSO and commercial support. CE is under the zlib licence.",
    whyListed: "A point-and-click way to manage containers on a homelab or learning setup.",
    category: "deployment",
    resourceType: "DEVELOPER_TOOL",
    officialUrl: PORTAINER_REPO,
    sourceUrl: PORTAINER_REPO,
    freeStatus: "OPEN_SOURCE",
    openSource: true,
    license: "Zlib",
    platforms: ["SELF_HOSTED"],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "unknown",
    personalUse: "unknown",
    limitations: [
      "Portainer states CE is not intended for or supported in business or production environments",
      "No official support channel, no SLA and no roadmap commitment",
      "RBAC, GitOps, edge management, audit and SSO are Business Edition features",
    ],
    features: [
      "Container management UI for Docker, Swarm and Podman",
      "Kubernetes and ACI environment support",
      "Lightweight deployment",
    ],
    tags: ["docker", "kubernetes", "containers", "homelab", "self-hosted"],
    research: {
      date: DATE,
      sources: [src(PORTAINER_README, "README: CE scope, intended use, licensing")],
      checks: [
        ok("OFFICIAL_URL", PORTAINER_README, "README of the portainer/portainer repository; product site portainer.io."),
        ok("FREE_STATUS", PORTAINER_README, "\"Portainer Community Edition is a free, lightweight container management UI ... provided as-is, at no cost\""),
        ok("LICENSE", PORTAINER_README, "\"Portainer is licensed under the zlib license.\""),
        ok("OPEN_SOURCE_STATUS", PORTAINER_README, "Business Edition \"builds on the same open-source base\"; source under zlib."),
        ok("LIMITATIONS", PORTAINER_README, "\"It is not intended for, or supported in, business, production, or any other environment where uptime, security posture, or data integrity matter.\""),
        ok("PRICING_INFORMATION", PORTAINER_README, "Business Edition is the supported, paid version; \"Take3 – get 3 free nodes of Portainer Business\"."),
      ],
      notes: "Read raw README from develop. commercialUse left unknown: the zlib licence permits it, but Portainer's README says CE is not intended for business use. Take3 terms not checked.",
    },
  },
  {
    slug: "kopia",
    name: "Kopia",
    shortDescription: "Encrypted, deduplicated file backup to cloud, NAS or local storage, with a CLI and a desktop GUI.",
    longDescription:
      "Kopia is a backup and restore tool that creates encrypted, compressed, deduplicated snapshots of chosen files and folders and stores them on S3-compatible storage, Azure, Backblaze B2, Google Cloud Storage, WebDAV, SFTP, local disks or a Kopia Repository Server. It has a command-line tool and a GUI (KopiaUI) for Windows, macOS and Linux, plus Docker images. It is Apache-2.0 licensed.",
    whyListed: "Encrypted backups to whatever storage you already have, without a backup subscription.",
    category: "personal",
    resourceType: "DESKTOP_APP",
    officialUrl: KOPIA_REPO,
    sourceUrl: KOPIA_REPO,
    freeStatus: "OPEN_SOURCE",
    openSource: true,
    license: "Apache-2.0",
    platforms: ["WINDOWS", "MACOS", "LINUX", "SELF_HOSTED"],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "unknown",
    personalUse: "unknown",
    limitations: [
      "You provide and pay for the storage location yourself",
      "Backs up files and folders, not a full machine image",
      "Some advanced features are CLI-only; Rclone support is experimental",
    ],
    features: [
      "User-controlled end-to-end encryption",
      "Compression and deduplication",
      "Error correction",
      "S3, Azure, B2, Google Cloud, WebDAV, SFTP and local targets",
      "CLI and KopiaUI desktop app",
      "Optional repository server for multiple machines",
    ],
    tags: ["backup", "encryption", "snapshots", "cloud-storage"],
    research: {
      date: DATE,
      sources: [
        src(KOPIA_README, "README: features, storage, licence"),
        src(KOPIA_INSTALL, "Official installation guide: platforms and variants"),
      ],
      checks: [
        ok("OFFICIAL_URL", KOPIA_README, "README of the kopia/kopia repository; site kopia.io."),
        ok("FREE_STATUS", KOPIA_README, "\"Kopia is a fast and secure open-source backup/restore tool\""),
        ok("LICENSE", KOPIA_README, "\"Kopia is licensed under the Apache License, Version 2.0.\""),
        ok("OPEN_SOURCE_STATUS", KOPIA_README, "\"Kopia is open source.\""),
        ok("PLATFORM_AVAILABILITY", KOPIA_INSTALL, "CLI and GUI packages for Windows 10+, macOS 10.11+ and Linux (amd64, armhf, arm64); Docker images."),
        ok("LIMITATIONS", KOPIA_README, "\"You must provision and pay for the storage provider\"; \"Kopia does not 'image' your whole machine\"; Rclone support is experimental."),
      ],
      notes: "Read raw README and the kopia.io installation page.",
    },
  },
  {
    slug: "restic",
    name: "restic",
    shortDescription: "Encrypted, deduplicating command-line backup program for Linux, macOS and Windows. BSD 2-Clause.",
    longDescription:
      "restic is a command-line backup program designed to be easy, fast, verifiable, secure and efficient. Backups are encrypted and deduplicated, and can be stored in a local directory, over SFTP, on a REST server, on S3-compatible storage, OpenStack Swift, Backblaze B2, Azure Blob or Google Cloud Storage, or anywhere rclone reaches. Release binaries are reproducible. It is BSD 2-Clause licensed.",
    whyListed: "A scriptable backup tool that encrypts data before it reaches storage you do not fully trust.",
    category: "personal",
    resourceType: "UTILITY",
    officialUrl: RESTIC_REPO,
    sourceUrl: RESTIC_REPO,
    freeStatus: "OPEN_SOURCE",
    openSource: true,
    license: "BSD-2-Clause",
    platforms: ["LINUX", "MACOS", "WINDOWS"],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "unknown",
    personalUse: "unknown",
    limitations: [
      "Command-line only",
      "Losing the repository password makes the backup unrecoverable",
    ],
    features: [
      "Encryption for confidentiality and integrity",
      "Deduplication before data is written",
      "Local, SFTP, REST, S3, Swift, B2, Azure and Google Cloud backends",
      "Restore or mount snapshots via FUSE",
      "Reproducible release builds",
    ],
    tags: ["backup", "encryption", "cli", "deduplication"],
    research: {
      date: DATE,
      sources: [src(RESTIC_README, "README: platforms, backends, licence")],
      checks: [
        ok("OFFICIAL_URL", RESTIC_README, "README of the restic/restic repository."),
        ok("FREE_STATUS", RESTIC_README, "\"Restic is licensed under BSD 2-Clause License.\""),
        ok("LICENSE", RESTIC_README, "\"Restic is licensed under BSD 2-Clause License. You can find the complete text in LICENSE.\""),
        ok("OPEN_SOURCE_STATUS", RESTIC_README, "Source published under the OSI-approved BSD 2-Clause licence."),
        ok("PLATFORM_AVAILABILITY", RESTIC_README, "\"It supports the three major operating systems (Linux, macOS, Windows) and a few smaller ones (FreeBSD, OpenBSD).\""),
        ok("LIMITATIONS", RESTIC_README, "\"Losing your password means that your data is irrecoverably lost.\""),
      ],
      notes: "Read raw README from master.",
    },
  },
  {
    slug: "nginx-proxy-manager",
    name: "Nginx Proxy Manager",
    shortDescription: "Docker-based admin UI for Nginx reverse proxy hosts with Let's Encrypt SSL. MIT-licensed.",
    longDescription:
      "Nginx Proxy Manager is a pre-built Docker image with a web admin interface for forwarding domains to services running at home or elsewhere. It creates proxy hosts, redirections, streams and 404 hosts without hand-writing Nginx config, obtains SSL certificates from Let's Encrypt or accepts your own, and adds access lists, basic HTTP authentication, user management and an audit log. It is MIT-licensed.",
    whyListed: "Lets people expose self-hosted services over HTTPS without learning Nginx configuration.",
    category: "hosting",
    resourceType: "DEVELOPER_TOOL",
    officialUrl: NPM_REPO,
    sourceUrl: NPM_REPO,
    freeStatus: "OPEN_SOURCE",
    openSource: true,
    license: "MIT",
    platforms: ["SELF_HOSTED"],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "unknown",
    personalUse: "unknown",
    limitations: [
      "armv7 is no longer supported from version 2.14",
      "Requires Docker and open ports 80 and 443 on the host",
    ],
    features: [
      "Admin interface for proxy hosts, redirections, streams and 404 hosts",
      "Let's Encrypt certificates or custom SSL",
      "Access lists and basic HTTP authentication",
      "Advanced Nginx configuration for experienced users",
      "User management, permissions and audit log",
    ],
    tags: ["reverse-proxy", "nginx", "ssl", "docker", "homelab"],
    research: {
      date: DATE,
      sources: [
        src(NPM_README, "README: features, setup, platform notes"),
        src(NPM_LICENSE, "LICENSE: MIT"),
      ],
      checks: [
        ok("OFFICIAL_URL", NPM_README, "README of the NginxProxyManager/nginx-proxy-manager repository; docs at nginxproxymanager.com."),
        ok("FREE_STATUS", NPM_LICENSE, "MIT: permission granted \"free of charge, to any person obtaining a copy of this software\"."),
        ok("LICENSE", NPM_LICENSE, "\"MIT License Copyright (c) 2017\""),
        ok("OPEN_SOURCE_STATUS", NPM_LICENSE, "Source published under the MIT licence."),
        ok("LIMITATIONS", NPM_README, "\"armv7 is no longer supported in version 2.14+\"; quick setup maps ports 80, 81 and 443."),
        ok("PLATFORM_AVAILABILITY", NPM_README, "\"This project comes as a pre-built Docker image\""),
      ],
      notes: "Read raw README and LICENSE from develop.",
    },
  },
  {
    slug: "headscale",
    name: "Headscale",
    shortDescription: "Open-source, self-hosted implementation of the Tailscale control server for a single tailnet.",
    longDescription:
      "Headscale is an open-source, self-hosted alternative to the Tailscale control server, which exchanges WireGuard keys, assigns IP addresses and manages users and routes in a Tailscale network. It deliberately implements a narrow scope: a single tailnet, suited to personal use or a small open-source organisation. It is not associated with Tailscale Inc. and is BSD 3-Clause licensed.",
    whyListed: "Lets you run your own private mesh-VPN coordination server instead of relying on a hosted one.",
    category: "personal",
    resourceType: "OPEN_SOURCE",
    officialUrl: HEADSCALE_REPO,
    sourceUrl: HEADSCALE_REPO,
    freeStatus: "OPEN_SOURCE",
    openSource: true,
    license: "BSD-3-Clause",
    platforms: ["SELF_HOSTED"],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "unknown",
    personalUse: "unknown",
    limitations: [
      "Implements a single tailnet only",
      "The project does not support or encourage running it behind reverse proxies or in containers",
      "Not associated with Tailscale Inc.",
    ],
    features: [
      "Self-hosted Tailscale-compatible control server",
      "Exchanges WireGuard public keys and assigns client IPs",
      "Manages users, shared machines and advertised routes",
      "NixOS module available",
    ],
    tags: ["vpn", "wireguard", "tailscale", "networking", "self-hosted"],
    research: {
      date: DATE,
      sources: [
        src(HEADSCALE_README, "README: design goal, scope, disclaimer"),
        src(HEADSCALE_LICENSE, "LICENSE: BSD 3-Clause"),
      ],
      checks: [
        ok("OFFICIAL_URL", HEADSCALE_README, "README of the juanfont/headscale repository; documentation at headscale.net."),
        ok("FREE_STATUS", HEADSCALE_README, "\"An open source, self-hosted implementation of the Tailscale control server.\""),
        ok("LICENSE", HEADSCALE_LICENSE, "\"BSD 3-Clause License Copyright (c) 2020, Juan Font\""),
        ok("OPEN_SOURCE_STATUS", HEADSCALE_LICENSE, "Source published under the BSD 3-Clause licence."),
        ok("LIMITATIONS", HEADSCALE_README, "\"It implements a narrow scope, a single Tailscale network (tailnet)\"; \"we do not support nor encourage the use of reverse proxies and container to run Headscale.\""),
      ],
      notes: "Read raw README and LICENSE from main. Client OS support lives in the docs and was not checked.",
    },
  },
]);
