import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'akaBizZaloApi Documentation',
      version: '1.0.0',
      description: 'API documentation for akaBizZaloApi',
    },
  },
  apis: ['./routes/*.js', './controllers/*.js'], // adjust path as needed
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi, swaggerSpec };
