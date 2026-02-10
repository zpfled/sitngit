const normalizeBase = (canonicalBase: string) => canonicalBase.replace(/\/$/, "");

export const buildSchemaIds = (canonicalBase: string) => {
  const base = normalizeBase(canonicalBase);
  return {
    localBusinessId: `${base}/#localbusiness`,
    websiteId: `${base}/#website`
  };
};

export const buildLocalBusinessSchema = (site: any, canonicalBase: string) => {
  const base = normalizeBase(canonicalBase);
  const { localBusinessId } = buildSchemaIds(base);
  const address = site.business?.address ?? {
    street: "16511 Ash Ridge Dr",
    city: "Viola",
    state: "WI",
    zip: "54664",
    country: "US"
  };
  const serviceAreas = (site.service_area?.counties ?? []).map((county: any) => `${county.name}, WI`);

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": localBusinessId,
    name: site.business?.name,
    url: `${base}/`,
    telephone: site.business?.phone_tel,
    image: `${base}${site.business?.logo?.src ?? "/images/logo.png"}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: address.street,
      addressLocality: address.city,
      addressRegion: address.state,
      postalCode: address.zip,
      addressCountry: address.country
    },
    sameAs: [
      "https://www.facebook.com/profile.php?id=61587805803084",
      "https://www.google.com/maps?cid=15132098919818792858"
    ],
    priceRange: "$90-$150 per unit",
    areaServed: serviceAreas.map((area: string) => ({ "@type": "AdministrativeArea", name: area })),
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "08:00",
        closes: "17:00"
      }
    ],
    knowsAbout: [
      "Portable restroom rentals",
      "ADA accessible portable restrooms",
      "Handwashing station rentals",
      "Portable toilet servicing"
    ]
  };
};

export const buildWebsiteSchema = (
  site: any,
  canonicalBase: string,
  localBusinessId: string,
  websiteId: string
) => {
  const base = normalizeBase(canonicalBase);
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": websiteId,
    name: site.business?.name,
    url: `${base}/`,
    publisher: { "@id": localBusinessId }
  };
};

export const buildServiceSchema = ({
  serviceSlug,
  serviceAreas,
  localBusinessId
}: {
  serviceSlug: string;
  serviceAreas: string[];
  localBusinessId: string;
}) => {
  const serviceTypeMap: Record<string, string> = {
    "portable-restrooms": "Portable restroom rentals",
    "ada-restrooms": "Wheelchair-accessible portable restroom rentals",
    "handwashing-stations": "Handwash station rentals",
    "toilet-servicing": "Portable toilet servicing"
  };
  const serviceType = serviceTypeMap[serviceSlug];
  if (!serviceType) return null;

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType,
    provider: { "@id": localBusinessId },
    areaServed: serviceAreas.map((area) => ({ "@type": "AdministrativeArea", name: area }))
  };
};
