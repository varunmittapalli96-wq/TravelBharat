import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { prisma } from '../../../app';
import { sendSuccess, paginate, paginationArgs } from '../../../utils/response';
import { validate } from '../../../middleware/validate';
import { authenticate, requireRole } from '../../../middleware/auth';
import { ApiError } from '../../../middleware/errorHandler';
import {
  loginSchema,
  createStateSchema,
  updateStateSchema,
  createCitySchema,
  updateCitySchema,
  createPlaceSchema,
  updatePlaceSchema,
  updatePlaceStatusSchema,
  createImageSchema,
  reorderImagesSchema,
  paginationSchema,
} from '@travelbharat/shared';

export function createAdminRoutes() {
  const router = Router();

  // Login rate limiting
  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: parseInt(process.env.LOGIN_RATE_LIMIT_MAX || '5'),
    message: { success: false, error: { code: 'TOO_MANY_REQUESTS', message: 'Too many login attempts' } },
  });

  // ===== AUTH =====

  /**
   * @swagger
   * /api/v1/admin/auth/login:
   *   post:
   *     tags: [Admin Auth]
   *     summary: Admin login
   */
  router.post('/auth/login', loginLimiter, validate(loginSchema), async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      const user = await prisma.adminUser.findUnique({ where: { email } });
      if (!user) {
        throw ApiError.unauthorized('Invalid credentials');
      }

      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) {
        throw ApiError.unauthorized('Invalid credentials');
      }

      const secret = process.env.JWT_SECRET;
      if (!secret) throw new Error('JWT_SECRET not configured');

      const token = jwt.sign(
        { userId: user.id, role: user.role },
        secret as jwt.Secret,
        { expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as any }
      );

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/',
      });

      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: 'LOGIN',
          entity: 'AdminUser',
          entityId: user.id,
        },
      });

      sendSuccess(res, {
        data: { id: user.id, email: user.email, role: user.role },
      });
    } catch (error) {
      next(error);
    }
  });

  router.post('/auth/logout', (_req: Request, res: Response) => {
    res.clearCookie('token', { path: '/' });
    sendSuccess(res, { data: { loggedOut: true } });
  });

  router.get('/auth/me', authenticate, (req: Request, res: Response) => {
    sendSuccess(res, { data: req.user });
  });

  // ===== PROTECTED ROUTES (all below require auth) =====
  router.use(authenticate);

  // ===== DASHBOARD =====

  /**
   * @swagger
   * /api/v1/admin/dashboard:
   *   get:
   *     tags: [Admin CRUD]
   *     summary: Admin dashboard statistics
   *     security: [{ cookieAuth: [] }]
   */
  router.get('/dashboard', async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const [
        totalStates, totalCities, totalPlaces,
        verifiedPlaces, draftPlaces, inReviewPlaces,
        unescoPlaces, featuredPlaces, totalImages,
        placesWithoutImages, recentEdits,
      ] = await Promise.all([
        prisma.state.count(),
        prisma.city.count(),
        prisma.place.count({ where: { deletedAt: null } }),
        prisma.place.count({ where: { status: 'VERIFIED', deletedAt: null } }),
        prisma.place.count({ where: { status: 'DRAFT', deletedAt: null } }),
        prisma.place.count({ where: { status: 'IN_REVIEW', deletedAt: null } }),
        prisma.place.count({ where: { isUnesco: true, deletedAt: null } }),
        prisma.place.count({ where: { isFeatured: true, deletedAt: null } }),
        prisma.placeImage.count(),
        prisma.place.count({
          where: { deletedAt: null, images: { none: {} } },
        }),
        prisma.auditLog.findMany({
          take: 20,
          orderBy: { createdAt: 'desc' },
          include: { user: { select: { email: true } } },
        }),
      ]);

      sendSuccess(res, {
        data: {
          totalStates, totalCities, totalPlaces,
          verifiedPlaces, draftPlaces, inReviewPlaces,
          unescoPlaces, featuredPlaces, totalImages,
          placesWithoutImages, recentEdits,
        },
      });
    } catch (error) {
      next(error);
    }
  });

  // ===== ADMIN STATES CRUD =====

  router.get('/states', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const states = await prisma.state.findMany({
        orderBy: { name: 'asc' },
        include: {
          _count: { select: { cities: true, places: true } },
        },
      });
      sendSuccess(res, { data: states });
    } catch (error) {
      next(error);
    }
  });

  router.post('/states', requireRole('ADMIN', 'EDITOR'), validate(createStateSchema), async (req: Request, res: Response, next: NextFunction) => {
    try {
      const state = await prisma.state.create({ data: req.body });
      await prisma.auditLog.create({
        data: { userId: req.user!.id, action: 'CREATE', entity: 'State', entityId: state.id, diff: req.body },
      });
      sendSuccess(res, { data: state, statusCode: 201 });
    } catch (error) {
      next(error);
    }
  });

  router.put('/states/:id', requireRole('ADMIN', 'EDITOR'), validate(updateStateSchema), async (req: Request, res: Response, next: NextFunction) => {
    try {
      const state = await prisma.state.update({
        where: { id: req.params.id },
        data: req.body,
      });
      await prisma.auditLog.create({
        data: { userId: req.user!.id, action: 'UPDATE', entity: 'State', entityId: state.id, diff: req.body },
      });
      sendSuccess(res, { data: state });
    } catch (error) {
      next(error);
    }
  });

  router.delete('/states/:id', requireRole('ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
    try {
      await prisma.state.delete({ where: { id: req.params.id as string } });
      await prisma.auditLog.create({
        data: { userId: req.user!.id, action: 'DELETE', entity: 'State', entityId: req.params.id as string },
      });
      sendSuccess(res, { data: { deleted: true } });
    } catch (error) {
      next(error);
    }
  });

  // ===== ADMIN CITIES CRUD =====

  router.get('/cities', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cities = await prisma.city.findMany({
        orderBy: { name: 'asc' },
        include: {
          state: { select: { name: true, slug: true } },
          _count: { select: { places: true } },
        },
      });
      sendSuccess(res, { data: cities });
    } catch (error) {
      next(error);
    }
  });

  router.post('/cities', requireRole('ADMIN', 'EDITOR'), validate(createCitySchema), async (req: Request, res: Response, next: NextFunction) => {
    try {
      const city = await prisma.city.create({ data: req.body });
      await prisma.auditLog.create({
        data: { userId: req.user!.id, action: 'CREATE', entity: 'City', entityId: city.id, diff: req.body },
      });
      sendSuccess(res, { data: city, statusCode: 201 });
    } catch (error) {
      next(error);
    }
  });

  router.put('/cities/:id', requireRole('ADMIN', 'EDITOR'), validate(updateCitySchema), async (req: Request, res: Response, next: NextFunction) => {
    try {
      const city = await prisma.city.update({
        where: { id: req.params.id },
        data: req.body,
      });
      await prisma.auditLog.create({
        data: { userId: req.user!.id, action: 'UPDATE', entity: 'City', entityId: city.id, diff: req.body },
      });
      sendSuccess(res, { data: city });
    } catch (error) {
      next(error);
    }
  });

  router.delete('/cities/:id', requireRole('ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
    try {
      await prisma.city.delete({ where: { id: req.params.id as string } });
      await prisma.auditLog.create({
        data: { userId: req.user!.id, action: 'DELETE', entity: 'City', entityId: req.params.id as string },
      });
      sendSuccess(res, { data: { deleted: true } });
    } catch (error) {
      next(error);
    }
  });

  // ===== ADMIN PLACES CRUD =====

  router.get('/places', validate(paginationSchema, 'query'), async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, limit } = req.query as unknown as { page: number; limit: number };
      const { status, q } = req.query as Record<string, string>;

      const where: any = { deletedAt: null };
      if (status) where.status = status;
      if (q) {
        where.OR = [
          { name: { contains: q, mode: 'insensitive' } },
          { shortDescription: { contains: q, mode: 'insensitive' } },
        ];
      }

      const [total, places] = await Promise.all([
        prisma.place.count({ where }),
        prisma.place.findMany({
          where,
          orderBy: { updatedAt: 'desc' },
          ...paginationArgs(page, limit),
          include: {
            images: { where: { isCover: true }, take: 1 },
            state: { select: { name: true, slug: true } },
            city: { select: { name: true, slug: true } },
          },
        }),
      ]);

      sendSuccess(res, { data: places, meta: paginate(page, limit, total) });
    } catch (error) {
      next(error);
    }
  });

  router.post('/places', requireRole('ADMIN', 'EDITOR'), validate(createPlaceSchema), async (req: Request, res: Response, next: NextFunction) => {
    try {
      const place = await prisma.place.create({ data: req.body });
      await prisma.auditLog.create({
        data: { userId: req.user!.id, action: 'CREATE', entity: 'Place', entityId: place.id, diff: req.body },
      });
      sendSuccess(res, { data: place, statusCode: 201 });
    } catch (error) {
      next(error);
    }
  });

  router.put('/places/:id', requireRole('ADMIN', 'EDITOR'), validate(updatePlaceSchema), async (req: Request, res: Response, next: NextFunction) => {
    try {
      const place = await prisma.place.update({
        where: { id: req.params.id },
        data: req.body,
      });
      await prisma.auditLog.create({
        data: { userId: req.user!.id, action: 'UPDATE', entity: 'Place', entityId: place.id, diff: req.body },
      });
      sendSuccess(res, { data: place });
    } catch (error) {
      next(error);
    }
  });

  router.patch('/places/:id/status', requireRole('ADMIN', 'EDITOR'), validate(updatePlaceStatusSchema), async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { status } = req.body;

      // Only ADMIN can set VERIFIED
      if (status === 'VERIFIED' && req.user!.role !== 'ADMIN') {
        throw ApiError.forbidden('Only admins can verify places');
      }

      const updateData: any = { status };
      if (status === 'VERIFIED') {
        updateData.verifiedBy = req.user!.id;
        updateData.verifiedAt = new Date();
      }

      const place = await prisma.place.update({
        where: { id: req.params.id },
        data: updateData,
      });

      await prisma.auditLog.create({
        data: { userId: req.user!.id, action: 'STATUS_CHANGE', entity: 'Place', entityId: place.id, diff: { status } },
      });

      sendSuccess(res, { data: place });
    } catch (error) {
      next(error);
    }
  });

  router.delete('/places/:id', requireRole('ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Soft delete
      const place = await prisma.place.update({
        where: { id: req.params.id },
        data: { deletedAt: new Date() },
      });
      await prisma.auditLog.create({
        data: { userId: req.user!.id, action: 'SOFT_DELETE', entity: 'Place', entityId: place.id },
      });
      sendSuccess(res, { data: { deleted: true } });
    } catch (error) {
      next(error);
    }
  });

  // ===== IMAGE MANAGEMENT =====

  router.post('/places/:id/images', requireRole('ADMIN', 'EDITOR'), validate(createImageSchema), async (req: Request, res: Response, next: NextFunction) => {
    try {
      const image = await prisma.placeImage.create({
        data: { ...req.body, placeId: req.params.id as string },
      });
      await prisma.auditLog.create({
        data: { userId: req.user!.id, action: 'ADD_IMAGE', entity: 'Place', entityId: req.params.id as string, diff: { imageId: image.id } },
      });
      sendSuccess(res, { data: image, statusCode: 201 });
    } catch (error) {
      next(error);
    }
  });

  router.put('/places/:id/images/reorder', requireRole('ADMIN', 'EDITOR'), validate(reorderImagesSchema), async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { imageIds } = req.body;
      const updates = imageIds.map((id: string, index: number) =>
        prisma.placeImage.update({ where: { id }, data: { order: index } })
      );
      await prisma.$transaction(updates);
      sendSuccess(res, { data: { reordered: true } });
    } catch (error) {
      next(error);
    }
  });

  router.delete('/images/:id', requireRole('ADMIN', 'EDITOR'), async (req: Request, res: Response, next: NextFunction) => {
    try {
      await prisma.placeImage.delete({ where: { id: req.params.id as string } });
      await prisma.auditLog.create({
        data: { userId: req.user!.id, action: 'DELETE_IMAGE', entity: 'PlaceImage', entityId: req.params.id as string },
      });
      sendSuccess(res, { data: { deleted: true } });
    } catch (error) {
      next(error);
    }
  });

  // ===== AUDIT LOG =====

  router.get('/audit', validate(paginationSchema, 'query'), async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, limit } = req.query as unknown as { page: number; limit: number };
      const { entity, userId } = req.query as Record<string, string>;

      const where: any = {};
      if (entity) where.entity = entity;
      if (userId) where.userId = userId;

      const [total, logs] = await Promise.all([
        prisma.auditLog.count({ where }),
        prisma.auditLog.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          ...paginationArgs(page, limit),
          include: { user: { select: { email: true } } },
        }),
      ]);

      sendSuccess(res, { data: logs, meta: paginate(page, limit, total) });
    } catch (error) {
      next(error);
    }
  });

  // ===== IMPORT/EXPORT =====

  router.post('/import', requireRole('ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type, data } = req.body;
      const results = { created: 0, errors: [] as string[] };

      if (type === 'places' && Array.isArray(data)) {
        for (const item of data) {
          try {
            await prisma.place.create({ data: item });
            results.created++;
          } catch (err: any) {
            results.errors.push(`Failed to import ${item.name || 'unknown'}: ${err.message}`);
          }
        }
      }

      await prisma.auditLog.create({
        data: { userId: req.user!.id, action: 'BULK_IMPORT', entity: type || 'unknown', entityId: 'bulk', diff: { count: results.created } },
      });

      sendSuccess(res, { data: results });
    } catch (error) {
      next(error);
    }
  });

  router.get('/export', requireRole('ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.query;

      let data;
      if (type === 'states') {
        data = await prisma.state.findMany({ include: { cities: true } });
      } else if (type === 'cities') {
        data = await prisma.city.findMany({ include: { state: { select: { name: true } } } });
      } else {
        data = await prisma.place.findMany({
          where: { deletedAt: null },
          include: { images: true, state: { select: { name: true } }, city: { select: { name: true } } },
        });
      }

      sendSuccess(res, { data });
    } catch (error) {
      next(error);
    }
  });

  return router;
}
