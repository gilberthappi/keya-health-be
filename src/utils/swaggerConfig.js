// swaggerConfig.js
export const swaggerOptions = {
    swaggerDefinition: {
      openapi: '3.0.0',
      info: {
        title: 'Keya Health API',
        version: '1.0.0',
        description: 'Keya Health  API Documentation',
      },
      servers: [
        {
          url: 'http://localhost:3001/api/v1',
        },

      ],
      
    },
    apis: ['./src/routes/*.js'],
  };
  