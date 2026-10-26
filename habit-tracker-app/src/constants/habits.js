// ------------------------------------------------------------
// Habit data used by the Home and Detail screens.
// CATEGORIES: the colour and icon used for each habit category.
// DEFAULT_HABITS: the starter habits every new user sees.
// ------------------------------------------------------------

export const CATEGORIES = {
  Health: { icon: "water-outline", bg: "#E0F2FE", fg: "#0369A1" },
  Fitness: { icon: "barbell-outline", bg: "#FFEDD5", fg: "#C2410C" },
  Mindfulness: { icon: "leaf-outline", bg: "#DCFCE7", fg: "#15803D" },
  Learning: { icon: "book-outline", bg: "#EDE9FE", fg: "#6D28D9" },
  Sleep: { icon: "moon-outline", bg: "#E0E7FF", fg: "#4338CA" },
};

export const DEFAULT_HABITS = [
  {
    id: "1",
    title: "Morning Walk",
    category: "Health",
    duration: "20 min",
    icon: "walk-outline",
    description:
      "A short walk in the morning boosts your energy, clears your mind and improves your mood for the rest of the day.",
    tips: [
      "Put your walking shoes next to the door the night before.",
      "Walk at a comfortable but steady pace.",
      "Leave your phone in your pocket and enjoy the fresh air.",
      "Start with 10 minutes and add a few minutes each week.",
    ],
    completedDates: [],
    favorite: false,
  },
  {
    id: "2",
    title: "Read 10 Pages",
    category: "Learning",
    duration: "15 min",
    icon: "book-outline",
    description:
      "Reading a few pages every day builds knowledge, improves focus and is a calm way to end the day.",
    tips: [
      "Keep your book where you can see it.",
      "Read at the same time every day, for example before bed.",
      "Choose a topic you enjoy so it never feels like a task.",
    ],
    completedDates: [],
    favorite: false,
  },
  {
    id: "3",
    title: "Drink Water",
    category: "Health",
    duration: "8 glasses",
    icon: "water-outline",
    description:
      "Staying hydrated helps your body and brain work at their best and keeps you feeling fresh all day.",
    tips: [
      "Start your morning with a glass of water.",
      "Carry a reusable bottle with you.",
      "Drink a glass of water before every meal.",
    ],
    completedDates: [],
    favorite: false,
  },
  {
    id: "4",
    title: "Meditate",
    category: "Mindfulness",
    duration: "10 min",
    icon: "leaf-outline",
    description:
      "A few minutes of quiet breathing reduces stress and helps you feel calm and focused.",
    tips: [
      "Sit comfortably in a quiet place and close your eyes.",
      "Breathe in slowly for 4 seconds, then out for 4 seconds.",
      "When your mind wanders, gently return to your breath.",
    ],
    completedDates: [],
    favorite: false,
  },
  {
    id: "5",
    title: "Sleep Early",
    category: "Sleep",
    duration: "Before 11 PM",
    icon: "moon-outline",
    description:
      "Going to bed at the same time every night gives your body the rest it needs to recover and recharge.",
    tips: [
      "Put screens away 30 minutes before bed.",
      "Keep your bedroom dark and cool.",
      "Go to bed and wake up at the same time, even on weekends.",
    ],
    completedDates: [],
    favorite: false,
  },
];
