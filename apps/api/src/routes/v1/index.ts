import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../../app';
import { sendSuccess, paginate, paginationArgs } from '../../utils/response';
import { validate } from '../../middleware/validate';
import { paginationSchema, placeFilterSchema, searchSuggestSchema, contactSchema, analyticsEventSchema } from '@travelbharat/shared';
import { ApiError } from '../../middleware/errorHandler';
import { Prisma } from '@prisma/client';

export function createPublicRoutes() {
  const router = Router();

  // ===== STATES =====

  /**
   * @swagger
   * /api/v1/states:
   *   get:
   *     tags: [States]
   *     summary: List all states and union territories
   *     parameters:
   *       - in: query
   *         name: region
   *         schema: { type: string }
   *       - in: query
   *         name: type
   *         schema: { type: string, enum: [STATE, UT] }
   *       - in: query
   *         name: q
   *         schema: { type: string }
   *     responses:
   *       200:
   *         description: List of states
   */
  router.get('/states', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { region, type, q } = req.query;
      const where: Prisma.StateWhereInput = {};

      if (region && typeof region === 'string') {
        where.region = region as Prisma.EnumRegionFilter['equals'];
      }
      if (type && typeof type === 'string') {
        where.type = type as Prisma.EnumStateTypeFilter['equals'];
      }
      if (q && typeof q === 'string') {
        where.name = { contains: q, mode: 'insensitive' };
      }

      const states = await prisma.state.findMany({
        where,
        orderBy: { name: 'asc' },
        include: {
          _count: {
            select: { cities: true, places: { where: { status: 'VERIFIED', deletedAt: null } } },
          },
        },
      });

      const data = states.map((s) => ({
        ...s,
        cityCount: s._count.cities,
        placeCount: s._count.places,
        _count: undefined,
      }));

      sendSuccess(res, { data });
    } catch (error) {
      next(error);
    }
  });

  /**
   * @swagger
   * /api/v1/states/{slug}:
   *   get:
   *     tags: [States]
   *     summary: Get state by slug
   */
  router.get('/states/:slug', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const state = await prisma.state.findUnique({
        where: { slug: req.params.slug },
        include: {
          cities: { orderBy: { name: 'asc' } },
          _count: {
            select: { places: { where: { status: 'VERIFIED', deletedAt: null } } },
          },
        },
      });

      if (!state) {
        throw ApiError.notFound('State not found');
      }

      sendSuccess(res, {
        data: { ...state, placeCount: state._count.places, _count: undefined },
      });
    } catch (error) {
      next(error);
    }
  });

  // ===== CITIES =====

  /**
   * @swagger
   * /api/v1/cities:
   *   get:
   *     tags: [Cities]
   *     summary: List cities
   */
  router.get('/cities', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { stateId, q } = req.query;
      const where: Prisma.CityWhereInput = {};

      if (stateId && typeof stateId === 'string') where.stateId = stateId;
      if (q && typeof q === 'string') where.name = { contains: q, mode: 'insensitive' };

      const cities = await prisma.city.findMany({
        where,
        orderBy: { name: 'asc' },
        include: {
          state: { select: { name: true, slug: true } },
          _count: { select: { places: { where: { status: 'VERIFIED', deletedAt: null } } } },
        },
      });

      const data = cities.map((c) => ({
        ...c,
        placeCount: c._count.places,
        _count: undefined,
      }));

      sendSuccess(res, { data });
    } catch (error) {
      next(error);
    }
  });

  /**
   * @swagger
   * /api/v1/cities/{slug}:
   *   get:
   *     tags: [Cities]
   *     summary: Get city by slug
   */
  router.get('/cities/:slug', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const city = await prisma.city.findUnique({
        where: { slug: req.params.slug },
        include: {
          state: { select: { name: true, slug: true } },
          _count: { select: { places: { where: { status: 'VERIFIED', deletedAt: null } } } },
        },
      });

      if (!city) {
        throw ApiError.notFound('City not found');
      }

      sendSuccess(res, {
        data: { ...city, placeCount: city._count.places, _count: undefined },
      });
    } catch (error) {
      next(error);
    }
  });

  // ===== PLACES =====

  /**
   * @swagger
   * /api/v1/places:
   *   get:
   *     tags: [Places]
   *     summary: List verified tourist places with filters
   */
  router.get('/places', validate(placeFilterSchema, 'query'), async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { stateId, cityId, category, tags, month, q, unesco, freeEntry, sort, page, limit } = req.query as Record<string, string>;

      const pageNum = parseInt(page as string) || 1;
      const limitNum = parseInt(limit as string) || 20;

      const where: Prisma.PlaceWhereInput = {
        status: 'VERIFIED',
        deletedAt: null,
      };

      if (stateId) where.stateId = stateId;
      if (cityId) where.cityId = cityId;
      if (category) where.category = category as any;
      if (tags) where.tags = { hasSome: tags.split(',') as any };
      if (month) where.bestMonths = { has: parseInt(month as string) };
      if (q) {
        where.OR = [
          { name: { contains: q, mode: 'insensitive' } },
          { shortDescription: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
        ];
      }
      if (unesco === 'true') where.isUnesco = true;
      if (freeEntry === 'true') where.entryFee = null;

      let orderBy: Prisma.PlaceOrderByWithRelationInput = { name: 'asc' };
      if (sort === 'newest') orderBy = { createdAt: 'desc' };
      if (sort === 'popular') orderBy = { isFeatured: 'desc' };

      const [total, places] = await Promise.all([
        prisma.place.count({ where }),
        prisma.place.findMany({
          where,
          orderBy,
          ...paginationArgs(pageNum, limitNum),
          include: {
            images: { where: { isCover: true }, take: 1 },
            state: { select: { name: true, slug: true } },
            city: { select: { name: true, slug: true } },
          },
        }),
      ]);

      sendSuccess(res, {
        data: places,
        meta: paginate(pageNum, limitNum, total),
      });
    } catch (error) {
      next(error);
    }
  });

  /**
   * @swagger
   * /api/v1/places/{slug}:
   *   get:
   *     tags: [Places]
   *     summary: Get place detail by slug
   */
  router.get('/places/:slug', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const place = await prisma.place.findUnique({
        where: { slug: req.params.slug, status: 'VERIFIED', deletedAt: null },
        include: {
          images: { orderBy: { order: 'asc' } },
          state: { select: { name: true, slug: true } },
          city: { select: { name: true, slug: true } },
          nearbyFrom: {
            include: {
              nearbyPlace: {
                include: {
                  images: { where: { isCover: true }, take: 1 },
                  state: { select: { name: true, slug: true } },
                },
              },
            },
          },
        },
      });

      if (!place) {
        throw ApiError.notFound('Place not found');
      }

      const nearby = place.nearbyFrom.map((n) => ({
        place: n.nearbyPlace,
        distanceKm: n.distanceKm,
      }));

      sendSuccess(res, {
        data: { ...place, nearby, nearbyFrom: undefined },
      });
    } catch (error) {
      next(error);
    }
  });

  // ===== SEARCH =====

  /**
   * @swagger
   * /api/v1/search/suggest:
   *   get:
   *     tags: [Search]
   *     summary: Search suggestions
   */
  router.get('/search/suggest', validate(searchSuggestSchema, 'query'), async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { q, limit } = req.query as { q: string; limit: string };
      const limitNum = parseInt(limit) || 8;

      const [states, cities, places] = await Promise.all([
        prisma.state.findMany({
          where: { name: { contains: q, mode: 'insensitive' } },
          take: Math.min(3, limitNum),
          select: { name: true, slug: true },
        }),
        prisma.city.findMany({
          where: { name: { contains: q, mode: 'insensitive' } },
          take: Math.min(3, limitNum),
          select: { name: true, slug: true, state: { select: { name: true } } },
        }),
        prisma.place.findMany({
          where: {
            name: { contains: q, mode: 'insensitive' },
            status: 'VERIFIED',
            deletedAt: null,
          },
          take: limitNum,
          select: { name: true, slug: true, state: { select: { name: true } } },
        }),
      ]);

      const suggestions = [
        ...states.map((s) => ({ type: 'state' as const, name: s.name, slug: s.slug })),
        ...cities.map((c) => ({ type: 'city' as const, name: c.name, slug: c.slug, extra: c.state.name })),
        ...places.map((p) => ({ type: 'place' as const, name: p.name, slug: p.slug, extra: p.state.name })),
      ].slice(0, limitNum);

      sendSuccess(res, { data: suggestions });
    } catch (error) {
      next(error);
    }
  });

  // ===== STATS =====

  /**
   * @swagger
   * /api/v1/stats:
   *   get:
   *     tags: [States]
   *     summary: Public statistics
   */
  router.get('/stats', async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const [stateCount, cityCount, placeCount, unescoCount] = await Promise.all([
        prisma.state.count(),
        prisma.city.count(),
        prisma.place.count({ where: { status: 'VERIFIED', deletedAt: null } }),
        prisma.place.count({ where: { isUnesco: true, status: 'VERIFIED', deletedAt: null } }),
      ]);

      sendSuccess(res, {
        data: { stateCount, cityCount, placeCount, unescoCount },
      });
    } catch (error) {
      next(error);
    }
  });

  // ===== CONTACT =====

  /**
   * @swagger
   * /api/v1/contact:
   *   post:
   *     tags: [Contact]
   *     summary: Submit contact form
   */
  router.post('/contact', validate(contactSchema), async (req: Request, res: Response, next: NextFunction) => {
    try {
      const message = await prisma.contactMessage.create({
        data: req.body,
      });

      sendSuccess(res, { data: { id: message.id }, statusCode: 201 });
    } catch (error) {
      next(error);
    }
  });

  // ===== ANALYTICS =====

  /**
   * @swagger
   * /api/v1/analytics/event:
   *   post:
   *     tags: [Analytics]
   *     summary: Track analytics event
   */
  router.post('/analytics/event', validate(analyticsEventSchema), async (req: Request, res: Response, next: NextFunction) => {
    try {
      await prisma.analyticsEvent.create({
        data: req.body,
      });

      sendSuccess(res, { data: { tracked: true }, statusCode: 201 });
    } catch (error) {
      next(error);
    }
  });

  return router;
}
