// ------------------------------------------------------------
// External API: random motivational quotes.
// API used: DummyJSON Quotes API (free, no API key needed)
//   GET https://dummyjson.com/quotes/random
// Example JSON response:
//   { "id": 12, "quote": "...", "author": "..." }
// ------------------------------------------------------------

const QUOTES_API_URL = "https://dummyjson.com/quotes/random";

// Quotes shown if the API cannot be reached (for example, no internet)
export const FALLBACK_QUOTES = [
  {
    text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
    author: "Will Durant",
  },
  {
    text: "Small daily improvements over time lead to stunning results.",
    author: "Robin Sharma",
  },
  {
    text: "Motivation is what gets you started. Habit is what keeps you going.",
    author: "Jim Ryun",
  },
];

// Makes a GET request to the quotes API and returns { text, author }.
// Throws an error if the request fails, so the caller can handle it.
export async function fetchRandomQuote() {
  const response = await fetch(QUOTES_API_URL);

  if (!response.ok) {
    throw new Error(`Failed to fetch quote (status ${response.status})`);
  }

  // Convert the JSON response into a JavaScript object
  const data = await response.json();

  // Keep only the fields the app needs
  return {
    text: data.quote,
    author: data.author,
  };
}

// Returns a random quote from the local fallback list
export function getFallbackQuote() {
  const index = Math.floor(Math.random() * FALLBACK_QUOTES.length);
  return FALLBACK_QUOTES[index];
}
