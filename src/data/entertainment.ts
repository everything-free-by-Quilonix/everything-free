export interface EntertainmentMedia {
  id: string;
  title: string;
  creator: string;
  year: number;
  category: "cartoons" | "cinema" | "horror" | "comedy" | "noir";
  duration: string;
  description: string;
  embedId: string;
  license: string;
  tags: string[];
}

export interface RadioStation {
  id: string;
  name: string;
  genre: string;
  location: string;
  streamUrl: string;
  description: string;
}

export interface ClassicBook {
  id: string;
  title: string;
  author: string;
  year: number;
  wordCount: string;
  description: string;
  firstParagraph: string;
  chapters: { title: string; text: string }[];
}

export interface RetroGame {
  id: string;
  title: string;
  year: number;
  platform: string;
  developer: string;
  genre: string;
  description: string;
  embedId: string;
}

export interface EntertainmentPortal {
  name: string;
  description: string;
  url: string;
  freeScope: string;
  category: "movies" | "books" | "audio" | "gaming";
}

export const ENTERTAINMENT_FILMS: EntertainmentMedia[] = [
  /* ------------------------------------------------ Classic Cartoons */
  {
    id: "superman-mechanical-monsters",
    title: "Superman: The Mechanical Monsters",
    creator: "Fleischer Studios / Paramount Pictures",
    year: 1941,
    category: "cartoons",
    duration: "11 min",
    description:
      "A landmark in golden-age hand-drawn animation. Superman battles a mad scientist who unleashes a fleet of flying robotic monsters across Metropolis.",
    embedId: "superman_mechanical_monsters",
    license: "Public Domain (Expired US Copyright)",
    tags: ["superman", "animation", "retro", "superhero"],
  },
  {
    id: "superman-mad-scientist",
    title: "Superman: The Mad Scientist",
    creator: "Fleischer Studios",
    year: 1941,
    category: "cartoons",
    duration: "10 min",
    description:
      "The historic first Superman animated short, nominated for an Academy Award. Features the legendary intro and a beam weapon threatening the city.",
    embedId: "superman_1941",
    license: "Public Domain (Expired US Copyright)",
    tags: ["superman", "animation", "academy-award", "fleischer"],
  },
  {
    id: "superman-terror-on-the-midway",
    title: "Superman: Terror on the Midway",
    creator: "Fleischer Studios",
    year: 1942,
    category: "cartoons",
    duration: "9 min",
    description:
      "A circus catastrophe breaks out when a giant ape escapes, prompting Clark Kent and Lois Lane into frantic action.",
    embedId: "superman_terror_on_the_midway",
    license: "Public Domain (Expired US Copyright)",
    tags: ["superman", "action", "circus", "animation"],
  },
  {
    id: "popeye-patriotic",
    title: "Patriotic Popeye",
    creator: "Famous Studios / Paramount",
    year: 1957,
    category: "cartoons",
    duration: "6 min",
    description:
      "Popeye tries to keep his rambunctious nephews safe during Fourth of July fireworks in this classic, fast-paced Technicolor comedy.",
    embedId: "popeye_patriotic_popeye",
    license: "Public Domain (Expired US Copyright)",
    tags: ["popeye", "slapstick", "comedy", "classic-animation"],
  },
  {
    id: "popeye-sinbad",
    title: "Popeye Meets Sindbad the Sailor",
    creator: "Fleischer Studios",
    year: 1936,
    category: "cartoons",
    duration: "16 min",
    description:
      "Two-reel Technicolor epic nominated for the Academy Award. Popeye encounters Sindbad (Bluto) ruling a fantastic island of mythical beasts.",
    embedId: "popeye_meets_sinbad_the_sailor",
    license: "Public Domain (Expired US Copyright)",
    tags: ["popeye", "technicolor", "epic", "academy-award"],
  },
  {
    id: "popeye-ali-baba",
    title: "Popeye Meets Ali Baba's Forty Thieves",
    creator: "Fleischer Studios",
    year: 1937,
    category: "cartoons",
    duration: "17 min",
    description:
      "Popeye and Wimpy ride out across the desert to defend a besieged fortress against Abu Hassan and his band of thieves.",
    embedId: "popeye_meets_ali_baba",
    license: "Public Domain (Expired US Copyright)",
    tags: ["popeye", "technicolor", "adventure", "fleischer"],
  },
  {
    id: "betty-boop-snow-white",
    title: "Betty Boop: Snow White",
    creator: "Fleischer Studios",
    year: 1933,
    category: "cartoons",
    duration: "7 min",
    description:
      "Renowned surrealist cartoon featuring Cab Calloway performing 'St. James Infirmary Blues' with groundbreaking rotoscope animation.",
    embedId: "bb_snow_white",
    license: "Public Domain (Expired US Copyright)",
    tags: ["betty-boop", "jazz", "surreal", "cab-calloway"],
  },
  {
    id: "betty-boop-minnie-the-moocher",
    title: "Betty Boop: Minnie the Moocher",
    creator: "Fleischer Studios",
    year: 1932,
    category: "cartoons",
    duration: "8 min",
    description:
      "Betty runs away from home and enters a shadowy cave where a ghost walrus, voiced by Cab Calloway, dances to 'Minnie the Moocher'.",
    embedId: "bb_minnie_the_moocher",
    license: "Public Domain (Expired US Copyright)",
    tags: ["betty-boop", "jazz", "cab-calloway", "ghost"],
  },
  {
    id: "woody-woodpecker-pantry-panic",
    title: "Woody Woodpecker: Pantry Panic",
    creator: "Walter Lantz Productions",
    year: 1941,
    category: "cartoons",
    duration: "7 min",
    description:
      "Woody refuses to migrate south for the winter and finds himself matching wits with a hungry cat during a howling snowstorm.",
    embedId: "woody_woodpecker_pantry_panic",
    license: "Public Domain (Expired US Copyright)",
    tags: ["woody-woodpecker", "slapstick", "retro-animation"],
  },
  {
    id: "flip-the-frog-fiddlesticks",
    title: "Flip the Frog: Fiddlesticks",
    creator: "Ub Iwerks",
    year: 1930,
    category: "cartoons",
    duration: "6 min",
    description:
      "The historic first complete two-strip Technicolor sound cartoon, animated by legendary Disney co-creator Ub Iwerks.",
    embedId: "FLIP_FROG-FIDDLESTICKS",
    license: "Public Domain (Expired US Copyright)",
    tags: ["flip-the-frog", "technicolor", "ub-iwerks", "historic"],
  },
  {
    id: "gullivers-travels-1939",
    title: "Gulliver's Travels (Feature Film)",
    creator: "Fleischer Studios",
    year: 1939,
    category: "cartoons",
    duration: "76 min",
    description:
      "Full-length Technicolor animated musical feature. Lemuel Gulliver is washed ashore on Lilliput and caught between two rival kingdoms.",
    embedId: "gullivers_travels_1939",
    license: "Public Domain (Expired US Copyright)",
    tags: ["feature-film", "technicolor", "musical", "fleischer"],
  },
  {
    id: "daffy-duck-commando",
    title: "Daffy - The Commando",
    creator: "Leon Schlesinger / Warner Bros.",
    year: 1943,
    category: "cartoons",
    duration: "7 min",
    description:
      "World War II animated comedy featuring Daffy Duck parachuting behind enemy lines and wreaking slapstick havoc.",
    embedId: "daffy_the_commando",
    license: "Public Domain (Expired US Copyright)",
    tags: ["daffy-duck", "slapstick", "looney-tunes", "classic"],
  },

  /* ------------------------------------------------ Classic Cinema & Comedy */
  {
    id: "the-general-buster-keaton",
    title: "The General",
    creator: "Buster Keaton & Clyde Bruckman",
    year: 1926,
    category: "comedy",
    duration: "78 min",
    description:
      "Widely regarded as one of the greatest motion pictures of all time. Buster Keaton performs legendary train-stunt comedy and action cinematography.",
    embedId: "The_General_Buster_Keaton",
    license: "Public Domain (Expired US Copyright)",
    tags: ["buster-keaton", "comedy", "silent-film", "masterpiece"],
  },
  {
    id: "his-girl-friday",
    title: "His Girl Friday",
    creator: "Howard Hawks (starring Cary Grant & Rosalind Russell)",
    year: 1940,
    category: "comedy",
    duration: "92 min",
    description:
      "The definitive fast-talking screwball comedy. An editor attempts to win back his ace reporter ex-wife during a breaking murder trial.",
    embedId: "his_girl_friday",
    license: "Public Domain (Expired US Copyright)",
    tags: ["cary-grant", "screwball-comedy", "journalism", "classic-hollywood"],
  },
  {
    id: "charlie-chaplin-the-kid",
    title: "The Kid",
    creator: "Charlie Chaplin",
    year: 1921,
    category: "comedy",
    duration: "53 min",
    description:
      "Chaplin's first full-length comedy masterpiece. The Tramp discovers an abandoned baby and raises him as his spirited little partner in mischief.",
    embedId: "The_Kid_Chaplin",
    license: "Public Domain (Expired US Copyright)",
    tags: ["charlie-chaplin", "silent-comedy", "heartwarming", "classic"],
  },
  {
    id: "charlie-chaplin-fest",
    title: "Charlie Chaplin Comedy Festival",
    creator: "Charles Chaplin",
    year: 1938,
    category: "comedy",
    duration: "75 min",
    description:
      "A curated collection of Charlie Chaplin's timeless Little Tramp silent shorts, celebrated for physical comedy, pathos, and warmth.",
    embedId: "charlie_chaplin_film_fest",
    license: "Public Domain (Expired US Copyright)",
    tags: ["charlie-chaplin", "slapstick", "little-tramp", "comedy"],
  },
  {
    id: "steamboat-bill-jr",
    title: "Steamboat Bill, Jr.",
    creator: "Buster Keaton & Charles Reisner",
    year: 1928,
    category: "comedy",
    duration: "70 min",
    description:
      "Famous for Keaton's astonishing cyclone sequence and the hair-raising falling-house stunt performed without a safety net.",
    embedId: "Steamboat_Bill_Jr",
    license: "Public Domain (Expired US Copyright)",
    tags: ["buster-keaton", "stunts", "slapstick", "cyclone"],
  },
  {
    id: "charade-1963",
    title: "Charade",
    creator: "Stanley Donen (starring Audrey Hepburn & Cary Grant)",
    year: 1963,
    category: "cinema",
    duration: "113 min",
    description:
      "A suspenseful romantic caper set in Paris. Famously fell into public domain due to an omitted copyright notice in the original theatrical print.",
    embedId: "Charade1963",
    license: "Public Domain (Defective Copyright Notice)",
    tags: ["audrey-hepburn", "cary-grant", "suspense", "paris"],
  },
  {
    id: "jungle-book-1942",
    title: "Rudyard Kipling's Jungle Book",
    creator: "Zoltan & Alexander Korda (starring Sabu)",
    year: 1942,
    category: "cinema",
    duration: "108 min",
    description:
      "Academy Award-nominated Technicolor live-action adventure following Mowgli, raised by wolves in the jungles of India.",
    embedId: "JungleBook",
    license: "Public Domain (Expired US Copyright)",
    tags: ["jungle-book", "adventure", "technicolor", "classic"],
  },

  /* ------------------------------------------------ Film Noir & Thrillers */
  {
    id: "doa-1949",
    title: "D.O.A. (Dead on Arrival)",
    creator: "Rudolph Maté (starring Edmond O'Brien)",
    year: 1949,
    category: "noir",
    duration: "83 min",
    description:
      "A man discovers he has been fatally poisoned with a luminous toxin and frantically spends his final hours hunting his own killer.",
    embedId: "DOA_1949",
    license: "Public Domain (Expired US Copyright)",
    tags: ["film-noir", "mystery", "thriller", "san-francisco"],
  },
  {
    id: "detour-1945",
    title: "Detour",
    creator: "Edgar G. Ulmer (starring Tom Neal)",
    year: 1945,
    category: "noir",
    duration: "68 min",
    description:
      "The quintessential Poverty Row film noir. A down-on-his-luck nightclub pianist hitchhikes west and spirals into an inescapable nightmare of blackmail.",
    embedId: "Detour_1945",
    license: "Public Domain (Expired US Copyright)",
    tags: ["film-noir", "cult-classic", "crime", "dark"],
  },
  {
    id: "the-stranger-1946",
    title: "The Stranger",
    creator: "Orson Welles (starring Orson Welles & Edward G. Robinson)",
    year: 1946,
    category: "noir",
    duration: "95 min",
    description:
      "An investigator from the War Crimes Commission tracks a fugitive Nazi mastermind living under an alias as a prep school teacher in Connecticut.",
    embedId: "The_Stranger_1946",
    license: "Public Domain (Expired US Copyright)",
    tags: ["orson-welles", "thriller", "post-war", "noir"],
  },
  {
    id: "sherlock-dressed-to-kill",
    title: "Sherlock Holmes: Dressed to Kill",
    creator: "Roy William Neill (starring Basil Rathbone)",
    year: 1946,
    category: "noir",
    duration: "72 min",
    description:
      "Holmes and Watson search for a trio of unassuming music boxes made in Dartmoor prison that conceal a secret code to stolen currency plates.",
    embedId: "Sherlock_Holmes_Dressed_to_Kill_1946",
    license: "Public Domain (Expired US Copyright)",
    tags: ["sherlock-holmes", "basil-rathbone", "mystery", "watson"],
  },

  /* ------------------------------------------------ Sci-Fi & Silent Visionaries */
  {
    id: "metropolis-1927",
    title: "Metropolis",
    creator: "Fritz Lang",
    year: 1927,
    category: "cinema",
    duration: "148 min",
    description:
      "The foundational milestone of science fiction cinema. A futuristic cityscape divided between wealthy thinkers and an underground subterranean working class.",
    embedId: "Metropolis1927",
    license: "Public Domain (International Restored Master)",
    tags: ["scifi", "fritz-lang", "dystopia", "monumental"],
  },
  {
    id: "trip-to-the-moon",
    title: "A Trip to the Moon (Le Voyage dans la Lune)",
    creator: "Georges Méliès",
    year: 1902,
    category: "cinema",
    duration: "13 min",
    description:
      "The cinema pioneer's historic, whimsical adventure. Astronomers travel to the Moon inside a bullet capsule and encounter the lunar Selenites.",
    embedId: "a_trip_to_the_moon_1902",
    license: "Public Domain",
    tags: ["scifi", "silent", "pioneer", "space"],
  },

  /* ------------------------------------------------ Cult Horror & Macabre */
  {
    id: "night-of-the-living-dead",
    title: "Night of the Living Dead",
    creator: "George A. Romero",
    year: 1968,
    category: "horror",
    duration: "96 min",
    description:
      "The legendary indie horror film that invented the modern zombie genre. Trapped in a rural farmhouse, seven people fight to survive the night.",
    embedId: "night_of_the_living_dead",
    license: "Public Domain (Accidental Public Notice Omission)",
    tags: ["zombies", "horror", "cult-classic", "romero"],
  },
  {
    id: "house-on-haunted-hill",
    title: "House on Haunted Hill",
    creator: "William Castle (starring Vincent Price)",
    year: 1959,
    category: "horror",
    duration: "75 min",
    description:
      "An eccentric millionaire invites five guests to spend the night in a rented haunted house, promising $10,000 to each person who survives until morning.",
    embedId: "house_on_haunted_hill_ipod",
    license: "Public Domain (Expired US Copyright)",
    tags: ["vincent-price", "horror", "haunted-house", "classic-spooky"],
  },
  {
    id: "nosferatu-1922",
    title: "Nosferatu: A Symphony of Horror",
    creator: "F.W. Murnau (starring Max Schreck)",
    year: 1922,
    category: "horror",
    duration: "94 min",
    description:
      "German Expressionist vampire masterpiece. Count Orlok brings terror and pestilence across the sea to Wisborg.",
    embedId: "nosferatu_1922",
    license: "Public Domain (Expired US Copyright)",
    tags: ["vampire", "expressionism", "murnau", "creepy"],
  },
  {
    id: "cabinet-of-dr-caligari",
    title: "The Cabinet of Dr. Caligari",
    creator: "Robert Wiene",
    year: 1920,
    category: "horror",
    duration: "71 min",
    description:
      "The definitive German Expressionist dark psychological thriller, famed for its sharp, twisted, angular sets and iconic twist ending.",
    embedId: "The_Cabinet_of_Dr_Caligari",
    license: "Public Domain",
    tags: ["expressionism", "somnambulist", "psychological", "twisted"],
  },
  {
    id: "phantom-of-the-opera-1925",
    title: "The Phantom of the Opera",
    creator: "Rupert Julian (starring Lon Chaney)",
    year: 1925,
    category: "horror",
    duration: "93 min",
    description:
      "The 'Man of a Thousand Faces' stars as Erik, the disfigured phantom who haunts the Paris Opera House and abducts a young soprano.",
    embedId: "phantom_of_the_opera_1925",
    license: "Public Domain",
    tags: ["lon-chaney", "gothic", "paris-opera", "classic"],
  },
  {
    id: "little-shop-of-horrors-1960",
    title: "The Little Shop of Horrors",
    creator: "Roger Corman (featuring Jack Nicholson)",
    year: 1960,
    category: "horror",
    duration: "72 min",
    description:
      "Dark comedy cult classic shot in just two days. A clumsy florist apprentice cultivates a carnivorous plant that feeds on human blood.",
    embedId: "TheLittleShopOfHorrors1960",
    license: "Public Domain",
    tags: ["roger-corman", "dark-comedy", "carnivorous-plant", "cult"],
  },
];

