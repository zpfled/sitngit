import { promises as fs } from "node:fs";
import path from "node:path";

const apiKey = process.env.GOOGLE_PLACES_API_KEY;
const placeId = process.env.GOOGLE_PLACE_ID;
const outputPath = path.join(process.cwd(), "src", "content", "google-reviews.json");

function initialsFromName(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

async function readExisting() {
  try {
    const raw = await fs.readFile(outputPath, "utf-8");
    return JSON.parse(raw);
  } catch {
    return {
      summary: {
        label: "Google Reviews",
        rating: 5,
        count: 0,
        cta_label: "Review us on Google",
        cta_href: ""
      },
      reviews: []
    };
  }
}

async function writeOutput(payload) {
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`);
}

async function main() {
  const existing = await readExisting();
  if (!apiKey || !placeId) {
    await writeOutput(existing);
    console.warn("Missing GOOGLE_PLACES_API_KEY or GOOGLE_PLACE_ID. Keeping existing reviews data.");
    return;
  }

  const fields = [
    "rating",
    "userRatingCount",
    "reviews"
  ].join(",");
  const response = await fetch(`https://places.googleapis.com/v1/places/${placeId}?fields=${fields}`, {
    headers: {
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": fields
    }
  });
  if (!response.ok) {
    await writeOutput(existing);
    console.warn("Failed to fetch Google reviews. Keeping existing reviews data.");
    return;
  }

  const payload = await response.json();
  if (payload.error?.message) {
    await writeOutput(existing);
    console.warn(`Google Places error: ${payload.error.message}. Keeping existing reviews data.`);
    return;
  }

  const reviews = (payload.reviews ?? [])
    .filter((review) => review.rating === 5)
    .slice(0, 4)
    .map((review) => ({
      name: review.authorAttribution?.displayName ?? "Google reviewer",
      initials: initialsFromName(review.authorAttribution?.displayName ?? ""),
      time: review.relativePublishTimeDescription ?? "",
      rating: review.rating ?? 5,
      text: review.text?.text ?? "",
      url: review.authorAttribution?.uri ?? "",
      avatar: review.authorAttribution?.photoUri
    }));

  const next = {
    summary: {
      ...existing.summary,
      rating: payload.rating ?? existing.summary.rating ?? 5,
      count: payload.userRatingCount ?? existing.summary.count ?? reviews.length
    },
    reviews
  };

  await writeOutput(next);
  console.log("Updated Google reviews data.");
}

await main();
