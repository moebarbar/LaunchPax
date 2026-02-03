import { defineConnector } from "../registry";
import type { ConnectorTask, ConnectorResult } from "@shared/schema";

interface PlaceDetails {
  placeId: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  rating?: number;
  phoneNumber?: string;
  website?: string;
  openingHours?: string[];
}

interface GeocodingResult {
  lat: number;
  lng: number;
  formattedAddress: string;
  placeId: string;
}

interface MapEmbedConfig {
  embedUrl: string;
  mapType: "place" | "directions" | "search" | "view";
  zoom: number;
}

async function geocodeAddress(address: string): Promise<ConnectorResult<GeocodingResult>> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  
  if (!apiKey) {
    return {
      success: false,
      error: "Google Maps API key not configured",
      provider: "google-maps",
    };
  }

  try {
    const params = new URLSearchParams({
      address,
      key: apiKey,
    });

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?${params}`
    );

    if (!response.ok) {
      return {
        success: false,
        error: `Google Maps API error: ${response.statusText}`,
        provider: "google-maps",
      };
    }

    const data = await response.json();
    
    if (data.status !== "OK" || !data.results?.[0]) {
      return {
        success: false,
        error: `Geocoding failed: ${data.status}`,
        provider: "google-maps",
      };
    }

    const result = data.results[0];
    return {
      success: true,
      data: {
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng,
        formattedAddress: result.formatted_address,
        placeId: result.place_id,
      },
      provider: "google-maps",
    };
  } catch (error) {
    console.error("[GoogleMaps] Geocoding failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to geocode address",
      provider: "google-maps",
    };
  }
}

async function getPlaceDetails(placeId: string): Promise<ConnectorResult<PlaceDetails>> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  
  if (!apiKey) {
    return {
      success: false,
      error: "Google Maps API key not configured",
      provider: "google-maps",
    };
  }

  try {
    const params = new URLSearchParams({
      place_id: placeId,
      fields: "name,formatted_address,geometry,rating,formatted_phone_number,website,opening_hours",
      key: apiKey,
    });

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?${params}`
    );

    if (!response.ok) {
      return {
        success: false,
        error: `Google Maps API error: ${response.statusText}`,
        provider: "google-maps",
      };
    }

    const data = await response.json();
    
    if (data.status !== "OK" || !data.result) {
      return {
        success: false,
        error: `Place details failed: ${data.status}`,
        provider: "google-maps",
      };
    }

    const place = data.result;
    return {
      success: true,
      data: {
        placeId,
        name: place.name,
        address: place.formatted_address,
        lat: place.geometry?.location?.lat,
        lng: place.geometry?.location?.lng,
        rating: place.rating,
        phoneNumber: place.formatted_phone_number,
        website: place.website,
        openingHours: place.opening_hours?.weekday_text,
      },
      provider: "google-maps",
    };
  } catch (error) {
    console.error("[GoogleMaps] Place details failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get place details",
      provider: "google-maps",
    };
  }
}

function generateEmbedUrl(options: {
  address?: string;
  lat?: number;
  lng?: number;
  zoom?: number;
  mapType?: "place" | "directions" | "search" | "view";
}): ConnectorResult<MapEmbedConfig> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  
  if (!apiKey) {
    return {
      success: false,
      error: "Google Maps API key not configured",
      provider: "google-maps",
    };
  }

  const mapType = options.mapType || "place";
  const zoom = options.zoom || 15;
  
  let embedUrl: string;
  
  if (options.address) {
    embedUrl = `https://www.google.com/maps/embed/v1/${mapType}?key=${apiKey}&q=${encodeURIComponent(options.address)}&zoom=${zoom}`;
  } else if (options.lat !== undefined && options.lng !== undefined) {
    embedUrl = `https://www.google.com/maps/embed/v1/view?key=${apiKey}&center=${options.lat},${options.lng}&zoom=${zoom}`;
  } else {
    return {
      success: false,
      error: "Either address or coordinates required",
      provider: "google-maps",
    };
  }

  return {
    success: true,
    data: {
      embedUrl,
      mapType,
      zoom,
    },
    provider: "google-maps",
  };
}

export const googleMapsConnector = defineConnector({
  key: "google-maps",
  name: "Google Maps",
  description: "Location embedding and geocoding for business websites",
  category: "maps",
  capabilities: ["maps"],
  authType: "apiKey",
  requiredEnvVars: ["GOOGLE_MAPS_API_KEY"],
  
  isConfigured(): boolean {
    return !!process.env.GOOGLE_MAPS_API_KEY;
  },

  async test(): Promise<{ ok: boolean; message: string }> {
    if (!process.env.GOOGLE_MAPS_API_KEY) {
      return { ok: false, message: "Google Maps API key not configured" };
    }
    const result = await geocodeAddress("New York, NY");
    if (result.success) {
      return { ok: true, message: "Google Maps API connected successfully" };
    }
    return { ok: false, message: result.error || "Failed to connect to Google Maps" };
  },

  async execute<I, O>(task: ConnectorTask<I>): Promise<ConnectorResult<O>> {
    const input = task.input as any;

    switch (task.action) {
      case "geocode":
        return geocodeAddress(input.address) as Promise<ConnectorResult<O>>;

      case "place_details":
        return getPlaceDetails(input.placeId) as Promise<ConnectorResult<O>>;

      case "generate_embed":
        return Promise.resolve(generateEmbedUrl({
          address: input.address,
          lat: input.lat,
          lng: input.lng,
          zoom: input.zoom,
          mapType: input.mapType,
        })) as Promise<ConnectorResult<O>>;

      default:
        return {
          success: false,
          error: `Unknown action: ${task.action}`,
          provider: "google-maps",
        };
    }
  },
});
