import { promises as fs } from "node:fs";
import path from "node:path";

const apiKey = process.env.GOOGLE_PLACES_API_KEY;
const placeId = process.env.GOOGLE_PLACE_ID;
const outputPath = path.join(process.cwd(), "src", "data", "google-reviews.json");
const reviewLimit = 5;

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

async function readResponseBody(response) {
  const body = await response.text();
  if (!body) return null;

  try {
    return JSON.parse(body);
  } catch {
    return body;
  }
}

function googleErrorMessage(payload) {
  if (!payload) return "";
  if (typeof payload === "string") return payload;
  return payload.error?.message ?? JSON.stringify(payload);
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
    "googleMapsUri",
    "reviews"
  ].join(",");
  const response = await fetch(`https://places.googleapis.com/v1/places/${placeId}?fields=${fields}`, {
    headers: {
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": fields
    }
  });
  if (!response.ok) {
    const payload = await readResponseBody(response);
    await writeOutput(existing);
    console.error(`Failed to fetch Google reviews: HTTP ${response.status} ${response.statusText}`);
    console.error(googleErrorMessage(payload));
    console.error("Keeping existing reviews data.");
    process.exitCode = 1;
    return;
  }

  const payload = await readResponseBody(response);
  if (payload.error?.message) {
    await writeOutput(existing);
    console.error(`Google Places error: ${payload.error.message}`);
    console.error("Keeping existing reviews data.");
    process.exitCode = 1;
    return;
  }

  const reviews = [...(payload.reviews ?? [])]
    .sort((a, b) => new Date(b.publishTime ?? 0).getTime() - new Date(a.publishTime ?? 0).getTime())
    .slice(0, reviewLimit)
    .map((review) => ({
      name: review.authorAttribution?.displayName ?? "Google reviewer",
      initials: initialsFromName(review.authorAttribution?.displayName ?? ""),
      time: review.relativePublishTimeDescription ?? "",
      rating: review.rating ?? 5,
      text: review.originalText?.text ?? review.text?.text ?? "",
      url: review.googleMapsUri ?? review.authorAttribution?.uri ?? "",
      avatar: review.authorAttribution?.photoUri,
      publishTime: review.publishTime
    }));

  const next = {
    summary: {
      ...existing.summary,
      rating: payload.rating ?? existing.summary.rating ?? 5,
      count: payload.userRatingCount ?? existing.summary.count ?? reviews.length,
      cta_href: payload.googleMapsUri ?? existing.summary.cta_href
    },
    reviews
  };

  await writeOutput(next);
  console.warn("Places API (New) does not expose review pagination.");
  console.warn(`Sorted all ${payload.reviews?.length ?? 0} reviews returned by Google by publishTime and kept the newest ${reviews.length}.`);
  console.log(`Updated Google reviews data with ${reviews.length} reviews from Places API (New).`);
}

await main();
