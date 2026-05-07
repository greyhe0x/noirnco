type Intent = "exploring" | "deciding" | "planning";

export const INTENT_OPTIONS: { id: Intent; label: string; sub: string }[] = [
  { id: "exploring", label: "I'm exploring Ghana",          sub: "Curious about opportunities & what's possible"  },
  { id: "deciding",  label: "I have a goal in mind",        sub: "Investment, market entry, or a diaspora visit"   },
  { id: "planning",  label: "I'm ready to plan a program",  sub: "I know what I need  let's get started"          },
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

export const EVENT_TYPE_OTHER = "Something else";

export const EXPLORING_INTERESTS_NOT_SURE = "Not sure yet";
export const EXPLORING_INTERESTS_OTHER = "Other";

export const EXPLORING_INTERESTS = [
  "Business & Investment",
  "Cultural & Heritage",
  "Diaspora Roots",
  "Lifestyle & Leisure",
  "Networking & Community",
  "Concierge Stay",
  EXPLORING_INTERESTS_OTHER,
  EXPLORING_INTERESTS_NOT_SURE,
];

export const EXPLORING_TIMEFRAMES = [
  "Within 3 months",
  "3-6 months",
  "6-12 months",
  "Just researching",
];

export const DECIDING_GOALS = [
  "Investment",
  "Market entry",
  "Diaspora visit",
  "Partnerships",
  "Talent or hiring",
  "Site selection",
  "Other",
];

export const DECIDING_AUDIENCES = [
  "Just me",
  "My company",
  "A small team (2-10)",
  "A larger group (10+)",
  "A client of mine",
];

export const PLANNING_TIMEFRAMES = [
  "Within 1 month",
  "1-3 months",
  "3-6 months",
  "6+ months",
  "Flexible",
];

export const PLANNING_GROUP_SIZES = [
  "1-5",
  "6-15",
  "16-30",
  "31-75",
  "75+",
];

export const PLANNING_DURATIONS = [
  "1-2 days",
  "3-5 days",
  "1 week",
  "1-2 weeks",
  "Longer",
];