export const RADIO_STATIONS: RadioStation[] = [
  {
    id: "rp-main",
    name: "Radio Paradise (Main Mix)",
    genre: "Eclectic Rock & World",
    location: "California, USA",
    streamUrl: "https://stream.radioparadise.com/mp3-128",
    description: "Listener-supported commercial-free audio stream blending modern & classic rock, acoustic, indie and world music.",
  },
  {
    id: "rp-mellow",
    name: "Radio Paradise (Mellow Chill)",
    genre: "Ambient / Downtempo",
    location: "California, USA",
    streamUrl: "https://stream.radioparadise.com/mellow-128",
    description: "Soothing downtempo, ambient soundscapes, acoustic melodies, and chilled electronica.",
  },
  {
    id: "rp-rock",
    name: "Radio Paradise (Rock Mix)",
    genre: "Classic & Modern Rock",
    location: "California, USA",
    streamUrl: "https://stream.radioparadise.com/rock-128",
    description: "High-energy rock journey spanning alternative, blues-rock, progressive and iconic anthems.",
  },
  {
    id: "rp-world",
    name: "Radio Paradise (Global Fusion)",
    genre: "World Music & Grooves",
    location: "California, USA",
    streamUrl: "https://stream.radioparadise.com/world-etc-128",
    description: "Cross-cultural rhythms, global acoustic traditions, sitar fusion and international vibes.",
  },
  {
    id: "nightwave-plaza",
    name: "Nightwave Plaza (Lo-Fi)",
    genre: "Vaporwave & Chillhop",
    location: "Online / Worldwide",
    streamUrl: "https://radio.plaza.one/mp3",
    description: "24/7 internet radio broadcast playing vaporwave, future funk, nostalgic lo-fi and city pop.",
  },
  {
    id: "wqxr-classical",
    name: "WQXR Classical (New York)",
    genre: "Symphony & Classical",
    location: "New York City, USA",
    streamUrl: "https://stream.wqxr.org/wqxr",
    description: "New York's premier classical station with live symphonies, concerto masterworks, Bach, and Mozart.",
  },
  {
    id: "q2-contemporary",
    name: "Q2 Ambient & Modern Classical",
    genre: "Modern Classical / Textures",
    location: "WQXR New York",
    streamUrl: "https://stream.wqxr.org/q2",
    description: "Immersive soundscapes, experimental compositions, ambient textures, and living composers.",
  },
  {
    id: "kexp-indie",
    name: "KEXP 90.3 FM Seattle",
    genre: "Independent & Alternative",
    location: "Seattle, Washington",
    streamUrl: "https://kexp.streamguys1.com/kexp128.mp3",
    description: "World-famous listener-powered radio championing independent music, underground cuts and diverse artists.",
  },
  {
    id: "wfmu-freeform",
    name: "WFMU 91.1 FM (Freeform)",
    genre: "Freeform Independent",
    location: "Jersey City / NYC",
    streamUrl: "https://stream0.wfmu.org/freeform-128k.mp3",
    description: "The longest-running freeform independent radio station in the US. Curated by live volunteer DJs.",
  },
  {
    id: "swiss-jazz",
    name: "Swiss Radio Jazz",
    genre: "Acoustic Jazz & Bebop",
    location: "Basel, Switzerland",
    streamUrl: "https://jazz-wr01.ice.infomaniak.ch/jazz-wr01-128.mp3",
    description: "Commercial-free acoustic jazz, swing, bebop, and timeless standards in crystal-clear audio.",
  },
];

