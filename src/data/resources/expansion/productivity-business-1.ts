import type { Resource, VerificationCheck, VerificationCheckRecord } from "@/types/resource";

import type { ResearchSource } from "../entertainment/define-media";
import { defineResearchedList } from "./define-researched";

/**
 * Productivity & business expansion, batch 1: analytics, marketing, CRM, HR,
 * project management, collaboration, storage, presentations, spreadsheets,
 * templates and business finance (including two Government of India services).
 * Every fact below comes from an official page fetched on 2026-10-11.
 */

const DATE = "2026-10-11";
const ok = (check: VerificationCheck, sourceUrl: string, evidence: string): VerificationCheckRecord => ({
  check,
  result: "confirmed",
  evidence,
  sourceUrl,
});
const src = (url: string, label: string): ResearchSource => ({ url, label });

const PLAUSIBLE_REPO = "https://github.com/plausible/analytics";
const GOAT_REPO = "https://github.com/arp242/goatcounter";
const GOAT_SITE = "https://www.goatcounter.com/";
const GOAT_LICENSE = "https://raw.githubusercontent.com/arp242/goatcounter/main/LICENSE";
const MAUTIC_REPO = "https://github.com/mautic/mautic";
const MAUTIC_LICENSE = "https://raw.githubusercontent.com/mautic/mautic/7.x/LICENSE.txt";
const ORANGE_REPO = "https://github.com/orangehrm/orangehrm";
const ORANGE_SITE = "https://www.orangehrm.com/en/open-source";
const KIMAI_REPO = "https://github.com/kimai/kimai";
const KIMAI_SITE = "https://www.kimai.org/";
const KANBOARD_REPO = "https://github.com/kanboard/kanboard";
const WEKAN_REPO = "https://github.com/wekan/wekan";
const REVEAL_REPO = "https://github.com/hakimel/reveal.js";
const IMPRESS_REPO = "https://github.com/impress/impress.js";
const DOLIBARR_REPO = "https://github.com/Dolibarr/dolibarr";
const KRAYIN_REPO = "https://github.com/krayin/laravel-crm";
const ETHERPAD_REPO = "https://github.com/ether/etherpad";
const ETHERCALC_REPO = "https://github.com/audreyt/ethercalc";
const SEAFILE_REPO = "https://github.com/haiwen/seafile";
const SEAFILE_DOWNLOAD = "https://www.seafile.com/en/download/";
const SB_ORG = "https://github.com/StartBootstrap";
const SB_LICENSE = "https://raw.githubusercontent.com/StartBootstrap/startbootstrap-landing-page/master/LICENSE";
const GST_TOOL = "https://www.gst.gov.in/download/returns";
const UDYAM = "https://udyamregistration.gov.in/";

