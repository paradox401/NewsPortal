import express from "express";
import cors from "cors";
import morgan from "morgan";
import "./config/env.js";
import errorHandler from "./middleware/error.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import reporterRoutes from "./routes/reporter.routes.js";
import editorRoutes from "./routes/editor.routes.js";
import postHistoryRoutes from "./routes/postHistory.routes.js"
import categoryRoutes from "./routes/category.routes.js";
import newsRoutes from "./routes/news.routes.js";
import adminRoutes from "./routes/admin.routes.js";


const app = express();

// ===== CORS =====
const allowedOrigins = new Set([
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:4173",
  "http://localhost:4174",
]);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.has(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));


// ===== Middleware =====
app.use(express.json());
app.use(morgan("dev"));

// ===== Routes =====
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reporter", reporterRoutes);
app.use("/api/editor", editorRoutes);
app.use("/reporter/posts", postHistoryRoutes);
app.use("/editor/posts", postHistoryRoutes);
app.use("/api/public/categories", categoryRoutes);
app.use("/api/public/posts", newsRoutes);
app.use("/api/admin", adminRoutes);

app.get("/test", (req, res) => {
  res.json({ message: "CORS is working!" });
});

// ===== Error handler =====
app.use(errorHandler);

export default app;