export const RETRO_EMULATED_GAMES: RetroGame[] = [
  {
    id: "prince-of-persia",
    title: "Prince of Persia",
    year: 1989,
    platform: "MS-DOS",
    developer: "Jordan Mechner / Broderbund",
    genre: "Cinematic Platformer",
    description:
      "The groundbreaking rotoscoped adventure. Run, leap spikes, parry guards, and navigate the Sultan's dungeon in 60 minutes.",
    embedId: "msdos_Prince_of_Persia_1989",
  },
  {
    id: "simcity-classic",
    title: "SimCity",
    year: 1989,
    platform: "MS-DOS",
    developer: "Will Wright / Maxis",
    genre: "City Simulation",
    description:
      "Zone residential, commercial and industrial districts, lay transit, balance budgets, and weather natural disasters.",
    embedId: "msdos_SimCity_1989",
  },
  {
    id: "oregon-trail",
    title: "The Oregon Trail",
    year: 1990,
    platform: "MS-DOS",
    developer: "MECC",
    genre: "Historical Adventure",
    description:
      "Lead a pioneer wagon team from Independence, Missouri to Oregon's Willamette Valley across rivers, plains and wilderness.",
    embedId: "msdos_Oregon_Trail_The_1990",
  },
  {
    id: "lemmings",
    title: "Lemmings",
    year: 1991,
    platform: "MS-DOS",
    developer: "DMA Design / Psygnosis",
    genre: "Puzzle Strategy",
    description:
      "Assign climbing, digging, blocking and parachuting tasks to guide wandering creatures safely past lethal hazards to the exit.",
    embedId: "msdos_Lemmings_1991",
  },
  {
    id: "pacman-arcade",
    title: "Pac-Man",
    year: 1980,
    platform: "Arcade",
    developer: "Namco",
    genre: "Arcade Maze",
    description:
      "Chomp dots, evade ghosts Blinky, Pinky, Inky and Clyde, and grab Power Pellets in the most iconic coin-op arcade maze of all time.",
    embedId: "arcade_pacman",
  },
];

