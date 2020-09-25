import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

const initSwagger = () => {
  try {
    const router = express.Router();
    const swaggerSpec = swaggerJSDoc({
      swaggerDefinition: {
        openapi: '3.0.0',
        servers: [{ url: 'localhost:3001/api' }],
        security: [{ BearerAuth: [] }],
        info: {
          title: 'abc',
          version: '1.0'
        }
      },
      apis: ['docs/*.yml']
    });
    return router.use(swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  } catch (error) {
    console.log(error);
  }
};

class Swagger {
  public path = '/docs';
  public router = initSwagger();
}
export default Swagger;
