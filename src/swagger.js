import { dirname, join } from "path";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { fileURLToPath } from "url";

// Fix path issue
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Tubelite Video Platform API",
      version: "1.0.0",
      description:
        "A clean and modern RESTful API powering the Tubelite video streaming platform.",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },

  apis: [join(__dirname, "swagger/**/*.js")],
};

const specs = swaggerJsdoc(options);

export { specs, swaggerUi };