export const CLASSIC_BOOKS: ClassicBook[] = [
  {
    id: "sherlock-holmes",
    title: "The Adventures of Sherlock Holmes",
    author: "Arthur Conan Doyle",
    year: 1892,
    wordCount: "105,000 words",
    description:
      "The legendary consulting detective and Dr. John Watson untangle London's most baffling crimes through keen observation and deduction.",
    firstParagraph:
      "To Sherlock Holmes she is always THE woman. I have seldom heard him mention her under any other name. In his eyes she eclipses and predominates the whole of her sex...",
    chapters: [
      {
        title: "A Scandal in Bohemia",
        text: "To Sherlock Holmes she is always THE woman. I have seldom heard him mention her under any other name. In his eyes she eclipses and predominates the whole of her sex. It was not that he felt any emotion akin to love for Irene Adler. All emotions, and that one particularly, were abhorrent to his cold, precise but admirably balanced mind. He was, I take it, the most perfect reasoning and observing machine that the world has seen, but as a lover he would have placed himself in a false position. He never spoke of the softer passions, save with a gibe and a sneer.\n\nOne night—it was on the twentieth of March, 1888—I was returning from a journey to a patient (for I had now returned to civil practice), when my way led me through Baker Street. As I passed the well-remembered door, which must always be associated in my mind with my wooing, and with the dark incidents of the Study in Scarlet, I was seized with a keen desire to see Holmes again, and to know how he was employing his extraordinary powers. His rooms were brilliantly lit, and, even as I looked up, I saw his tall, spare figure pass twice in a dark silhouette against the blind. He was pacing the room swiftly, eagerly, with his head sunk upon his chest and his hands clasped behind him. To me, who knew his every mood and habit, his attitude and manner told their own story. He was at work again. He had risen out of his drug-created dreams and was hot upon the scent of some new problem.",
      },
      {
        title: "The Red-Headed League",
        text: "I had called upon my friend, Mr. Sherlock Holmes, one day in the autumn of last year and found him in deep conversation with a very stout, florid-faced, elderly gentleman with fiery red hair. With an apology for my intrusion, I was about to withdraw when Holmes pulled me abruptly into the room and closed the door behind me.\n\n'You could not have come at a better time, my dear Watson,' he said cordially.\n\n'I was afraid that you were engaged.'\n\n'So I am. Very much so.'\n\n'Then I can wait in the next room.'\n\n'Not at all. This gentleman, Mr. Wilson, has been my partner and helper in many of my most successful cases, and I have no doubt that he will be of the utmost use to me in yours also.'",
      },
    ],
  },
  {
    id: "frankenstein",
    title: "Frankenstein; or, The Modern Prometheus",
    author: "Mary Shelley",
    year: 1818,
    wordCount: "75,000 words",
    description:
      "A young scientist creates a sentient creature in an unorthodox scientific experiment, unleashing a tragedy of obsession, alienation, and revenge.",
    firstParagraph:
      "You will rejoice to hear that no disaster has accompanied the commencement of an enterprise which you have regarded with such evil forebodings. I arrived here yesterday, and my first task is to assure my dear sister of my welfare and increasing confidence in the success of my undertaking.",
    chapters: [
      {
        title: "Letter I & Chapter I",
        text: "You will rejoice to hear that no disaster has accompanied the commencement of an enterprise which you have regarded with such evil forebodings. I arrived here yesterday, and my first task is to assure my dear sister of my welfare and increasing confidence in the success of my undertaking.\n\nI am by birth a Genevese, and my family is one of the most distinguished of that republic. My ancestors had been for many years counsellors and syndics, and my father had filled several public situations with honour and reputation. He was respected by all who knew him for his integrity and indefatigable attention to public business.\n\nIt was on a dreary night of November that I beheld the accomplishment of my toils. With an anxiety that almost amounted to agony, I collected the instruments of life around me, that I might infuse a spark of being into the lifeless thing that lay at my feet. It was already one in the morning; the rain pattered dismally against the panes, and my candle was nearly burnt out, when, by the glimmer of the half-extinguished light, I saw the dull yellow eye of the creature open; it breathed hard, and a convulsive motion agitated its limbs.",
      },
    ],
  },
  {
    id: "dracula",
    title: "Dracula",
    author: "Bram Stoker",
    year: 1897,
    wordCount: "160,000 words",
    description:
      "Jonathan Harker visits Count Dracula in his Transylvanian castle, unraveling an ancient terror preparing to invade Victorian London.",
    firstParagraph:
      "3 May. Bistritz.—Left Munich at 8:35 P. M., on 1st May, arriving at Vienna early next morning; should have arrived at 6:46, but train was an hour late. Buda-Pesth seems a wonderful place, from the glimpse which I got of it from the train and the little I could walk through the streets.",
    chapters: [
      {
        title: "Jonathan Harker's Journal (Transylvania)",
        text: "3 May. Bistritz.—Left Munich at 8:35 P. M., on 1st May, arriving at Vienna early next morning; should have arrived at 6:46, but train was an hour late. Buda-Pesth seems a wonderful place, from the glimpse which I got of it from the train and the little I could walk through the streets. I feared to go very far from the station, as we had arrived late and would start as near the correct time as possible.\n\nThe impression I had was that we were leaving the West and entering the East; the most western of splendid bridges over the Danube, which is here of noble width and depth, took us among the traditions of Turkish rule.\n\nWe left in pretty good time, and came after nightfall to Klausenburgh. Here I stopped for the night at the Hotel Royale. I had for dinner, or rather supper, a chicken done up some way with red pepper, which was very good but thirsty. (Mem., get recipe for Mina.) I asked the waiter, and he said it was called 'paprika hendl,' and that, as it was a national dish, I should be able to get it anywhere along the Carpathians.",
      },
    ],
  },
  {
    id: "alice-in-wonderland",
    title: "Alice's Adventures in Wonderland",
    author: "Lewis Carroll",
    year: 1865,
    wordCount: "29,000 words",
    description:
      "A young girl falls down a rabbit hole into a fantasy realm populated by anthropomorphic creatures and whimsical paradoxes.",
    firstParagraph:
      "Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it, 'and what is the use of a book,' thought Alice 'without pictures or conversations?'",
    chapters: [
      {
        title: "Down the Rabbit-Hole",
        text: "Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it, 'and what is the use of a book,' thought Alice 'without pictures or conversations?'\n\nSo she was considering in her own mind (as well as she could, for the hot day made her feel very sleepy and stupid), whether the pleasure of making a daisy-chain would be worth the trouble of getting up and picking the daisies, when suddenly a White Rabbit with pink eyes ran close by her.\n\nThere was nothing so very remarkable in that; nor did Alice think it so very much out of the way to hear the Rabbit say to itself, 'Oh dear! Oh dear! I shall be late!' but when the Rabbit actually took a watch out of its waistcoat-pocket, and looked at it, and then hurried on, Alice started to her feet, for it flashed across her mind that she had never before seen a rabbit with either a waistcoat-pocket, or a watch to take out of it, and burning with curiosity, she ran across the field after it, and fortunately was just in time to see it pop down a large rabbit-hole under the hedge.",
      },
    ],
  },
  {
    id: "art-of-war",
    title: "The Art of War",
    author: "Sun Tzu (translated by Lionel Giles)",
    year: -500,
    wordCount: "11,000 words",
    description:
      "The ancient military treatise on strategy, tactical positioning, deception, and victory through preparation.",
    firstParagraph:
      "Sun Tzu said: The art of war is of vital importance to the State. It is a matter of life and death, a road either to safety or to ruin. Hence it is a subject of inquiry which can on no account be neglected.",
    chapters: [
      {
        title: "Laying Plans",
        text: "1. Sun Tzu said: The art of war is of vital importance to the State.\n\n2. It is a matter of life and death, a road either to safety or to ruin. Hence it is a subject of inquiry which can on no account be neglected.\n\n3. The moral law causes the people to be in complete accord with their ruler, so that they will follow him regardless of their lives, undismayed by any danger.\n\n4. Heaven signifies night and day, cold and heat, times and seasons.\n\n5. Earth comprises distances, great and small; danger and security; open ground and narrow passes; the chances of life and death.\n\n6. The Commander stands for the virtues of wisdom, sincerely, benevolence, strictness.\n\n7. By method and discipline are to be understood the marshaling of the army in its proper subdivisions, the graduations of rank among the officers, the maintenance of roads by which supplies may reach the army, and the control of military expenditure.",
      },
    ],
  },
  {
    id: "meditations-marcus-aurelius",
    title: "Meditations",
    author: "Marcus Aurelius (translated by George Long)",
    year: 180,
    wordCount: "50,000 words",
    description:
      "Personal private writings of the Roman Emperor on Stoic philosophy, self-discipline, mortality, and rational duty.",
    firstParagraph:
      "From my grandfather Verus I learned good morals and the government of my temper. From the reputation and remembrance of my father, modesty and a manly character...",
    chapters: [
      {
        title: "Book II: On the Soul and Duty",
        text: "Begin the morning by saying to thyself, I shall meet with the busy-body, the ungrateful, arrogant, deceitful, envious, unsocial. All these things happen to them by reason of their ignorance of what is good and evil. But I who have seen the nature of the good that it is beautiful, and of the bad that it is ugly, and the nature of him who does wrong, that it is akin to me, not only of the same blood or seed, but that it participates in the same intelligence and the same portion of the divinity, I can neither be injured by any of them, for no one can fix on me what is ugly, nor can I be angry with my kinsman, nor hate him. For we are made for co-operation, like feet, like hands, like rows of the upper and lower teeth. To act against one another then is contrary to nature; and it is acting against one another to be vexed and to turn away.",
      },
    ],
  },
  {
    id: "the-time-machine",
    title: "The Time Machine",
    author: "H.G. Wells",
    year: 1895,
    wordCount: "32,000 words",
    description:
      "A Victorian scientist builds an apparatus that hurls him into the year 802,701 AD, uncovering the peaceful Eloi and subterranean Morlocks.",
    firstParagraph:
      "The Time Traveller (for so it will be convenient to speak of him) was expounding a recondite matter to us. His grey eyes shone and twinkled, and his usually pale face was flushed and animated...",
    chapters: [
      {
        title: "Chapter I: The Fourth Dimension",
        text: "The Time Traveller (for so it will be convenient to speak of him) was expounding a recondite matter to us. His grey eyes shone and twinkled, and his usually pale face was flushed and animated. The fire burnt brightly, and the soft radiance of the incandescent lights in the lilies of silver caught the bubbles that flashed and passed in our glasses. Our chairs, being his patents, embraced and caressed us rather than submitted to be sat upon; and there was that luxurious after-dinner atmosphere when thought runs gracefully free of the trammels of precision. And he put it to us in this way—marking the points with a lean forefinger—as we sat and lazily admired his earnestness over this new paradox (as we thought it) and his fecundity.\n\n'You must follow me carefully. I shall have to controvert one or two ideas that are almost universally accepted. The geometry, for instance, they taught you at school is founded on a misconception.'",
      },
    ],
  },
];

