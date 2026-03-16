import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRouter from "./routes/authRoutes.js";
import postRouter from "./routes/postRoutes.js";
import skillRouter from "./routes/skillRoutes.js"
import experienceRouter  from "./routes/experienceRoutes.js"
import aboutRouter from "./routes/aboutRoutes.js"
import portfolioRouter from "./routes/portfolioRoutes.js"
import educationRouter from "./routes/educationRoutes.js";
import { errorHandler } from "./middlewares/errorMiddleware.js";
import { swaggerOptions } from "./configs/swagger.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Swagger setup
const swaggerSpec = swaggerJSDoc(swaggerOptions);
console.log(
  "Swagger output:",
  swaggerSpec,
  JSON.stringify(swaggerSpec, null, 2),
); // Debugging line to check the generated Swagger specification
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, { explorer: true }),
);

app.use("/uploads", express.static("public/uploads"));

// Routes
app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
app.use("/api/portfolios", portfolioRouter);
app.use("/api/experiences", experienceRouter);
app.use("/api/about", aboutRouter);
app.use("/api/educations", educationRouter);
app.use("/api/skills", skillRouter)


// Error Handling
app.all(/.*/, (req, res, next) => {
  const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  err.statusCode = 404;
  next(err);
});

app.use(errorHandler);

export default app;
