import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
const initSwagger = () => {
  try {
    const router = express.Router();
    const swaggerSpec = swaggerJSDoc({
      swaggerDefinition: {
        openapi: '3.0.0',
        servers: [
          {
            url:
              process.env.NODE_ENV === 'production'
                ? process.env.PRODUCTION_URL
                : `http://localhost:${process.env.PORT}`
          }
        ],
        security: [{ BearerAuth: [] }],
        info: {
          title: 'Kahoot api docs',
          version: '1.0'
        }
      },
      apis: ['src/docs/*.yml']
    });
    return router.use(swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  } catch (error) {
    console.log(error);
  }
};
class Swagger {
  public router = express.Router().use('/api-docs', initSwagger());
}
export default Swagger;
