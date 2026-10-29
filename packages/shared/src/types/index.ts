import { z } from 'zod';

// ===== State Types =====
export interface StateResponse {
  id: string;
  name: string;
  slug: string;
  type: 'STATE' | 'UT';
  capital: string;
  region: string;
  description: string;
  bannerImage: string;
  svgMapId: string | null;
  cityCount?: number;
  placeCount?: number;
}

// ===== City Types =====
export interface CityResponse {
  id: string;
  name: string;
  slug: string;
  stateId: string;
  description: string;
  lat: number;
  lng: number;
  state?: { name: string; slug: string };
  placeCount?: number;
}

// ===== Place Types =====
export interface PlaceSource {
  url: string;
  title: string;
}

export interface PlaceImageResponse {
  id: string;
  placeId: string;
  url: string;
  alt: string;
  caption: string | null;
  credit: string;
  license: string;
  sourceUrl: string | null;
  isCover: boolean;
  order: number;
}

export interface PlaceResponse {
  id: string;
  name: string;
  slug: string;
  stateId: string;
  cityId: string | null;
  category: string;
  tags: string[];
  shortDescription: string;
  description: string;
  historicalSignificance: string | null;
  bestTimeToVisit: string;
  bestMonths: number[];
  entryFee: string | null;
  timings: string | null;
  mapLink: string | null;
  lat: number;
  lng: number;
  howToReachAirport: string | null;
  howToReachRailway: string | null;
  howToReachRoad: string | null;
  localTips: string[];
  isUnesco: boolean;
  isFeatured: boolean;
  status: string;
  sources: PlaceSource[];
  verifiedBy: string | null;
  verifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
  images?: PlaceImageResponse[];
  state?: { name: string; slug: string };
  city?: { name: string; slug: string } | null;
}

export interface NearbyPlaceResponse {
  place: PlaceResponse;
  distanceKm: number;
}

// ===== API Response Types =====
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: PaginationMeta;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// ===== Query Params =====
export interface PlaceQueryParams {
  stateId?: string;
  cityId?: string;
  category?: string;
  tags?: string[];
  month?: number;
  q?: string;
  unesco?: boolean;
  freeEntry?: boolean;
  sort?: 'name' | 'popular' | 'newest';
  page?: number;
  limit?: number;
}

export interface SearchSuggestion {
  type: 'state' | 'city' | 'place';
  name: string;
  slug: string;
  extra?: string;
}

// ===== Admin Types =====
export interface AdminUserResponse {
  id: string;
  email: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuditLogResponse {
  id: string;
  userId: string;
  action: string;
  entity: string;
  entityId: string;
  diff: unknown;
  createdAt: string;
  user?: { email: string };
}

export interface DashboardStats {
  totalStates: number;
  totalCities: number;
  totalPlaces: number;
  verifiedPlaces: number;
  draftPlaces: number;
  inReviewPlaces: number;
  unescoPlaces: number;
  featuredPlaces: number;
  totalImages: number;
  placesWithoutImages: number;
  recentEdits: AuditLogResponse[];
}

export interface ContactMessageRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface AnalyticsEventRequest {
  event: string;
  page?: string;
  data?: Record<string, unknown>;
  sessionId?: string;
}
