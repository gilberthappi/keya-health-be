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
          url: 'https://keya-health-backend.onrender.com/api/v1',
        },
        {
          url: 'http://localhost:100/api/v1',
        },

      ],
      
    },
    apis: ['./src/routes/*.js'],
  };
  