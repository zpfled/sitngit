import content from "./site.json";

// Resolve the shared availability sentence for cards, page copy, and metadata.
const site: typeof content = JSON.parse(
  JSON.stringify(content).replaceAll(
    "{{trailer_availability}}",
    JSON.stringify(content.trailer_availability).slice(1, -1)
  )
);

export default site;
