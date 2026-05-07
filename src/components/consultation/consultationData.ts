type Intent = "exploring" | "deciding" | "planning";

export const INTENT_OPTIONS: { id: Intent; emoji: string; label: string; sub: string }[] = [
  { id: "exploring", emoji: "👀", label: "I'm exploring Ghana",          sub: "Curious about opportunities & what's possible"  },
  { id: "deciding",  emoji: "🤔", label: "I have a goal in mind",        sub: "Investment, market entry, or a diaspora visit"   },
  { id: "planning",  emoji: "🗓️", label: "I'm ready to plan a program",  sub: "I know what I need  let's get started"          },
];

export const EVENT_TYPES = [
  "Investor Delegation",
  "Corporate Site Visit",
  "Market Entry Program",
  "Fellowship / Leadership Program",
  "Diaspora Experience",
  "Startup Ecosystem Event",
  "Private Concierge Visit",
  "Something else",
];

