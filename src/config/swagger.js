const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Sistema de Votaciones',
      version: '1.0.0',
      description:
        'API RESTful para gestionar votantes, candidatos, votos y estadísticas. ' +
        'Node.js + Express + PostgreSQL.',
    },
    servers: [{ url: '/', description: 'Servidor local' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

module.exports = swaggerJsdoc(options);
