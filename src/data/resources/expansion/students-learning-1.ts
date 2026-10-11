import type { Resource, VerificationCheck, VerificationCheckRecord } from "@/types/resource";

import type { ResearchSource } from "../entertainment/define-media";
import { defineResearchedList } from "./define-researched";

/**
 * Students & learning, batch 1: Indian student portals (scholarships, internships,
 * board sample papers) plus exam practice, courses, language and mathematics
 * resources. Every value below comes from a page fetched on DATE. Not registered.
 */

const DATE = "2026-10-11";
const ok = (check: VerificationCheck, sourceUrl: string, evidence: string): VerificationCheckRecord => ({
  check,
  result: "confirmed",
  evidence,
  sourceUrl,
});
const src = (url: string, label: string): ResearchSource => ({ url, label });

/* India ------------------------------------------------------------------- */
const NSP_HOME = "https://scholarships.gov.in/";
const AICTE_NIP = "https://internship.aicte-india.org/";
const CBSE_SQP_XII = "https://cbseacademic.nic.in/SQP_CLASSXII_2025-26.html";

/* Global ------------------------------------------------------------------ */
const GRE_POWERPREP = "https://www.ets.org/gre/test-takers/general-test/prepare/powerprep.html";
const MS_LEARN_HOME = "https://learn.microsoft.com/en-us/training/";
const MS_LEARN_FAQ = "https://learn.microsoft.com/en-us/training/support/faq";
const OLI_INDEPENDENT = "https://oli.cmu.edu/independent-learner-courses/";
const ROADMAP_HOME = "https://roadmap.sh/";
const ROADMAP_ABOUT = "https://roadmap.sh/about";
const LT_HOME = "https://www.languagetransfer.org/";
const TATOEBA_ABOUT = "https://tatoeba.org/en/about";
const TATOEBA_TERMS = "https://tatoeba.org/en/terms_of_use";
const POLYPAD_HOME = "https://polypad.amplify.com/";
const PAULS_HOME = "https://tutorial.math.lamar.edu/";
const PAULS_TERMS = "https://tutorial.math.lamar.edu/Terms.aspx";
const PURDUE_OWL = "https://owl.purdue.edu/owl/purdue_owl.html";

