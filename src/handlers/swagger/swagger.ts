import { Express, NextFunction, Request, Response } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { getPublicApiBaseUrl } from "../../config/public-api.js";

const tsHandlerPath = "./src/handlers"
const jsHandlerPath = "./dist/handlers"

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "REST API Docs",
      version: "1.0.0",
    },
    servers: [
      {
        url: getPublicApiBaseUrl(),
        description: "API",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    tsHandlerPath + "/routes.ts",
    tsHandlerPath + "/validators/*.ts",
    tsHandlerPath + "/requests/*.ts",
    tsHandlerPath + "/responses/*.ts",
    jsHandlerPath + "/routes.js",
    jsHandlerPath + "/validators/*.js",
    jsHandlerPath + "/requests/*.js",
    jsHandlerPath + "/responses/*.js",
  ],
};

const swaggerSpec = swaggerJsdoc(options);

function baseUrlFromRequest(req: Request): string {
  const xfProto = req.headers["x-forwarded-proto"];
  const proto =
    (typeof xfProto === "string"
      ? xfProto.split(",")[0]?.trim()
      : Array.isArray(xfProto)
        ? xfProto[0]
        : undefined) || req.protocol;
  const xfHost = req.headers["x-forwarded-host"];
  const host =
    (typeof xfHost === "string"
      ? xfHost.split(",")[0]?.trim()
      : Array.isArray(xfHost)
        ? xfHost[0]
        : undefined) ||
    req.get("host") ||
    "localhost";
  return `${proto}://${host}`;
}

export function swaggerDocs(app: Express, _port: number | string) {
  app.use(
    "/docs",
    swaggerUi.serve,
    (req: Request, res: Response, next: NextFunction) => {
      const spec = {
        ...swaggerSpec,
        servers: [{ url: baseUrlFromRequest(req), description: "API" }],
      };
      swaggerUi.setup(spec)(req, res, next);
    },
  );
  app.get("/docs.json", (req: Request, res: Response) => {
    const spec = {
      ...swaggerSpec,
      servers: [{ url: baseUrlFromRequest(req), description: "API" }],
    };
    res.setHeader("Content-Type", "application/json");
    res.send(spec);
  });

  console.log(`Docs available at ${getPublicApiBaseUrl()}/docs`);
}