export const productivityBusiness1Resources: Resource[] = defineResearchedList([
  /* ------------------------------------------------------------------ */
  /* Analytics                                                          */
  /* ------------------------------------------------------------------ */
  {
    slug: "plausible-community-edition",
    name: "Plausible Community Edition",
    shortDescription: "Self-hosted, cookie-free web analytics under the AGPL; the managed cloud version is a paid subscription.",
    longDescription:
      "Plausible Analytics is a lightweight web analytics dashboard that stores no cookies or personal data. The Community Edition (CE) is the self-hosted build, licensed AGPL-3.0, released twice a year; the hosted cloud service is paid and funds development.",
    whyListed: "A privacy-focused alternative to Google Analytics that a site owner can run on their own server without paying licence fees.",
    category: "analytics",
    resourceType: "DEVELOPER_TOOL",
    officialUrl: "https://plausible.io/",
    sourceUrl: PLAUSIBLE_REPO,
    licenseUrl: "https://github.com/plausible/analytics/blob/master/LICENSE.md",
    freeStatus: "OPEN_SOURCE",
    openSource: true,
    license: "AGPL-3.0-or-later",
    licenseNotes: "The JavaScript tracker included on websites is released separately under the MIT licence.",
    platforms: ["SELF_HOSTED"],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "unknown",
    personalUse: "unknown",
    limitations: [
      "Premium features (marketing funnels, ecommerce revenue goals, SSO and the sites API) are not available in CE",
      "CE is a long-term release published twice per year, so new features arrive later than on the cloud service",
      "Community support only; you run and pay for your own server, backups and security",
      "The managed cloud service is a paid subscription",
    ],
    features: [
      "No cookies or persistent identifiers; no personal data or IP addresses stored",
      "Single-page dashboard",
      "Raw data accessible directly from the ClickHouse database when self-hosted",
      "Works with single-page apps, including pushState and hash-based routing",
    ],
    tags: ["web-analytics", "privacy", "self-hosted", "google-analytics-alternative"],
    alternativeTo: ["Google Analytics"],
    research: {
      date: DATE,
      sources: [src(PLAUSIBLE_REPO, "GitHub README: CE vs cloud comparison table and licence section")],
      checks: [
        ok("OFFICIAL_URL", PLAUSIBLE_REPO, "Repository README links plausible.io as the project site."),
        ok("FREE_STATUS", PLAUSIBLE_REPO, "\"we have a free as in beer and self-hosted solution called Plausible Community Edition (CE)\"; \"You never have to pay any fees to us.\""),
        ok("OPEN_SOURCE_STATUS", PLAUSIBLE_REPO, "\"Plausible CE is open source under the GNU Affero General Public License Version 3 (AGPLv3) or any later version.\""),
        ok("LICENSE", PLAUSIBLE_REPO, "AGPLv3 or any later version; the JavaScript tracker is released under the MIT licence."),
        ok("LIMITATIONS", PLAUSIBLE_REPO, "\"Premium features (marketing funnels, ecommerce revenue goals, SSO and sites API) are not available\" in CE; CE is community supported only."),
        ok("PRICING_INFORMATION", PLAUSIBLE_REPO, "Cloud: \"we charge a subscription fee\". CE: you pay for your own server, CDN and backups."),
        ok("PLATFORM_AVAILABILITY", PLAUSIBLE_REPO, "CE: \"You need to get a server and you need to manage your infrastructure.\""),
      ],
      notes: "Read the GitHub README. Listed only the self-hosted Community Edition; the cloud product is paid and not described as free. Account and card requirements for CE were not stated.",
    },
  },
  {
    slug: "goatcounter",
    name: "GoatCounter",
    shortDescription: "Privacy-friendly web analytics, free to self-host and offered as a donation-supported hosted service.",
    longDescription:
      "GoatCounter is an open-source web analytics platform by Martin Tournoij. It counts visits without cookies or unique identifiers, and can be used via a script tag, a no-JavaScript tracking pixel, a backend API or log-file import. The hosted service at goatcounter.com is offered for free for reasonable public usage.",
    whyListed: "Simple analytics for personal sites and small businesses, with both a no-cost hosted option and a self-hosted binary.",
    category: "analytics",
    resourceType: "WEB_APP",
    officialUrl: GOAT_SITE,
    sourceUrl: GOAT_REPO,
    licenseUrl: "https://github.com/arp242/goatcounter/blob/main/LICENSE",
    freeStatus: "OPEN_SOURCE",
    openSource: true,
    license: "EUPL-1.2 (lightly modified appendix)",
    licenseNotes: "The LICENSE states it is EUPL 1.2 with some licences removed from the Compatible Licences appendix; count.js is ISC-licensed.",
    platforms: ["BROWSER", "SELF_HOSTED"],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "yes",
    personalUse: "yes",
    limitations: [
      "The hosted service is for reasonable public usage; sending millions of pageviews per day is not accepted",
      "The licence is a modified EUPL 1.2 rather than the unmodified text",
    ],
    features: [
      "No tracking with unique identifiers; no GDPR notice needed according to the project",
      "Script tag, no-JavaScript tracking pixel, backend API or log-file import",
      "Self-hosted binaries with SQLite or PostgreSQL storage",
      "Full data export",
    ],
    tags: ["web-analytics", "privacy", "self-hosted"],
    alternativeTo: ["Google Analytics"],
    research: {
      date: DATE,
      sources: [
        src(GOAT_SITE, "Home page: features and pricing section"),
        src(GOAT_REPO, "GitHub README: self-hosting"),
        src(GOAT_LICENSE, "LICENSE file"),
      ],
      checks: [
        ok("OFFICIAL_URL", GOAT_SITE, "goatcounter.com is the project home and links the GitHub source."),
        ok("FREE_STATUS", GOAT_SITE, "\"GoatCounter.com is currently offered for free for reasonable public usage.\""),
        ok("FREE_TIER_LIMITS", GOAT_SITE, "\"Running your personal website or small-to-medium business on it is fine, but sending millions of pageviews/day isn't.\""),
        ok("COMMERCIAL_USE", GOAT_SITE, "\"Running your personal website or small-to-medium business on it is fine\"."),
        ok("PERSONAL_USE", GOAT_SITE, "\"Running your personal website ... on it is fine\"."),
        ok("OPEN_SOURCE_STATUS", GOAT_REPO, "\"The source code is completely Open Source/Free Software, and it can be self-hosted without restrictions.\""),
        ok("LICENSE", GOAT_LICENSE, "\"GoatCounter is licensed under a slightly modified version of European Union Public License (EUPL) 1.2\"."),
        ok("PLATFORM_AVAILABILITY", GOAT_REPO, "\"available as hosted service on goatcounter.com, or run it on your own server.\""),
      ],
      notes: "Read the home page, README and LICENSE. Whether sign-up needs a card was not stated.",
    },
  },

  /* ------------------------------------------------------------------ */
  /* Marketing                                                          */
  /* ------------------------------------------------------------------ */
  {
    slug: "mautic",
    name: "Mautic",
    shortDescription: "GPL-licensed marketing automation for email campaigns, segments and multi-channel flows on your own server.",
    longDescription:
      "Mautic is an open-source marketing automation project of the Open Source Collective. It covers campaigns, segmentation, email marketing and integrations, and is self-hosted on your own database. Hosted trials are offered separately; the self-hosted software is free.",
    whyListed: "A self-hostable alternative to paid marketing automation suites, without per-contact pricing.",
    category: "marketing",
    resourceType: "BUSINESS_TOOL",
    officialUrl: "https://www.mautic.org/",
    sourceUrl: MAUTIC_REPO,
    licenseUrl: "https://github.com/mautic/mautic/blob/7.x/LICENSE.txt",
    freeStatus: "OPEN_SOURCE",
    openSource: true,
    license: "GPL-3.0-or-later",
    platforms: ["SELF_HOSTED"],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "unknown",
    personalUse: "unknown",
    limitations: [
      "Needs a PHP server and database; installing from GitHub requires Composer and command-line work",
      "The hosted 'try Mautic' option is a trial, not a free plan",
    ],
    features: [
      "Unlimited segmentation and automation",
      "Multi-channel marketing campaigns",
      "Uses your own database",
      "Custom integrations and a customisable front end and back end",
    ],
    tags: ["marketing-automation", "email-marketing", "self-hosted"],
    alternativeTo: ["HubSpot Marketing Hub", "Marketo"],
    research: {
      date: DATE,
      sources: [
        src(MAUTIC_REPO, "GitHub README: benefits and installation"),
        src(MAUTIC_LICENSE, "LICENSE.txt"),
      ],
      checks: [
        ok("OFFICIAL_URL", MAUTIC_REPO, "README links www.mautic.org as the project site."),
        ok("FREE_STATUS", MAUTIC_REPO, "\"Self-host completely free, forever\"; \"use it for free, no strings attached\"."),
        ok("OPEN_SOURCE_STATUS", MAUTIC_LICENSE, "\"Mautic is released under the GPL v3.\""),
        ok("LICENSE", MAUTIC_LICENSE, "GNU General Public License version 3 \"or (at your option) any later version\"."),
        ok("LIMITATIONS", MAUTIC_REPO, "\"Install from GitHub only if you are comfortable using the command line\"; hosted access is via \"Request a trial\"."),
        ok("PLATFORM_AVAILABILITY", MAUTIC_REPO, "\"Don't rely on third-party SaaS, run your own marketing automation\"; production package at mautic.org/download."),
      ],
      notes: "Read the README and LICENSE.txt. The hosted trial is not listed as free.",
    },
  },

  /* ------------------------------------------------------------------ */
  /* CRM                                                                */
  /* ------------------------------------------------------------------ */
  {
    slug: "krayin-crm",
    name: "Krayin CRM",
    shortDescription: "MIT-licensed Laravel and Vue CRM for leads, contacts and sales pipelines, self-hosted on a PHP server.",
    longDescription:
      "Krayin CRM is a CRM framework from Webkul built on Laravel and Vue.js, for customer, lead and sales management. The code is MIT-licensed; paid managed hosting, a multi-tenant SaaS edition and some extensions (WhatsApp, VoIP) are sold separately.",
    whyListed: "A permissively licensed CRM that small businesses can host and modify themselves.",
    category: "crm",
    resourceType: "BUSINESS_TOOL",
    officialUrl: "https://krayincrm.com/",
    sourceUrl: KRAYIN_REPO,
    licenseUrl: "https://github.com/krayin/laravel-crm/blob/2.1/LICENSE",
    freeStatus: "OPEN_SOURCE",
    openSource: true,
    license: "MIT",
    platforms: ["SELF_HOSTED"],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "unknown",
    personalUse: "unknown",
    limitations: [
      "Server requirements include 3 GB RAM or more and PHP 8.3 or higher",
      "Managed cloud hosting, the multi-tenant SaaS edition and extensions such as WhatsApp and VoIP are separate offerings",
    ],
    features: ["Lead, contact and sales pipeline management", "Admin dashboard", "Custom attributes", "Email parsing via SendGrid", "Docker installation option"],
    tags: ["crm", "sales", "laravel", "self-hosted"],
    alternativeTo: ["Salesforce", "Pipedrive"],
    research: {
      date: DATE,
      sources: [src(KRAYIN_REPO, "GitHub README: introduction, requirements and licence")],
      checks: [
        ok("OFFICIAL_URL", KRAYIN_REPO, "Repository About links krayincrm.com."),
        ok("FREE_STATUS", KRAYIN_REPO, "\"Krayin CRM is a fully open-source CRM framework which will always be free under the MIT License.\""),
        ok("OPEN_SOURCE_STATUS", KRAYIN_REPO, "\"Free & Opensource Laravel CRM solution for SMEs and Enterprises\"."),
        ok("LICENSE", KRAYIN_REPO, "Repository licence: MIT license."),
        ok("LIMITATIONS", KRAYIN_REPO, "Requirements: \"RAM: 3 GB or higher\", \"PHP: 8.3 or higher\"; cloud hosting, SaaS and WhatsApp/VoIP extensions are separate offerings."),
        ok("PLATFORM_AVAILABILITY", KRAYIN_REPO, "Installed with Composer on Apache or NGINX, or via Docker."),
      ],
      notes: "Read the README. Prices of the paid hosting and extensions were not checked.",
    },
  },
  {
    slug: "dolibarr",
    name: "Dolibarr ERP & CRM",
    shortDescription: "GPL-licensed ERP and CRM for invoices, quotes, stock, projects, HR leave and accounting, self-hosted.",
    longDescription:
      "Dolibarr is a modular PHP application for small and medium businesses, foundations and freelancers. Modules cover customers and suppliers, proposals, orders, invoices, stock, point of sale, projects, accounting and HR (leave, expense reports, timesheets). Installers exist for Windows (DoliWamp) and Debian/Ubuntu, plus Docker; ready-to-use cloud hosting is a paid third-party option.",
    whyListed: "Covers many back-office needs of a small business in one openly licensed package that can run on a single PC or server.",
    category: "business-finance",
    resourceType: "BUSINESS_TOOL",
    officialUrl: "https://www.dolibarr.org/",
    sourceUrl: DOLIBARR_REPO,
    licenseUrl: "https://github.com/Dolibarr/dolibarr/blob/develop/COPYING",
    freeStatus: "OPEN_SOURCE",
    openSource: true,
    license: "GPL-3.0-or-later",
    platforms: ["SELF_HOSTED", "WINDOWS", "LINUX"],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "unknown",
    personalUse: "unknown",
    limitations: [
      "No payroll module and no task dependencies in projects yet, per the README",
      "Ready-to-use SaaS/cloud offers come with associated costs",
      "Many add-ons on the DoliStore marketplace are from third parties",
    ],
    features: [
      "Customers, prospects, suppliers and contacts",
      "Quotes, orders, invoices, credit notes and payments",
      "Stock, warehouses, BOM and manufacturing orders",
      "Point of sale",
      "Leave, expense reports, recruitment and timesheets",
      "REST and SOAP APIs",
    ],
    tags: ["erp", "invoicing", "accounting", "inventory", "self-hosted"],
    alternativeTo: ["Tally", "QuickBooks"],
    research: {
      date: DATE,
      sources: [src(DOLIBARR_REPO, "GitHub README: licence, installing, features, what it can't do")],
      checks: [
        ok("OFFICIAL_URL", DOLIBARR_REPO, "Repository About links www.dolibarr.org."),
        ok("FREE_STATUS", DOLIBARR_REPO, "\"You can freely use, study, modify or distribute it according to its license.\""),
        ok("OPEN_SOURCE_STATUS", DOLIBARR_REPO, "\"It's an Open-Source Software suite (written in PHP with JavaScript enhancements)\"."),
        ok("LICENSE", DOLIBARR_REPO, "\"either Version 3 of the License, or (at your option) any later version (GPL-3+)\"."),
        ok("LIMITATIONS", DOLIBARR_REPO, "\"WHAT DOLIBARR CAN'T DO YET\": tasks dependencies, payroll module, native embedded webmail. SaaS: \"this third option comes with associated costs\"."),
        ok("PLATFORM_AVAILABILITY", DOLIBARR_REPO, "\"DoliWamp for Windows\", \"DoliDeb for Debian, Ubuntu\", DoliRpm, and a Docker image."),
      ],
      notes: "Read the README. Indian GST-specific features were not confirmed and are not claimed.",
    },
  },

  /* ------------------------------------------------------------------ */
  /* HR                                                                 */
  /* ------------------------------------------------------------------ */
  {
    slug: "orangehrm-starter",
    name: "OrangeHRM Starter",
    shortDescription: "Open-source HR system for employee records, leave and time, self-hosted; the Advanced edition is paid.",
    longDescription:
      "OrangeHRM Starter is the GPL-licensed, self-hosted edition of OrangeHRM's human resource management system. It is installed with a web installer on Linux or Windows servers or via Docker, with companion Android and iOS apps. OrangeHRM Advanced is a separate commercial product offered with a 30-day trial.",
    whyListed: "Gives small organisations a no-licence-fee HR system they control.",
    category: "hr",
    resourceType: "BUSINESS_TOOL",
    officialUrl: ORANGE_SITE,
    sourceUrl: ORANGE_REPO,
    licenseUrl: "https://github.com/orangehrm/orangehrm/blob/main/LICENSE",
    freeStatus: "OPEN_SOURCE",
    openSource: true,
    license: "GPL-3.0-or-later",
    platforms: ["SELF_HOSTED", "ANDROID", "IOS"],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "unknown",
    personalUse: "unknown",
    limitations: [
      "Only the Starter edition is open source; OrangeHRM Advanced is commercial and offered as a 30-day trial",
      "You install and maintain the server yourself",
    ],
    features: ["Employee information management", "Leave management", "Web installer and Docker image", "Android and iOS apps", "REST API"],
    tags: ["hrms", "leave-management", "self-hosted"],
    alternativeTo: ["BambooHR", "Zoho People"],
    research: {
      date: DATE,
      sources: [
        src(ORANGE_REPO, "GitHub README: OrangeHRM Starter, licence, installation"),
        src(ORANGE_SITE, "Official open-source page and site navigation"),
      ],
      checks: [
        ok("OFFICIAL_URL", ORANGE_SITE, "Official OrangeHRM site, open-source section."),
        ok("FREE_STATUS", ORANGE_SITE, "Navigation: \"Starter (Open Source) Completely FREE & Open-source HR Software\"."),
        ok("OPEN_SOURCE_STATUS", ORANGE_REPO, "\"OrangeHRM is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License\"."),
        ok("LICENSE", ORANGE_REPO, "\"either version 3 of the License, or (at your option) any later version\"; repository shows GPL-3.0."),
        ok("LIMITATIONS", ORANGE_SITE, "\"Advanced (30 Day Free Trial) Experience OrangeHRM Advanced, commitment-free.\""),
        ok("PLATFORM_AVAILABILITY", ORANGE_REPO, "Install guides for Linux and Windows, Docker pulls badge, and links to Google Play and App Store apps."),
      ],
      notes: "Read the README and the official open-source page. Only Starter is listed; Advanced is a trial and not free.",
    },
  },
  {
    slug: "kimai",
    name: "Kimai",
    shortDescription: "AGPL time-tracking app with timesheets, reports and invoicing; self-host it or use the paid cloud.",
    longDescription:
      "Kimai is a web-based, multi-user time tracker from Austria for freelancers and teams. It handles timesheets, punch-in/punch-out mode, budgets, reports, invoices (including e-invoice formats) and a JSON API. Self-hosting is open source under the AGPL; Kimai Cloud is a hosted alternative, and some plugins are paid.",
    whyListed: "Lets teams track billable hours and invoice from them without a per-seat subscription when self-hosted.",
    category: "hr",
    resourceType: "BUSINESS_TOOL",
    officialUrl: KIMAI_SITE,
    sourceUrl: KIMAI_REPO,
    licenseUrl: "https://github.com/kimai/kimai/blob/main/LICENSE",
    freeStatus: "OPEN_SOURCE",
    openSource: true,
    license: "AGPL-3.0",
    platforms: ["SELF_HOSTED"],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "unknown",
    personalUse: "unknown",
    limitations: [
      "Some features are paid plugins, for example the Expenses plugin",
      "Self-hosting needs PHP 8.2+, MariaDB/MySQL and a subdomain (subdirectory installs are not supported)",
      "Self-hosted installs get community support",
    ],
    features: [
      "Timesheets with multi-timer and punch-in/punch-out modes",
      "Reports by user, customer, project and activity",
      "Invoice templates in PDF and DOCX, plus e-invoice formats",
      "LDAP/SAML login and TOTP two-factor authentication",
      "JSON API",
    ],
    tags: ["time-tracking", "timesheets", "invoicing", "self-hosted"],
    alternativeTo: ["Toggl Track", "Harvest", "Clockify"],
    research: {
      date: DATE,
      sources: [
        src(KIMAI_SITE, "Official home page: cloud vs self-hosting"),
        src(KIMAI_REPO, "GitHub README: features and requirements"),
      ],
      checks: [
        ok("OFFICIAL_URL", KIMAI_SITE, "kimai.org is the project home."),
        ok("FREE_STATUS", KIMAI_REPO, "\"Kimai is a professional grade time-tracking application, free and open-source.\""),
        ok("OPEN_SOURCE_STATUS", KIMAI_SITE, "Self hosting: \"100% open source (AGPL 3)\"."),
        ok("LICENSE", KIMAI_REPO, "Repository licence: AGPL-3.0."),
        ok("LIMITATIONS", KIMAI_SITE, "\"Buy the plugin and keep track of expenses\"; self hosting comes with \"Community support\"."),
        ok("PLATFORM_AVAILABILITY", KIMAI_REPO, "Requirements: PHP 8.2+, MariaDB/MySQL, \"A webserver and subdomain (subdirectory is not supported)\"."),
      ],
      notes: "Read the home page and README. Cloud pricing was not checked, so the cloud plan is not described.",
    },
  },

  /* ------------------------------------------------------------------ */
  /* Project management                                                 */
  /* ------------------------------------------------------------------ */
  {
    slug: "kanboard",
    name: "Kanboard",
    shortDescription: "Minimal MIT-licensed Kanban board for project management, self-hosted with PHP; in maintenance mode.",
    longDescription:
      "Kanboard is project management software built around the Kanban method, created by Frédéric Guillot. It runs on a PHP server or via Docker and supports plugins. The author describes it as in maintenance mode: no major new features, but regular community releases and bug fixes.",
    whyListed: "A small, stable Kanban tool for teams that want something simple and self-hosted.",
    category: "project-management",
    resourceType: "PRODUCTIVITY_TOOL",
    officialUrl: "https://kanboard.org/",
    sourceUrl: KANBOARD_REPO,
    licenseUrl: "https://github.com/kanboard/kanboard/blob/main/LICENSE",
    freeStatus: "OPEN_SOURCE",
    openSource: true,
    license: "MIT",
    platforms: ["SELF_HOSTED"],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "unknown",
    personalUse: "unknown",
    limitations: ["In maintenance mode: the author is not developing major new features, only small fixes"],
    features: ["Kanban boards", "Plugins", "Docker image", "JSON-RPC API"],
    tags: ["kanban", "project-management", "self-hosted"],
    alternativeTo: ["Trello"],
    relatedResources: ["trello"],
    research: {
      date: DATE,
      sources: [src(KANBOARD_REPO, "GitHub README: maintenance mode notice and credits")],
      checks: [
        ok("OFFICIAL_URL", KANBOARD_REPO, "\"Official website: https://kanboard.org/\"."),
        ok("FREE_STATUS", KANBOARD_REPO, "Distributed under the MIT License; no paid edition is mentioned."),
        ok("OPEN_SOURCE_STATUS", KANBOARD_REPO, "Public source repository, \"Distributed under MIT License\"."),
        ok("LICENSE", KANBOARD_REPO, "Repository licence: MIT license."),
        ok("LIMITATIONS", KANBOARD_REPO, "\"This application is in maintenance mode\"; \"not actively developing any new major features (only small fixes)\"."),
        ok("PLATFORM_AVAILABILITY", KANBOARD_REPO, "Installation instructions and \"Use Kanboard with Docker\"; topic self-hosted."),
      ],
      notes: "Read the README.",
    },
  },
  {
    slug: "wekan",
    name: "WeKan",
    shortDescription: "MIT-licensed collaborative Kanban board with swimlanes, Gantt, calendar views and Trello import.",
    longDescription:
      "WeKan is a FLOSS Kanban board built with Meteor. It offers swimlanes, lists, table, calendar, Gantt and Scrum views, IFTTT-style rules, and imports from Trello, Jira, Asana and many other tools. It runs from Windows/Mac/Linux bundles, Snap, AppImage, Docker or Kubernetes; commercial support is paid.",
    whyListed: "A feature-rich, permissively licensed Trello alternative that can be run on a single machine.",
    category: "project-management",
    resourceType: "PRODUCTIVITY_TOOL",
    officialUrl: "https://wekan.fi/",
    sourceUrl: WEKAN_REPO,
    licenseUrl: "https://github.com/wekan/wekan/blob/main/LICENSE",
    freeStatus: "OPEN_SOURCE",
    openSource: true,
    license: "MIT",
    platforms: ["SELF_HOSTED", "WINDOWS", "MACOS", "LINUX"],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "unknown",
    personalUse: "unknown",
    limitations: [
      "Needs at least 1 GB free RAM; the project recommends 4 GB total for production",
      "Only the newest version is supported; daily database backups are advised",
      "Private support is a paid service",
    ],
    features: [
      "Swimlanes, lists, table, calendar, timeline and Gantt views",
      "Scrum backlog, sprints and burndown charts",
      "IFTTT-style rules",
      "Import from Trello, Jira, Asana, Notion and others",
      "No telemetry",
    ],
    tags: ["kanban", "project-management", "self-hosted", "trello-alternative"],
    alternativeTo: ["Trello", "Jira"],
    relatedResources: ["trello"],
    research: {
      date: DATE,
      sources: [src(WEKAN_REPO, "GitHub README: about, features, platforms, requirements, licence")],
      checks: [
        ok("OFFICIAL_URL", WEKAN_REPO, "Repository About links wekan.fi."),
        ok("FREE_STATUS", WEKAN_REPO, "\"WeKan ® is a FLOSS collaborative kanban board application with MIT license.\""),
        ok("OPEN_SOURCE_STATUS", WEKAN_REPO, "\"Since WeKan ® is a free software, you don't have to trust us with your data\"."),
        ok("LICENSE", WEKAN_REPO, "\"WeKan ® is released under the very permissive MIT license\"."),
        ok("LIMITATIONS", WEKAN_REPO, "\"1 GB RAM minimum free for WeKan ®. Production server should have minimum total 4 GB RAM\"; \"Only newest WeKan ® is supported.\""),
        ok("PLATFORM_AVAILABILITY", WEKAN_REPO, "Platforms: \"Windows/Mac/Linux bundle.zip\", Snap, AppImage, Docker, Kubernetes."),
      ],
      notes: "Read the README. The README also mentions a SaaS ('Free with App or Paid with Admin Panel'); its terms were not checked, so only the self-hosted software is described.",
    },
  },

  /* ------------------------------------------------------------------ */
  /* Collaboration                                                      */
  /* ------------------------------------------------------------------ */
  {
    slug: "etherpad",
    name: "Etherpad",
    shortDescription: "Apache-licensed real-time collaborative text editor with per-author colours and full revision history.",
    longDescription:
      "Etherpad is a real-time collaborative document editor maintained by a volunteer team since 2009. Every keystroke is attributed to its author, a timeslider replays the document's history, and hundreds of plugins extend it. It is self-hosted; public instances run by third parties are also listed by the project.",
    whyListed: "Shared writing on infrastructure you control, with authorship and history built in.",
    category: "collaboration",
    resourceType: "WEB_APP",
    officialUrl: "https://etherpad.org/",
    sourceUrl: ETHERPAD_REPO,
    licenseUrl: "https://github.com/ether/etherpad/blob/develop/LICENSE",
    freeStatus: "OPEN_SOURCE",
    openSource: true,
    license: "Apache-2.0",
    platforms: ["SELF_HOSTED"],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "unknown",
    personalUse: "unknown",
    limitations: [
      "Self-hosting requires Node.js 24 or later",
      "Public instances listed by the project are run by third parties, not the Etherpad Foundation",
    ],
    features: ["Real-time co-editing", "Per-author colours", "Timeslider revision history", "Full data export", "Plugin system", "Translated into 105 languages"],
    tags: ["collaborative-editing", "documents", "self-hosted"],
    alternativeTo: ["Google Docs"],
    research: {
      date: DATE,
      sources: [src(ETHERPAD_REPO, "GitHub README: about, installation, licence")],
      checks: [
        ok("OFFICIAL_URL", ETHERPAD_REPO, "Repository About links etherpad.org."),
        ok("FREE_STATUS", ETHERPAD_REPO, "\"No telemetry. No upsells.\" \"The code is Apache 2.0.\""),
        ok("OPEN_SOURCE_STATUS", ETHERPAD_REPO, "\"The code is Apache 2.0. The data format is open.\""),
        ok("LICENSE", ETHERPAD_REPO, "License: Apache License v2."),
        ok("LIMITATIONS", ETHERPAD_REPO, "Quick install \"Requires git and Node.js >= 24\"; public instances are \"Third party instances not provided by the Etherpad foundation\"."),
        ok("PLATFORM_AVAILABILITY", ETHERPAD_REPO, "\"Etherpad runs on your server, under your governance.\" Installers for macOS/Linux/WSL and Windows PowerShell."),
      ],
      notes: "Read the README (repository now lives at ether/etherpad).",
    },
  },

  /* ------------------------------------------------------------------ */
  /* Spreadsheets                                                       */
  /* ------------------------------------------------------------------ */
  {
    slug: "ethercalc",
    name: "EtherCalc",
    shortDescription: "Web spreadsheet for real-time collaborative editing, self-hostable with Docker; code under mixed open licences.",
    longDescription:
      "EtherCalc is a multi-user web spreadsheet derived from SocialCalc, maintained by Audrey Tang. The current TypeScript rewrite runs on Cloudflare Workers or self-hosts with Docker without a Cloudflare account. Anyone who knows a sheet's URL can read and edit it by default.",
    whyListed: "A quick shared spreadsheet that a team can host without any accounts.",
    category: "spreadsheets",
    resourceType: "WEB_APP",
    officialUrl: "https://ethercalc.net/",
    sourceUrl: ETHERCALC_REPO,
    licenseUrl: "https://github.com/audreyt/ethercalc/blob/main/LICENSE.txt",
    freeStatus: "OPEN_SOURCE",
    openSource: true,
    license: "CPAL-1.0 AND Artistic-2.0 AND CC0-1.0 (per-file)",
    licenseNotes: "The README lists per-file licences: CPAL and Artistic 2.0 for SocialCalc files, CC0 for the TypeScript rewrite, MIT/Apache-2.0 for bundled libraries.",
    platforms: ["SELF_HOSTED"],
    requiresAccount: "no",
    requiresCreditCard: "unknown",
    commercialUse: "unknown",
    personalUse: "unknown",
    limitations: [
      "Anyone who knows a sheet URL can read and write it by default",
      "Internet-facing installs need a reverse proxy for TLS and rate limits; plain Docker is only for trusted networks",
      "Licensing differs file by file",
    ],
    features: ["Real-time multi-user spreadsheet editing", "Docker self-hosting with no Cloudflare account", "REST API", "XLSX import via SheetJS"],
    tags: ["spreadsheet", "collaboration", "self-hosted"],
    alternativeTo: ["Google Sheets"],
    research: {
      date: DATE,
      sources: [src(ETHERCALC_REPO, "GitHub README: install, self-hosting, licensing")],
      checks: [
        ok("OFFICIAL_URL", ETHERCALC_REPO, "\"Overview: https://ethercalc.net/\"."),
        ok("FREE_STATUS", ETHERCALC_REPO, "\"self-hosts anywhere via docker compose up with no Cloudflare account required\"; licensing section lists only open licences."),
        ok("OPEN_SOURCE_STATUS", ETHERCALC_REPO, "Licensing: Common Public Attribution License, Artistic License 2.0, CC0 for packages/**/*.ts, MIT and Apache 2.0 for bundled libraries."),
        ok("LICENSE", ETHERCALC_REPO, "Per-file licences: CPAL (Socialtext), Artistic 2.0, CC0 (TypeScript rewrite), MIT, Apache 2.0, MPL 2.0 (images)."),
        ok("ACCOUNT_REQUIREMENT", ETHERCALC_REPO, "\"The app deliberately keeps anonymous read/write for anyone who knows a room URL\"."),
        ok("LIMITATIONS", ETHERCALC_REPO, "\"Use this path only on a trusted network\"; \"If the instance is reachable from the public internet, you must put a reverse proxy in front\"."),
        ok("PLATFORM_AVAILABILITY", ETHERCALC_REPO, "Install via npm (needs Bun) or Docker; deploys to Cloudflare via wrangler."),
      ],
      notes: "Read the README. The public ethercalc.net instance's terms were not checked, so only self-hosting is described.",
    },
  },

  /* ------------------------------------------------------------------ */
  /* Storage                                                            */
  /* ------------------------------------------------------------------ */
  {
    slug: "seafile-community",
    name: "Seafile Community Edition",
    shortDescription: "Self-hosted file sync and share server with encrypted libraries; server core AGPL, desktop client GPL.",
    longDescription:
      "Seafile is a cloud storage system from Seafile Ltd. for syncing and sharing files in 'libraries', each of which can be encrypted with its own password. The Community Edition server is deployed with Docker, and there are desktop, Android and iOS clients. The Professional Edition is a separate commercial product.",
    whyListed: "A self-hosted alternative to Dropbox or Google Drive for teams that want files on their own server.",
    category: "storage",
    resourceType: "BUSINESS_TOOL",
    officialUrl: "https://www.seafile.com/en/home/",
    sourceUrl: SEAFILE_REPO,
    licenseUrl: "https://github.com/haiwen/seafile/blob/master/LICENSE.txt",
    freeStatus: "OPEN_SOURCE",
    openSource: true,
    license: "AGPL-3.0 (server core); GPL-2.0 (desktop client)",
    licenseNotes: "Per the README: server core AGPLv3, Seahub web UI Apache 2.0, desktop client GPLv2, Android client GPLv3, iOS client Apache 2.0.",
    platforms: ["SELF_HOSTED", "ANDROID", "IOS"],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "unknown",
    personalUse: "unknown",
    limitations: [
      "Professional Edition features need a licence beyond 3 users",
      "The server is deployed with Docker on Linux (or ARM64 on Raspberry Pi)",
    ],
    features: ["Selective folder sync", "Client-side encrypted libraries", "Group sharing", "File metadata and views", "Android and iOS apps"],
    tags: ["file-sync", "cloud-storage", "self-hosted", "dropbox-alternative"],
    alternativeTo: ["Dropbox", "Google Drive"],
    research: {
      date: DATE,
      sources: [
        src(SEAFILE_REPO, "GitHub README: features and licence list"),
        src(SEAFILE_DOWNLOAD, "Official download page: server, clients, Pro edition note"),
      ],
      checks: [
        ok("OFFICIAL_URL", SEAFILE_DOWNLOAD, "Official seafile.com download page for clients and server."),
        ok("FREE_STATUS", SEAFILE_REPO, "\"Seafile is an open source cloud storage system with privacy protection and teamwork features.\""),
        ok("OPEN_SOURCE_STATUS", SEAFILE_REPO, "License list: \"Seafile Server core: AGPLv3\", \"Seahub (Seafile server Web UI): Apache License v2\"."),
        ok("LICENSE", SEAFILE_REPO, "\"Desktop syncing client (this repository): GPLv2\"; \"Seafile Server core: AGPLv3\"."),
        ok("LIMITATIONS", SEAFILE_DOWNLOAD, "\"You don't need a license file to run the pro edition for 3 users.\""),
        ok("PLATFORM_AVAILABILITY", SEAFILE_DOWNLOAD, "Server via Docker for Linux and Raspberry Pi; Android (Play Store/F-Droid) and iOS (App Store) clients."),
      ],
      notes: "Read the README and the download page. Desktop client OS list on the download page was truncated in the fetch, so Windows/macOS/Linux clients are not recorded as platforms.",
    },
  },

  /* ------------------------------------------------------------------ */
  /* Presentations                                                      */
  /* ------------------------------------------------------------------ */
  {
    slug: "reveal-js",
    name: "reveal.js",
    shortDescription: "MIT-licensed HTML presentation framework with Markdown slides, speaker notes and PDF export.",
    longDescription:
      "reveal.js, created by Hakim El Hattab, builds slide decks as web pages. It supports nested slides, Markdown, Auto-Animate, LaTeX, syntax-highlighted code, speaker notes, PDF export and a JavaScript API. A graphical editor (Slides.com) and a video course are separate paid products from the same team.",
    whyListed: "A way to write presentations in HTML or Markdown that run in any browser.",
    category: "presentations",
    resourceType: "DEVELOPER_TOOL",
    officialUrl: "https://revealjs.com/",
    sourceUrl: REVEAL_REPO,
    licenseUrl: "https://github.com/hakimel/reveal.js/blob/master/LICENSE",
    freeStatus: "OPEN_SOURCE",
    openSource: true,
    license: "MIT",
    platforms: ["BROWSER"],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "unknown",
    personalUse: "unknown",
    limitations: ["Slides are written in HTML or Markdown; the visual editor (Slides.com) and the video course are separate"],
    features: ["Nested slides", "Markdown support", "Auto-Animate", "PDF export", "Speaker notes", "LaTeX and syntax-highlighted code"],
    tags: ["slides", "presentations", "html", "markdown"],
    alternativeTo: ["PowerPoint", "Google Slides"],
    relatedResources: ["slidev", "marp"],
    research: {
      date: DATE,
      sources: [src(REVEAL_REPO, "GitHub README")],
      checks: [
        ok("OFFICIAL_URL", REVEAL_REPO, "\"Check out the live demo at revealjs.com\"."),
        ok("FREE_STATUS", REVEAL_REPO, "\"It enables anyone with a web browser to create beautiful presentations for free.\""),
        ok("OPEN_SOURCE_STATUS", REVEAL_REPO, "\"reveal.js is an open source HTML presentation framework.\""),
        ok("LICENSE", REVEAL_REPO, "\"MIT licensed | Copyright © 2011-2026 Hakim El Hattab\"."),
        ok("LIMITATIONS", REVEAL_REPO, "\"Want to create reveal.js presentation in a graphical editor? Try https://slides.com\"; \"Watch the reveal.js video course (paid)\"."),
        ok("PLATFORM_AVAILABILITY", REVEAL_REPO, "\"anyone with a web browser\" can create presentations."),
      ],
      notes: "Read the README.",
    },
  },
  {
    slug: "impress-js",
    name: "impress.js",
    shortDescription: "MIT-licensed presentation framework using CSS3 3D transforms, inspired by Prezi-style zooming canvases.",
    longDescription:
      "impress.js turns an HTML page into a presentation that moves, rotates and zooms across a canvas using CSS 3D transforms and transitions. It has no runtime dependencies, a plugin system and a 'Classic Slides' example for conventional decks.",
    whyListed: "A browser-based option for non-linear, Prezi-like presentations without a paid account.",
    category: "presentations",
    resourceType: "DEVELOPER_TOOL",
    officialUrl: "https://impress.js.org/",
    sourceUrl: IMPRESS_REPO,
    licenseUrl: "https://github.com/impress/impress.js/blob/master/LICENSE",
    freeStatus: "OPEN_SOURCE",
    openSource: true,
    license: "MIT",
    platforms: ["BROWSER"],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "unknown",
    personalUse: "unknown",
    limitations: [
      "Presentations are hand-written in HTML; there is no built-in visual editor",
      "Targets recent browsers; some visitors may not see embedded presentations correctly",
    ],
    features: ["3D positioning, rotation and zoom between steps", "Plugin API", "Classic Slides template", "No jQuery or other library dependencies"],
    tags: ["slides", "presentations", "html", "prezi-alternative"],
    alternativeTo: ["Prezi"],
    research: {
      date: DATE,
      sources: [src(IMPRESS_REPO, "GitHub README: usage, browser support, licence")],
      checks: [
        ok("OFFICIAL_URL", IMPRESS_REPO, "Repository About links impress.js.org."),
        ok("FREE_STATUS", IMPRESS_REPO, "\"Released under the MIT License\"; direct CDN download links provided."),
        ok("OPEN_SOURCE_STATUS", IMPRESS_REPO, "Public source repository under the MIT licence."),
        ok("LICENSE", IMPRESS_REPO, "\"Copyright 2011-2012 Bartek Szopka (@bartaz), 2016-2023 Henrik Ingo ... Released under the MIT License\"."),
        ok("LIMITATIONS", IMPRESS_REPO, "\"be aware that in this some of your visitors may not see the presentation correctly, or at all.\""),
        ok("PLATFORM_AVAILABILITY", IMPRESS_REPO, "\"recent versions of Firefox and Chrome are known to work well. Reportedly IE now works too.\""),
      ],
      notes: "Read the README. Impressionist, the sibling GUI editor, was not checked.",
    },
  },

  /* ------------------------------------------------------------------ */
  /* Templates                                                          */
  /* ------------------------------------------------------------------ */
  {
    slug: "start-bootstrap",
    name: "Start Bootstrap",
    shortDescription: "MIT-licensed Bootstrap website templates: landing pages, portfolios, blogs, resumes and admin dashboards.",
    longDescription:
      "Start Bootstrap publishes Bootstrap HTML themes and templates on GitHub, including SB Admin dashboards, landing page, agency, freelancer, creative, resume and blog themes. The template repositories are MIT-licensed, so they can be modified and reused.",
    whyListed: "Ready-made, permissively licensed starting points for small-business websites and internal dashboards.",
    category: "templates",
    resourceType: "TEMPLATE",
    officialUrl: "https://startbootstrap.com/",
    sourceUrl: SB_ORG,
    licenseUrl: SB_LICENSE,
    freeStatus: "OPEN_SOURCE",
    openSource: true,
    license: "MIT",
    platforms: ["BROWSER"],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "unknown",
    personalUse: "unknown",
    limitations: [
      "Several template repositories were last updated in 2024",
      "Requires editing HTML/Pug and SCSS; these are code templates, not a site builder",
    ],
    features: ["Admin dashboard themes (SB Admin, SB Admin 2)", "Landing page, agency, freelancer and creative one-page themes", "Resume and blog themes", "Jekyll blog variant"],
    tags: ["website-templates", "bootstrap", "html", "landing-page"],
    research: {
      date: DATE,
      sources: [
        src(SB_ORG, "GitHub organisation page: template repositories and their licences"),
        src(SB_LICENSE, "LICENSE of the landing-page template"),
      ],
      checks: [
        ok("OFFICIAL_URL", SB_ORG, "Organisation profile links https://startbootstrap.com."),
        ok("FREE_STATUS", SB_ORG, "\"A free, open source, Bootstrap admin theme created by Start Bootstrap\"; repositories shown as MIT."),
        ok("OPEN_SOURCE_STATUS", SB_ORG, "Template repositories are listed with the MIT licence (creative, sb-admin, agency, landing-page, grayscale, personal and others)."),
        ok("LICENSE", SB_LICENSE, "\"The MIT License (MIT) Copyright (c) 2013-2023 Start Bootstrap LLC\"."),
        ok("LIMITATIONS", SB_ORG, "Repository list shows last updates such as \"Updated Jul 8, 2024\" and \"Updated Jun 20, 2024\"."),
      ],
      notes: "startbootstrap.com returned no readable content to the fetcher, so facts come from the official GitHub organisation and a template LICENSE. Whether the website also sells paid products was not checked.",
    },
  },

  /* ------------------------------------------------------------------ */
  /* Business finance (India)                                           */
  /* ------------------------------------------------------------------ */
  {
    slug: "gst-returns-offline-tool",
    name: "GST Returns Offline Tool",
    shortDescription: "Official GSTN Windows utility to prepare GSTR-1 invoice data offline before uploading to the GST portal.",
    longDescription:
      "The Returns Offline Tool is published on the Goods and Services Tax portal of the Government of India. It lets taxpayers collate invoices and other return data offline, using section-wise CSV files or the bundled Excel workbook template, and then upload them. The download includes a user manual and a SHA-256 checksum to verify the file.",
    whyListed: "Helps Indian small businesses and accountants prepare GST return data without an internet connection or paid software.",
    category: "business-finance",
    resourceType: "DESKTOP_APP",
    officialUrl: GST_TOOL,
    freeStatus: "FREE",
    openSource: false,
    platforms: ["WINDOWS"],
    languages: ["en"],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "unknown",
    personalUse: "unknown",
    limitations: [
      "Windows 7 or later only; the tool does not work on Linux or Mac",
      "Covers only GSTR-1 and GSTR-2 forms",
      "Needs Microsoft Excel 2010 or later for the workbook template",
    ],
    features: ["Offline preparation of invoice data", "Section-wise CSV files", "GSTR-1 and GSTR-2 Excel workbook template", "User manual and SHA-256 checksum"],
    tags: ["gst", "india", "tax", "government"],
    research: {
      date: DATE,
      sources: [src(GST_TOOL, "GST portal Downloads > Returns: Returns Offline Tool")],
      checks: [
        ok("OFFICIAL_URL", GST_TOOL, "Page on www.gst.gov.in, \"Goods and Services Tax, Government of India, States and Union Territories\"."),
        ok("FREE_STATUS", GST_TOOL, "\"Download, extract and run the Returns Offline Tool\" — a public download with no fee mentioned."),
        ok("LIMITATIONS", GST_TOOL, "\"Currently this tool is available only for GSTR-1 and GSTR-2 form.\"; \"The tool does not work on Linux and Mac.\""),
        ok("PLATFORM_AVAILABILITY", GST_TOOL, "\"Operating system Windows 7 or above.\""),
      ],
      notes: "Read the Returns downloads page (version V3.2.4 at the time). Whether the upload step requires a GST login was not stated on this page, so account is left unknown.",
    },
  },
  {
    slug: "udyam-registration",
    name: "Udyam Registration (MSME)",
    shortDescription: "Government of India portal for free, paperless MSME registration with an online certificate.",
    longDescription:
      "Udyam Registration is the Ministry of MSME's portal for registering micro, small and medium enterprises. Registration is online and self-declared using an Aadhaar number, with PAN and GST details pulled from government databases. It issues a permanent registration number and a certificate with a QR code, and needs no renewal.",
    whyListed: "Registration as an MSME is a prerequisite for many Indian government schemes, and this is the only official, no-fee route.",
    category: "business-finance",
    resourceType: "WEBSITE",
    officialUrl: UDYAM,
    freeStatus: "FREE",
    openSource: false,
    platforms: ["BROWSER"],
    languages: ["en"],
    requiresAccount: "unknown",
    requiresCreditCard: "no",
    commercialUse: "unknown",
    personalUse: "unknown",
    limitations: [
      "For enterprises in India; PAN and GSTIN (where applicable) are required",
      "Only one Udyam Registration is allowed per enterprise",
      "Beware of private look-alike sites; only the government portal and its single-window systems are authorised",
    ],
    features: [
      "Paperless, self-declaration based registration",
      "Permanent registration number with no renewal",
      "Online certificate with dynamic QR code",
      "Print and verify certificates; migrate from Udyog Aadhaar (UAM)",
    ],
    tags: ["msme", "india", "government", "business-registration"],
    research: {
      date: DATE,
      sources: [src(UDYAM, "Udyam Registration portal home page")],
      checks: [
        ok("OFFICIAL_URL", UDYAM, "\"This is the only Government Portal for MSME (Udyam) Registration\"; content managed by the Ministry of MSME, hosted by NIC."),
        ok("FREE_STATUS", UDYAM, "\"Udyam (MSME) Registration is Free of Cost and paperless.\""),
        ok("PRICING_INFORMATION", UDYAM, "\"Registration Process is totally free. No Costs or Fees are to be paid to anyone.\""),
        ok("CREDIT_CARD_REQUIREMENT", UDYAM, "\"No Costs or Fees are to be paid to anyone.\""),
        ok("LIMITATIONS", UDYAM, "\"Having PAN and GSTIN ... is required\"; \"No enterprise shall file more than one Udyam Registration.\""),
        ok("PLATFORM_AVAILABILITY", UDYAM, "\"MSME registration process is fully online, paperless and based on self-declaration.\""),
      ],
      notes: "Read the portal home page. The page carries an AI translation disclaimer; other interface languages were not inspected, so only English is recorded.",
    },
  },
]);