export const FREE_ENTERTAINMENT_PORTALS: EntertainmentPortal[] = [
  {
    name: "Project Gutenberg",
    description: "Over 70,000 completely free eBooks in EPUB, Kindle, and plain text. Zero cost, zero registration.",
    url: "https://www.gutenberg.org",
    freeScope: "100% Free Public Domain Books",
    category: "books",
  },
  {
    name: "Internet Archive: Moving Images",
    description: "Millions of digital movies, newsreels, cartoons, classic films, and cultural broadcasts.",
    url: "https://archive.org/details/movies",
    freeScope: "Free public access streaming & download",
    category: "movies",
  },
  {
    name: "LibriVox Free Audiobooks",
    description: "Free public domain audiobooks read by volunteers worldwide. High quality MP3 & podcast feeds.",
    url: "https://librivox.org",
    freeScope: "100% Free Public Domain Audiobooks",
    category: "audio",
  },
  {
    name: "Internet Archive: MS-DOS & Arcade",
    description: "Thousands of vintage MS-DOS PC games and arcade titles emulated in-browser with zero install.",
    url: "https://archive.org/details/softwarelibrary_msdos_games",
    freeScope: "In-browser emulated shareware & classics",
    category: "gaming",
  },
  {
    name: "NASA Media & Video Archive",
    description: "Over 140,000 public domain space videos, high-resolution imagery, and planetary sound recordings.",
    url: "https://images.nasa.gov",
    freeScope: "Public domain government media",
    category: "movies",
  },
  {
    name: "Library of Congress: National Jukebox",
    description: "Historical sound recordings produced by Victor Talking Machine Company and early American labels.",
    url: "https://www.loc.gov/collections/national-jukebox/",
    freeScope: "Historical public domain audio",
    category: "audio",
  },
];
