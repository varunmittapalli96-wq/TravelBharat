import { z } from 'zod';

// ===== State Schemas =====
export const createStateSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(120).regex(/^[a-z0-9-]+$/),
  type: z.enum(['STATE', 'UT']),
  capital: z.string().min(1).max(100),
  region: z.enum(['NORTH', 'SOUTH', 'EAST', 'WEST', 'CENTRAL', 'NORTHEAST']),
  description: z.string().min(10),
  bannerImage: z.string().url(),
  svgMapId: z.string().optional().nullable(),
});

export const updateStateSchema = createStateSchema.partial();

// ===== City Schemas =====
export const createCitySchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(120).regex(/^[a-z0-9-]+$/),
  stateId: z.string().min(1),
  description: z.string().min(10),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

export const updateCitySchema = createCitySchema.partial();

// ===== Place Schemas =====
export const placeSourceSchema = z.object({
  url: z.string().url(),
  title: z.string().min(1),
});

export const createPlaceSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(250).regex(/^[a-z0-9-]+$/),
  stateId: z.string().min(1),
  cityId: z.string().optional().nullable(),
  category: z.enum(['HERITAGE', 'NATURE', 'RELIGIOUS', 'ADVENTURE']),
  tags: z.array(z.enum(['BEACH', 'HILL_STATION', 'WILDLIFE', 'CULTURAL', 'HIDDEN_GEM'])).default([]),
  shortDescription: z.string().min(10).max(300),
  description: z.string().min(20),
  historicalSignificance: z.string().optional().nullable(),
  bestTimeToVisit: z.string().min(1),
  bestMonths: z.array(z.number().min(1).max(12)).min(1),
  entryFee: z.string().optional().nullable(),
  timings: z.string().optional().nullable(),
  mapLink: z.string().url().optional().nullable(),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  howToReachAirport: z.string().optional().nullable(),
  howToReachRailway: z.string().optional().nullable(),
  howToReachRoad: z.string().optional().nullable(),
  localTips: z.array(z.string()).default([]),
  isUnesco: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  status: z.enum(['DRAFT', 'IN_REVIEW', 'VERIFIED']).default('DRAFT'),
  sources: z.array(placeSourceSchema).default([]),
});

export const updatePlaceSchema = createPlaceSchema.partial();

export const updatePlaceStatusSchema = z.object({
  status: z.enum(['DRAFT', 'IN_REVIEW', 'VERIFIED']),
});

// ===== Image Schemas =====
export const createImageSchema = z.object({
  url: z.string().url(),
  alt: z.string().min(1).max(300),
  caption: z.string().optional().nullable(),
  credit: z.string().min(1),
  license: z.string().min(1),
  sourceUrl: z.string().url().optional().nullable(),
  isCover: z.boolean().default(false),
  order: z.number().int().min(0).default(0),
});

export const reorderImagesSchema = z.object({
  imageIds: z.array(z.string().min(1)),
});

// ===== Auth Schemas =====
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// ===== Contact Schema =====
export const contactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  subject: z.string().min(1).max(200),
  message: z.string().min(10).max(5000),
});

// ===== Analytics Schema =====
export const analyticsEventSchema = z.object({
  event: z.string().min(1).max(100),
  page: z.string().optional(),
  data: z.record(z.unknown()).optional(),
  sessionId: z.string().optional(),
});

// ===== Query Schemas =====
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const placeFilterSchema = paginationSchema.extend({
  stateId: z.string().optional(),
  cityId: z.string().optional(),
  category: z.enum(['HERITAGE', 'NATURE', 'RELIGIOUS', 'ADVENTURE']).optional(),
  tags: z.string().optional(), // comma-separated
  month: z.coerce.number().int().min(1).max(12).optional(),
  q: z.string().optional(),
  unesco: z.coerce.boolean().optional(),
  freeEntry: z.coerce.boolean().optional(),
  sort: z.enum(['name', 'popular', 'newest']).default('name'),
});

export const searchSuggestSchema = z.object({
  q: z.string().min(1),
  limit: z.coerce.number().int().min(1).max(20).default(8),
});
