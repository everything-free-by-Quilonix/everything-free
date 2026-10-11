import type { Resource } from "@/types/resource";

import { defineMediaList } from "./define-media";

/**
 * Animation, part 1. Every value is backed by a page read on 2026-10-11.
 */

const TERMS = "https://studio.blender.org/terms-and-conditions";
const FILMS = "https://studio.blender.org/films/";
const BBB = "https://studio.blender.org/projects/big-buck-bunny/";

export const watchAnimation1Resources: Resource[] = defineMediaList([
  {
    slug: "blender-studio-open-movies",
    name: "Blender Studio open movies",
    shortDescription: "The Blender open movies, from Elephants Dream to Singularity, licensed CC BY 4.0; some extras are members-only.",
    longDescription:
      "Blender Studio, run by the Blender Institute, has made a series of animated 'open movies' since 2006 — Elephants Dream, Big Buck Bunny, Sintel, Tears of Steel, Spring, Sprite Fright, Charge, Wing It! and Singularity among them. Its terms say all digital content, video included, is under Creative Commons Attribution 4.0 unless noted otherwise. On the Studio site itself, some videos and production files are for paying members.",
    whyListed: "Professional-quality animated shorts you may watch, share and remix with credit, made with free software.",
    category: "anime",
    subcategories: ["animation"],
    resourceType: "WEBSITE",
    officialUrl: FILMS,
    licenseUrl: TERMS,
    pricingUrl: TERMS,
    freeStatus: "FREE_TIER",
    openSource: false,
    platforms: ["BROWSER"],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "yes",
    personalUse: "yes",
    limitations: [
      "Some videos and production files on Blender Studio are marked 'Subscribe to view'; membership is €9.90 a month (per the terms dated April 2020).",
      "Trademarks and logos, including the Blender logo, are not covered by the CC BY licence.",
    ],
    tags: ["open-movies", "animation", "creative-commons", "blender", "short-films"],
    media: {
      formats: ["animation", "short-film"],
      access: ["free_tier"],
      offering: "selected-content",
      contentScope: "selected-works",
      provider: "Blender Institute",
      containsAds: "unknown",
      hasPaidFeatures: "yes",
      genres: ["fantasy", "comedy", "sci-fi"],
      contentLanguages: ["en"],
      region: { india: "unknown", availableIn: [] },
      contentLicense: {
        kind: "open-license",
        summary: "Unless noted otherwise, all digital content — video, artwork, 3D data — is CC BY 4.0.",
        creatorUse: "allowed-with-attribution",
        url: TERMS,
        sourceUrl: TERMS,
        attribution: "Credit Blender Foundation / Blender Studio as the licence requires",
      },
    },
    research: {
      date: "2026-10-11",
      sources: [
        { url: FILMS, label: "Films page: list of Blender open movies from Elephants Dream (2006) to Singularity (2026)" },
        { url: TERMS, label: "Terms: content under CC BY 4.0 unless notified otherwise; membership 9.90 EUR/month; registration free" },
        { url: BBB, label: "Big Buck Bunny project page: 'Watch Big Buck Bunny'; some gallery videos marked 'Subscribe to view'" },
      ],
      checks: [
        {
          check: "OFFICIAL_URL",
          result: "confirmed",
          evidence: "studio.blender.org/films is the Blender Studio's own list of its open movies.",
          sourceUrl: FILMS,
        },
        {
          check: "FREE_STATUS",
          result: "confirmed",
          evidence: "The terms put all content under CC BY 4.0, while the project page marks some videos 'Subscribe to view' for members: a free tier.",
          sourceUrl: BBB,
        },
        {
          check: "COMMERCIAL_USE",
          result: "confirmed",
          evidence: "CC BY 4.0, which the terms apply to all digital content unless noted, permits commercial use with attribution.",
          sourceUrl: TERMS,
        },
        {
          check: "PRICING_INFORMATION",
          result: "confirmed",
          evidence: "The terms list membership at 9.90 EUR/month with automatic renewal (14.90 EUR manual), dated April 2020.",
          sourceUrl: TERMS,
        },
        {
          check: "LIMITATIONS",
          result: "confirmed",
          evidence: "The Big Buck Bunny page marks the making-of and some film videos 'Subscribe to view'; trademarks are excluded from the licence.",
          sourceUrl: BBB,
        },
      ],
      notes:
        "Licence and the members-only boundary read from Blender Studio's own pages. Which individual films play without membership on studio.blender.org was not checked one by one; the membership price may be out of date (terms dated 2020).",
    },
  },
]);
