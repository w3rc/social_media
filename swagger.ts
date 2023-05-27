const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: 'Social Media API',
    version: '0.0.1',
    description: 'Social Media API',
  },
  components: {
    securitySchemas: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  },
  security: [{
    bearerAuth: [],
    default: true
  }],
  servers: [{
    url: '/api/v1'
  }],
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes.ts', './src/user/dto/*.input.ts', './src/post/dto/*.input.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
