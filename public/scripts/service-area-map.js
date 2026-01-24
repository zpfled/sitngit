function initServiceAreaMap() {
  const mapElement = document.getElementById("service-area-map");
  if (!mapElement || mapElement.dataset.mapInitialized === "true") return;

  const geojsonUrl = mapElement.dataset.geojsonUrl;

  const waitForLeaflet = () =>
    new Promise((resolve) => {
      if (window.L) {
        resolve(window.L);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = () => resolve(window.L);
      document.head.appendChild(script);
    });

  const loadGeojson = async () => {
    if (!geojsonUrl) return null;
    const response = await fetch(geojsonUrl);
    if (!response.ok) {
      throw new Error(`Failed to load GeoJSON (${response.status})`);
    }
    return response.json();
  };

  const getCentroid = (data) => {
    const features = data?.type === "FeatureCollection" ? data.features : [data];
    const polygons = [];

    features.forEach((feature) => {
      const geometry = feature?.geometry || feature;
      if (!geometry) return;
      if (geometry.type === "Polygon") {
        polygons.push(geometry.coordinates);
      } else if (geometry.type === "MultiPolygon") {
        geometry.coordinates.forEach((polygon) => polygons.push(polygon));
      }
    });

    if (!polygons.length) return null;

    let totalArea = 0;
    let centroidX = 0;
    let centroidY = 0;

    polygons.forEach((polygon) => {
      const ring = polygon[0];
      if (!ring || ring.length < 3) return;
      let area = 0;
      let cx = 0;
      let cy = 0;

      for (let i = 0, j = ring.length - 1; i < ring.length; j = i, i += 1) {
        const [x1, y1] = ring[j];
        const [x2, y2] = ring[i];
        const cross = x1 * y2 - x2 * y1;
        area += cross;
        cx += (x1 + x2) * cross;
        cy += (y1 + y2) * cross;
      }

      area *= 0.5;
      if (area === 0) return;
      cx /= 6 * area;
      cy /= 6 * area;

      totalArea += area;
      centroidX += cx * area;
      centroidY += cy * area;
    });

    if (totalArea === 0) return null;
    return [centroidY / totalArea, centroidX / totalArea];
  };

  Promise.all([waitForLeaflet(), loadGeojson()]).then(([L, geojson]) => {
    if (!geojson) return;
    const map = L.map(mapElement, {
      zoomControl: false,
      scrollWheelZoom: false,
      attributionControl: false
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18
    }).addTo(map);

    const layer = L.geoJSON(geojson, {
      style: () => ({
        color: "#214734",
        weight: 2,
        fillColor: "#214734",
        fillOpacity: 0.25
      })
    }).addTo(map);

    const bounds = layer.getBounds();
    map.fitBounds(bounds, { padding: [20, 20], maxZoom: 12 });
    const centroid = getCentroid(geojson);
    const baseCenter = centroid ? L.latLng(centroid[0], centroid[1]) : bounds.getCenter();
    const lngShift = (bounds.getEast() - bounds.getWest()) * 0.4;
    map.setView([baseCenter.lat, baseCenter.lng - lngShift], map.getZoom(), { animate: false });
    mapElement.dataset.mapInitialized = "true";
  });
}

function lazyLoadServiceAreaMap() {
  const mapElement = document.getElementById("service-area-map");
  if (!mapElement || mapElement.dataset.mapInitialized === "true") return;

  if (!("IntersectionObserver" in window)) {
    initServiceAreaMap();
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      initServiceAreaMap();
    },
    { rootMargin: "200px 0px" }
  );

  observer.observe(mapElement);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", lazyLoadServiceAreaMap, { once: true });
} else {
  lazyLoadServiceAreaMap();
}