export const studentsLearning1Resources: Resource[] = defineResearchedList([
  /* ------------------------------------------------------------------ India */
  {
    slug: "national-scholarship-portal",
    name: "National Scholarship Portal (NSP)",
    shortDescription: "Government of India portal for applying to central and state scholarship schemes and tracking payments.",
    longDescription:
      "The National Scholarship Portal is the Government of India's single window for scholarship schemes, run with the Ministry of Electronics & Information Technology. Students generate a One Time Registration (OTR) number from Aadhaar, check eligibility, apply to schemes, and track application status and payment. Institutes and nodal officers verify applications on the same portal.",
    whyListed:
      "It is the official place to apply for many central scholarships, so students do not need to pay agents or use look-alike sites to find and submit applications.",
    category: "students",
    subcategories: ["career"],
    resourceType: "SERVICE",
    officialUrl: NSP_HOME,
    freeStatus: "FREE",
    openSource: false,
    platforms: ["BROWSER", "ANDROID"],
    languages: ["en", "hi", "gu", "ta"],
    requiresAccount: "yes",
    requiresCreditCard: "unknown",
    commercialUse: "unknown",
    personalUse: "yes",
    limitations: [
      "An OTR number generated from Aadhaar or an Aadhaar Enrolment ID is required before applying",
      "Face authentication through the NSP OTR app fails if Aadhaar biometrics are locked",
      "Assisted applications at Common Service Centres cost Rs 30 per candidate, as the portal states",
      "Disabled students must first give consent on the UDID portal before submitting an application",
    ],
    features: [
      "One Time Registration valid for the student's whole academic career",
      "Scholarship eligibility check and list of schemes",
      "Application status and payment tracking",
      "NSP OTR app on Google Play",
      "Institute search and grievance registration",
    ],
    tags: ["scholarships", "india", "government", "students", "financial-aid"],
    research: {
      date: DATE,
      sources: [src(NSP_HOME, "NSP homepage: student services, announcements, OTR requirement, CSC charges")],
      checks: [
        ok("OFFICIAL_URL", NSP_HOME, "Page header reads \"NSP : National Scholarship Portal · Government of India · Ministry of Electronics & Information Technology\"."),
        ok(
          "FREE_STATUS",
          NSP_HOME,
          "Students apply online via \"Apply For One Time Registration (OTR)\" and \"Apply For Scholarship\" with no fee shown; the only charge stated is for assisted filing at CSCs: \"fixed at Rs 30.00 (inclusive of all applicable taxes, etc.)\".",
        ),
        ok(
          "ACCOUNT_REQUIREMENT",
          NSP_HOME,
          "\"OTR is required to apply for scholarship on National Scholarship Portal.\" \"OTR can be generated using Aadhaar/Aadhaar Enrollment number(EID)\".",
        ),
        ok("PLATFORM_AVAILABILITY", NSP_HOME, "\"NSP OTR App is available on Google Play Store.\" alongside the web portal."),
        ok(
          "LIMITATIONS",
          NSP_HOME,
          "\"All disabled students must first login in the UDID portal and provide consent ... Otherwise, they will not be able to submit their application.\" Face authentication fails if biometrics are locked in Aadhaar.",
        ),
      ],
      notes:
        "Read the NSP homepage only. Individual scheme guidelines, amounts and eligibility were not read; whether every scheme is open to every state was not checked.",
    },
  },
  {
    slug: "aicte-national-internship-portal",
    name: "AICTE National Internship Portal",
    shortDescription: "AICTE's internship portal listing government, PSU and company internships for AICTE, UGC and IGNOU students.",
    longDescription:
      "The National Internship Portal is run by the All India Council for Technical Education under the Ministry of Education. It lists internships from ministries, PSUs, state governments and companies, including TULIP smart-city, Indian Army, NHAI and rural-development programmes, with filters for remote work, stipend, closing date and state.",
    whyListed:
      "It gathers government and industry internships for Indian students in one official place, including national-mission internships that are hard to find elsewhere.",
    category: "career",
    subcategories: ["students"],
    resourceType: "SERVICE",
    officialUrl: AICTE_NIP,
    freeStatus: "FREE",
    openSource: false,
    platforms: ["BROWSER"],
    languages: ["en", "hi"],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "unknown",
    personalUse: "yes",
    limitations: [
      "Aimed at students of AICTE, UGC and IGNOU institutions, as the portal describes itself",
      "Eligibility, stipend and selection are set by each posting organisation, not by the portal",
    ],
    features: [
      "Government internships such as TULIP, Indian Army, NHAI and PRATIBHA",
      "Filters for remote and hybrid, highest stipend, closing this week and state",
      "Separate logins for students, institutes, employers and government bodies",
      "Internship report and impact reports by state",
    ],
    tags: ["internships", "india", "aicte", "government", "jobs"],
    research: {
      date: DATE,
      sources: [src(AICTE_NIP, "National Internship Portal homepage: listings, logins, registration")],
      checks: [
        ok(
          "OFFICIAL_URL",
          AICTE_NIP,
          "\"National Internship Portal by AICTE, Ministry of Education, Government of India. Internships for AICTE, UGC, IGNOU and other students.\"",
        ),
        ok("FREE_STATUS", AICTE_NIP, "The homepage offers \"Register Free\" for students; no fee for students is mentioned."),
        ok(
          "LIMITATIONS",
          AICTE_NIP,
          "Describes itself as \"Internships for AICTE, UGC, IGNOU and other students\"; each posting is by a separate host such as TULIP (MoHUA) or NHIDCL.",
        ),
      ],
      notes:
        "Read the portal homepage. Whether an account is needed to apply was not stated outright, so requiresAccount stays unknown. Terms of use were not read.",
    },
  },
  {
    slug: "cbse-sample-question-papers",
    name: "CBSE Sample Question Papers",
    shortDescription: "CBSE's official subject-wise sample question papers and marking schemes for board exams, as PDF downloads.",
    longDescription:
      "The Central Board of Secondary Education publishes sample question papers (SQP) and marking schemes (MS) for each board-exam subject on its academic website. The Class XII page for the 2025-26 exam lists papers for sciences, commerce, humanities, Indian and foreign languages, music and dance, many with Hindi versions alongside English.",
    whyListed:
      "The board's own sample papers and marking schemes show the paper pattern and how answers are marked, which paid guidebooks often reprint.",
    category: "exams",
    subcategories: ["students"],
    resourceType: "EDUCATIONAL_RESOURCE",
    officialUrl: CBSE_SQP_XII,
    freeStatus: "FREE",
    openSource: false,
    platforms: ["BROWSER"],
    languages: ["en", "hi"],
    requiresAccount: "no",
    requiresCreditCard: "unknown",
    commercialUse: "unknown",
    personalUse: "yes",
    downloadAvailable: true,
    limitations: [
      "The page read covers Class XII papers for the 2025-26 exam; papers for other classes and years are on separate pages",
      "Hindi versions are offered for some subjects only",
    ],
    features: [
      "Sample question paper and marking scheme for each subject",
      "Separate page for skill-subject sample papers",
      "Indian-language papers including Assamese, Bengali, Tamil, Telugu and Urdu",
    ],
    tags: ["cbse", "board-exams", "india", "sample-papers", "class-12"],
    research: {
      date: DATE,
      sources: [src(CBSE_SQP_XII, "CBSE Academic: Class XII SQP & marking scheme for exam 2025-26")],
      checks: [
        ok("OFFICIAL_URL", CBSE_SQP_XII, "Page footer: \"© 2025 CBSE Research & Development Unit\"; heading \"Class XII Sample Question Paper & Marking Scheme for Exam 2025-26\"."),
        {
          check: "FREE_STATUS",
          result: "unresolved",
          sourceUrl: CBSE_SQP_XII,
          evidence:
            "Each subject row links straight to PDF files with no fee, login or registration step shown, but the page does not state that the papers are free, so this is not recorded as confirmed.",
        },
        ok("ACCOUNT_REQUIREMENT", CBSE_SQP_XII, "SQP and MS links are direct PDF links on a public page, with no sign-in shown."),
      ],
      notes:
        "Read the Class XII 2025-26 sample paper page only. Whether 2026-27 papers have been published was not checked. Reuse terms for the PDFs were not read.",
    },
  },

  /* ----------------------------------------------------------------- Global */
  {
    slug: "gre-powerprep-free-practice-tests",
    name: "GRE POWERPREP Practice Tests (ETS)",
    shortDescription: "Two official full-length GRE General Test practice tests from ETS at no cost; scored PLUS tests are paid.",
    longDescription:
      "ETS, which runs the GRE, offers POWERPREP Online practice tests. Two are free: POWERPREP 1, an untimed full-length test without Verbal and Quantitative scores, and POWERPREP 2, a timed full-length test. Both include correct answers and scored sample essays. POWERPREP PLUS tests with instant scoring and explanations are sold separately.",
    whyListed:
      "These are practice tests from the organisation that writes the exam, so students can rehearse the real format before paying for prep materials.",
    category: "exams",
    subcategories: ["students"],
    resourceType: "EDUCATIONAL_RESOURCE",
    officialUrl: GRE_POWERPREP,
    pricingUrl: GRE_POWERPREP,
    freeStatus: "LIMITED_FREE",
    openSource: false,
    platforms: ["BROWSER"],
    requiresAccount: "yes",
    requiresCreditCard: "unknown",
    commercialUse: "unknown",
    personalUse: "yes",
    limitations: [
      "Only two practice tests are free; POWERPREP PLUS Online costs $44.95 per practice test",
      "The untimed POWERPREP 1 test gives no Verbal or Quantitative Reasoning scores",
      "A GRE account is needed to access the practice tests",
    ],
    features: [
      "POWERPREP 1: one untimed full-length practice test",
      "POWERPREP 2: one timed full-length practice test",
      "Correct answers for Verbal and Quantitative Reasoning questions",
      "Scored Analytical Writing sample essays with rater commentary",
      "Free 10-question GRE Mini Quiz",
    ],
    tags: ["gre", "test-prep", "practice-tests", "graduate-admissions", "ets"],
    research: {
      date: DATE,
      sources: [src(GRE_POWERPREP, "ETS POWERPREP page: free and paid practice tests, price")],
      checks: [
        ok("OFFICIAL_URL", GRE_POWERPREP, "\"Copyright © 2026 by ETS.\" Page is part of the GRE section of ets.org."),
        ok(
          "FREE_STATUS",
          GRE_POWERPREP,
          "\"Try our free POWERPREP Online practice tests. With both timed and untimed options\" — POWERPREP 1 untimed and POWERPREP 2 timed.",
        ),
        ok("PRICING_INFORMATION", GRE_POWERPREP, "\"POWERPREP® PLUS Online $44.95 per practice test\"."),
        ok("ACCOUNT_REQUIREMENT", GRE_POWERPREP, "\"Create a free GRE account to schedule your test, access prep materials, view scores, and more.\""),
        ok(
          "LIMITATIONS",
          GRE_POWERPREP,
          "\"Users taking POWERPREP Online Practice Test 1 under untimed conditions will not receive scores on the Verbal Reasoning and Quantitative Reasoning measures.\"",
        ),
      ],
      notes:
        "Read the POWERPREP page. System requirements and the POWERPREP FAQ PDF were not read; payment details for an account were not checked.",
    },
  },
  {
    slug: "microsoft-learn-training",
    name: "Microsoft Learn Training",
    shortDescription: "Microsoft's self-paced learning paths and modules on Azure, Power BI, .NET and more, open without a profile.",
    longDescription:
      "Microsoft Learn is Microsoft's training site, with interactive learning paths and modules, career paths and a student hub. Microsoft states the training is free and that all content can be read without creating a profile; signing in adds progress tracking, achievements, collections and certification-exam registration.",
    whyListed:
      "It is the vendor's own training for widely used cloud and data tools, with no paywall on the lessons.",
    category: "courses",
    subcategories: ["career"],
    resourceType: "COURSE",
    officialUrl: MS_LEARN_HOME,
    freeStatus: "FREE",
    openSource: false,
    platforms: ["BROWSER"],
    languages: ["en", "ja", "ko", "zh", "ru", "de", "es", "fr", "it", "pt"],
    requiresAccount: "no",
    requiresCreditCard: "unknown",
    commercialUse: "unknown",
    personalUse: "yes",
    limitations: [
      "Learn sandboxes are no longer available; hands-on exercises need your own Azure subscription",
      "Progress tracking, achievements, AI features and certification-exam registration need a Microsoft Learn profile",
    ],
    features: [
      "Learning paths and modules organised by role and product",
      "Career paths aligned with Microsoft credentials",
      "Student Hub with skilling events",
      "Localised training in many languages, varying by product",
    ],
    tags: ["microsoft", "azure", "cloud", "training", "it-skills"],
    research: {
      date: DATE,
      sources: [
        src(MS_LEARN_HOME, "Microsoft Learn training homepage"),
        src(MS_LEARN_FAQ, "Microsoft Learn training FAQ: cost, profile, sandboxes, languages"),
      ],
      checks: [
        ok("OFFICIAL_URL", MS_LEARN_HOME, "\"Welcome to Microsoft Learn\"; footer \"© Microsoft 2026\"."),
        ok(
          "FREE_STATUS",
          MS_LEARN_FAQ,
          "\"How much does the training cost? Microsoft Learn training is free and available to anyone who has an interest to learn about Microsoft products.\"",
        ),
        ok(
          "ACCOUNT_REQUIREMENT",
          MS_LEARN_FAQ,
          "\"Do I need to create a profile to use Microsoft Learn? No, profile creation isn't required. If you don't have a profile, you can still access and consume all content.\"",
        ),
        ok(
          "LIMITATIONS",
          MS_LEARN_FAQ,
          "\"Sandboxes are no longer available. To complete exercises in training modules, you'll need access to an Azure subscription.\"",
        ),
      ],
      notes:
        "Read the training homepage and training FAQ. Certification exam prices were not checked. Languages listed are the training languages the FAQ names for Azure, using base codes.",
    },
  },
  {
    slug: "cmu-oli-independent-learner-courses",
    name: "CMU Open Learning Initiative (Independent Learners)",
    shortDescription: "Carnegie Mellon's self-paced OLI courses for independent learners; many are open at no cost, some are low-cost.",
    longDescription:
      "The Open Learning Initiative at Carnegie Mellon University publishes interactive courses with practice, hints and instant feedback. Its independent-learner catalogue lists self-guided courses in subjects such as languages, mathematics, statistics, computer science and student success. CMU says many are free or low-cost; paid independent courses carry no instructor, tests, certificate or credit.",
    whyListed:
      "OLI courses come from a learning-science research group, and a share of the self-paced catalogue is open at no cost.",
    category: "courses",
    subcategories: ["learning"],
    resourceType: "COURSE",
    officialUrl: OLI_INDEPENDENT,
    freeStatus: "LIMITED_FREE",
    openSource: false,
    platforms: ["BROWSER"],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "unknown",
    personalUse: "yes",
    licenseNotes: "The OLI website footer states \"Licensed under CC BY-NC-SA 4.0\"; licences of individual course materials were not checked.",
    limitations: [
      "Not every course is free: examples on the catalogue page cost $10 and $25",
      "Paid independent courses have no instructor, no tests, no certificate and no credits",
    ],
    features: [
      "Self-guided courses that do not require a teacher or classroom",
      "Catalogue areas including mathematics and logic, language and speech, and data science",
      "Interactive practice with instant feedback, per the OLI homepage",
    ],
    tags: ["carnegie-mellon", "self-paced", "online-courses", "statistics", "university"],
    research: {
      date: DATE,
      sources: [src(OLI_INDEPENDENT, "OLI independent learner catalogue: free and low-cost courses, examples with prices")],
      checks: [
        ok("OFFICIAL_URL", OLI_INDEPENDENT, "\"© 2025 Open Learning Initiative, Carnegie Mellon University.\""),
        ok(
          "FREE_STATUS",
          OLI_INDEPENDENT,
          "\"These courses are self-guided and do not require a teacher or classroom. Many are free or low-cost and open to the public.\"",
        ),
        ok("PRICING_INFORMATION", OLI_INDEPENDENT, "Latest courses list \"Arabic 2 for Independent Learners (self-paced) $25\" and \"Beyond Backpacks ... $10\"."),
        ok(
          "LIMITATIONS",
          OLI_INDEPENDENT,
          "\"Independent paid OLI courses are self-paced with no instructor, no tests, no certificate, no credits.\"",
        ),
      ],
      notes:
        "Read the independent-learner catalogue page (selective extract). Which specific courses are free was not enumerated; whether a sign-in is needed for free courses was not settled.",
    },
  },
  {
    slug: "roadmap-sh",
    name: "roadmap.sh",
    shortDescription: "Community-curated learning roadmaps and guides for developer roles and skills, with progress tracking.",
    longDescription:
      "roadmap.sh, created by Kamran Ahmed, publishes interactive role-based and skill-based roadmaps (frontend, backend, DevOps, data, AI and more) with linked learning resources, guides and interview questions. Roadmaps are created and reviewed by the community. Newer lesson packs with projects start with free lessons, and the site also offers an AI tutor.",
    whyListed:
      "It gives students and career changers a free map of what to learn next for a given tech role, without buying a course first.",
    category: "career",
    subcategories: ["learning"],
    resourceType: "EDUCATIONAL_RESOURCE",
    officialUrl: ROADMAP_HOME,
    freeStatus: "FREE_TIER",
    openSource: false,
    platforms: ["BROWSER"],
    languages: ["en"],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "unknown",
    personalUse: "yes",
    limitations: [
      "Lesson packs \"start with free lessons\"; the page does not say every lesson in a pack is free",
      "The content licence does not allow redistributing roadmap content elsewhere",
      "AI tutor pricing and limits were not documented on the pages read",
    ],
    features: [
      "Role-based roadmaps such as Frontend, Backend, DevOps and AI Engineer",
      "Skill-based roadmaps such as Python, SQL, System Design and Data Structures",
      "Click-through learning resources and progress tracking",
      "Guides and interview question sets",
    ],
    tags: ["developer-roadmaps", "career-planning", "programming", "self-study", "tech-careers"],
    research: {
      date: DATE,
      sources: [
        src(ROADMAP_HOME, "roadmap.sh homepage: roadmaps, lesson packs"),
        src(ROADMAP_ABOUT, "roadmap.sh about/FAQ: what it is, content licence, open-core codebase"),
      ],
      checks: [
        ok("OFFICIAL_URL", ROADMAP_ABOUT, "\"Hello, I am Kamran Ahmed. I created roadmap.sh to help developers find their path\"."),
        ok(
          "FREE_STATUS",
          ROADMAP_HOME,
          "\"Skill up with community created roadmaps, guides, and courses.\" Lesson packs: \"Short lessons, hands-on projects and an AI tutor ... Every pack starts with free lessons.\"",
        ),
        ok(
          "PERSONAL_USE",
          ROADMAP_ABOUT,
          "\"the license of the content on this website does not allow you to redistribute any of the content ... You can use it for personal use or share the link to the content\".",
        ),
        ok("LIMITATIONS", ROADMAP_ABOUT, "\"No, the license of the content on this website does not allow you to redistribute any of the content on this website anywhere.\""),
      ],
      notes:
        "Read the homepage and about page. The about page calls the project \"open-core\" with code on GitHub; the code licence was not read, so openSource is not claimed. Pricing for paid lessons or the AI tutor was not read.",
    },
  },
  {
    slug: "language-transfer",
    name: "Language Transfer",
    shortDescription: "Audio language courses using The Thinking Method, with no price tags, adverts or sign-ups.",
    longDescription:
      "Language Transfer is a donation-funded project offering audio courses built on The Thinking Method. Courses on the site include Spanish, Arabic, Turkish, Greek, German, Italian, Swahili, French and English for Spanish speakers, plus an introduction to music theory. There is also an app.",
    whyListed:
      "It offers full audio courses with no paywall, no adverts and no account, funded by donations.",
    category: "languages",
    subcategories: ["learning"],
    resourceType: "COURSE",
    officialUrl: LT_HOME,
    freeStatus: "FREE",
    openSource: false,
    platforms: ["BROWSER"],
    languages: ["en"],
    requiresAccount: "no",
    requiresCreditCard: "no",
    commercialUse: "unknown",
    personalUse: "yes",
    limitations: [
      "Runs on donations, so course coverage depends on the project's capacity",
      "Some newer material is first released as tester material on YouTube",
    ],
    features: [
      "Audio courses for Spanish, Arabic, Turkish, Greek, German, Italian, Swahili and French",
      "English course for Spanish speakers",
      "Introduction to music theory",
      "No adverts and no data selling, per the site",
    ],
    tags: ["language-learning", "audio-courses", "spanish", "arabic", "donation-funded"],
    research: {
      date: DATE,
      sources: [src(LT_HOME, "Language Transfer homepage: courses, funding model")],
      checks: [
        ok("OFFICIAL_URL", LT_HOME, "Site header \"Language Transfer\" with Free Courses, About, Collaborate and Donate pages."),
        ok(
          "FREE_STATUS",
          LT_HOME,
          "\"there are no price tags to access any of the material lovingly and painstakingly created, but there are also no adverts, no sign-ups and no-one asking for or selling your data.\"",
        ),
        ok("ACCOUNT_REQUIREMENT", LT_HOME, "The homepage says there are \"no adverts, no sign-ups and no-one asking for or selling your data\", so no account is needed to use the courses."),
        ok("CREDIT_CARD_REQUIREMENT", LT_HOME, "\"no price tags to access any of the material\"; payment appears only as optional donations via Patreon or PayPal."),
      ],
      notes:
        "Read the homepage. Course names are taken from the course links on that page. The app's platforms were not checked, so only the browser is listed. Reuse terms for the audio were not read.",
    },
  },
  {
    slug: "tatoeba",
    name: "Tatoeba",
    shortDescription: "Volunteer-built database of example sentences and translations across many languages, under Creative Commons.",
    longDescription:
      "Tatoeba is a database of sentences and translations contributed by volunteers, run by the non-profit Tatoeba Association in France. Searching a word returns sentences that use it, with translations in chosen languages. Text sentences default to CC BY 2.0 FR; some audio carries other licences. Data downloads and an API are offered.",
    whyListed:
      "Learners can see words used in real sentences with translations, and the openly licensed data can be reused with attribution.",
    category: "languages",
    subcategories: ["study-tools"],
    resourceType: "WEBSITE",
    officialUrl: TATOEBA_ABOUT,
    freeStatus: "FREE",
    openSource: false,
    platforms: ["BROWSER"],
    languages: ["en"],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "unknown",
    personalUse: "yes",
    apiAvailable: true,
    downloadAvailable: true,
    licenseNotes:
      "Text sentences default to CC BY 2.0 FR; some audio sentences use other Creative Commons licences or non-CC terms set by the contributor.",
    limitations: [
      "Some audio sentences carry non-commercial or no-derivatives conditions, so reuse terms vary per sentence",
      "Sentences are volunteer contributions and may contain errors",
    ],
    features: [
      "Search sentences containing a word, with translations into chosen languages",
      "Browse by language, list, tag and audio",
      "Data downloads and an API",
      "Community wall and contributor profiles",
    ],
    tags: ["example-sentences", "translations", "language-learning", "creative-commons", "corpus"],
    research: {
      date: DATE,
      sources: [
        src(TATOEBA_ABOUT, "Tatoeba 'What is Tatoeba?' page"),
        src(TATOEBA_TERMS, "Tatoeba terms of use: non-profit, licences, reuse"),
      ],
      checks: [
        ok("OFFICIAL_URL", TATOEBA_TERMS, "\"Tatoeba ('we') is a non-profit association ... the Tatoeba website, whose domain name is tatoeba.org\"."),
        ok(
          "FREE_STATUS",
          TATOEBA_TERMS,
          "\"We do not just want to build a large linguistic database, but we also want to share that data and make it freely reusable by other projects.\" The site asks only for optional donations.",
        ),
        ok(
          "LIMITATIONS",
          TATOEBA_TERMS,
          "\"Certain phrases, in particular audio, may be contributed with a non-marketing condition, and therefore must not be marketed.\"",
        ),
      ],
      notes:
        "Read the about page and terms of use. The site's source code is on GitHub, but its licence was not read, so openSource is not claimed. Whether browsing needs an account was not stated; contributing does.",
    },
  },
  {
    slug: "polypad",
    name: "Polypad",
    shortDescription: "Amplify's browser-based virtual maths manipulatives: fraction bars, polyhedra, balance scales and more.",
    longDescription:
      "Polypad, from Amplify Education (originally Mathigon), is a virtual mathematics playground with tools such as fraction bars, 3D polyhedra, balance scales, function machines, dice and spinners, number cubes and logic gates. It runs in the browser without login or installation, and teachers can create assignable activities.",
    whyListed:
      "It gives students and teachers a wide set of interactive maths manipulatives without login, installation or payment.",
    category: "mathematics",
    subcategories: ["learning"],
    resourceType: "WEB_APP",
    officialUrl: POLYPAD_HOME,
    freeStatus: "FREE",
    openSource: false,
    platforms: ["BROWSER"],
    requiresAccount: "no",
    requiresCreditCard: "unknown",
    commercialUse: "unknown",
    personalUse: "yes",
    limitations: [
      "Requires JavaScript; the page says it must be enabled to access Amplify",
      "Creating assignable class activities uses an account (Log in / Sign up)",
    ],
    features: [
      "Fraction bars, 3D polyhedra, balance scale and function machines",
      "Dice, coins, spinners, number cubes and data-science tools",
      "Logic gates and sound/music features",
      "Shareable and embeddable activities",
      "Webinars, video tutorials and lesson plans",
    ],
    tags: ["virtual-manipulatives", "math-tools", "geometry", "fractions", "teachers"],
    research: {
      date: DATE,
      sources: [src(POLYPAD_HOME, "Polypad homepage: tools, free statement, no login")],
      checks: [
        ok("OFFICIAL_URL", POLYPAD_HOME, "\"Welcome to Polypad!\"; footer \"© 2025 Amplify Education\"."),
        ok(
          "FREE_STATUS",
          POLYPAD_HOME,
          "\"Polypad is completely free, requires no login or installation, runs on all devices and browsers, and works with any curriculum.\"",
        ),
        ok("ACCOUNT_REQUIREMENT", POLYPAD_HOME, "\"requires no login or installation\"."),
        ok("PLATFORM_AVAILABILITY", POLYPAD_HOME, "\"runs on all devices and browsers\"."),
      ],
      notes:
        "Read the Polypad homepage. Amplify's site terms and acceptable use policy were not read, so commercial use stays unknown.",
    },
  },
  {
    slug: "pauls-online-math-notes",
    name: "Paul's Online Math Notes",
    shortDescription: "Paul Dawkins' notes for Algebra, Calculus I–III and Differential Equations, written as a no-cost textbook alternative.",
    longDescription:
      "Paul's Online Math Notes, hosted at Lamar University, are course notes by Paul Dawkins covering Algebra, Calculus I, II and III and Differential Equations, with worked examples and extras such as cheat sheets. They were written to give students and instructors a free set of notes in response to textbook prices.",
    whyListed:
      "They cover a full algebra-to-differential-equations sequence that can stand in for a paid textbook, and they cost nothing to read.",
    category: "mathematics",
    subcategories: ["learning"],
    resourceType: "EDUCATIONAL_RESOURCE",
    officialUrl: PAULS_HOME,
    freeStatus: "PERSONAL_FREE",
    openSource: false,
    platforms: ["BROWSER"],
    languages: ["en"],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "no",
    personalUse: "yes",
    limitations: [
      "Content may not be used for any commercial purpose without the author's written consent",
      "Content may not be mirrored or rehosted on other servers; linking is allowed",
      "Printing is allowed for private, non-commercial use",
    ],
    features: [
      "Algebra, Calculus I–III and Differential Equations notes",
      "Section-by-section worked examples",
      "Algebra and calculus cheat sheets",
      "Use as a course text is permitted under stated conditions",
    ],
    tags: ["calculus", "algebra", "differential-equations", "math-notes", "textbook-alternative"],
    research: {
      date: DATE,
      sources: [
        src(PAULS_HOME, "Paul's Online Notes homepage: course list"),
        src(PAULS_TERMS, "Terms and conditions of use"),
      ],
      checks: [
        ok("OFFICIAL_URL", PAULS_TERMS, "\"This site and all the content within this site, unless otherwise noted, is the copyrighted property of Paul Dawkins\"."),
        ok(
          "FREE_STATUS",
          PAULS_TERMS,
          "\"This site and the notes contained in this site were written with the intent of providing students and instructors with a free set of notes that they could use for their classes.\"",
        ),
        ok("PERSONAL_USE", PAULS_TERMS, "\"You may print content from this site for your private, non-commercial use.\""),
        ok(
          "COMMERCIAL_USE",
          PAULS_TERMS,
          "\"You may not display, use, reproduce, distribute or otherwise use any content from this site for any commercial purpose without the express written consent of Paul Dawkins.\"",
        ),
        ok(
          "LIMITATIONS",
          PAULS_TERMS,
          "\"The content on this site may not be downloaded, uploaded, imported, mirrored ... for inclusion in a web site, web server, ftp server, or any other networked computer without the express written consent\".",
        ),
      ],
      notes: "Read the homepage course list and the terms of use. PDF download availability varies by page and was not checked in detail.",
    },
  },
  {
    slug: "purdue-owl",
    name: "Purdue OWL",
    shortDescription: "Purdue University's Online Writing Lab: guides on academic writing, grammar, and APA, MLA and Chicago citation.",
    longDescription:
      "The Purdue Online Writing Lab (OWL), from the Writing Lab at Purdue University, hosts writing resources covering the writing process, academic and graduate writing, grammar and punctuation, job-search writing such as résumés and CVs, multilingual writers, and citation styles including APA, MLA, Chicago, IEEE and AMA, with exercises.",
    whyListed:
      "It is a university-run reference for citation formats and academic writing that students can consult without paying for a style guide.",
    category: "learning",
    subcategories: ["study-tools"],
    resourceType: "EDUCATIONAL_RESOURCE",
    officialUrl: PURDUE_OWL,
    freeStatus: "FREE",
    openSource: false,
    platforms: ["BROWSER"],
    languages: ["en"],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "unknown",
    personalUse: "yes",
    limitations: [
      "Material may not be published, reproduced or redistributed without permission",
      "On-campus consultations serve Purdue's West Lafayette and Indianapolis campuses; worldwide users get the online reference material",
    ],
    features: [
      "APA (7th edition), MLA, Chicago, IEEE, AMA and ASA citation guides",
      "Grammar, punctuation and mechanics guides with exercises",
      "Graduate writing, thesis and dissertation guidance",
      "Résumé, CV and job-search letter guidance",
      "Resources for multilingual writers and teachers",
    ],
    tags: ["writing", "citations", "apa", "mla", "academic-writing"],
    research: {
      date: DATE,
      sources: [src(PURDUE_OWL, "Welcome to the Purdue OWL: mission, free service, copyright notice")],
      checks: [
        ok("OFFICIAL_URL", PURDUE_OWL, "\"This page is brought to you by the OWL at Purdue University.\""),
        ok(
          "FREE_STATUS",
          PURDUE_OWL,
          "\"The Purdue OWL houses writing resources and instructional material, and we provide these as a free service at Purdue. Students, members of the community, and users worldwide will find information\".",
        ),
        ok(
          "LIMITATIONS",
          PURDUE_OWL,
          "\"This material may not be published, reproduced, broadcast, rewritten, or redistributed without permission.\"",
        ),
      ],
      notes: "Read the Purdue OWL welcome page. The fair-use terms page was not read.",
    },
  },
]);
