const apiKey = process.env.GOOGLE_PLACES_API_KEY;
const input = process.argv.slice(2).join(" ").trim();

if (!apiKey) {
  console.error("Missing GOOGLE_PLACES_API_KEY in the environment.");
  process.exit(1);
}

if (!input) {
  console.error('Usage: npm run find-place-id -- "Business Name 555-555-5555 City, ST"');
  process.exit(1);
}

const response = await fetch("https://places.googleapis.com/v1/places:searchText", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": apiKey,
    "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress"
  },
  body: JSON.stringify({ textQuery: input })
});
if (!response.ok) {
  console.error("Request failed:", response.status);
  process.exit(1);
}

const payload = await response.json();
if (payload.error?.message) {
  console.error("Google Places error:", payload.error.message);
  process.exit(1);
}

const places = payload.places ?? [];
if (!places.length) {
  console.error("No candidates found. Try a different search string.");
  process.exit(1);
}

if (places.length === 1) {
  console.log("Place ID:", places[0].id);
  process.exit(0);
}

console.log("Multiple candidates found:");
places.forEach((place, index) => {
  const name = place.displayName?.text ?? "Unknown";
  const address = place.formattedAddress ?? "Address unavailable";
  console.log(`${index + 1}. ${name} — ${address}`);
  console.log(`   Place ID: ${place.id}`);
});
