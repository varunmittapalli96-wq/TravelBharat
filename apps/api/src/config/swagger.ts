import { Express } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TravelBharat API',
      version: '1.0.0',
      description: 'REST API for TravelBharat – Explore India State by State',
      contact: {
        name: 'TravelBharat',
        url: 'https://travelbharat.in',
      },
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:4000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'token',
        },
      },
    },
    tags: [
      { name: 'States', description: 'State and Union Territory endpoints' },
      { name: 'Cities', description: 'City endpoints' },
      { name: 'Places', description: 'Tourist place endpoints' },
      { name: 'Search', description: 'Search and suggestions' },
      { name: 'Contact', description: 'Contact form' },
      { name: 'Analytics', description: 'Analytics events' },
      { name: 'Admin Auth', description: 'Admin authentication' },
      { name: 'Admin CRUD', description: 'Admin data management' },
    ],
  },
  apis: ['./src/routes/**/*.ts'],
};

export function setupSwagger(app: Express) {
  const specs = swaggerJsdoc(options);
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'TravelBharat API Docs',
  }));
}
