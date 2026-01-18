import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import storesRoutes from "./routes/storesRoutes.js";
import ratingsRoutes from "./routes/ratingsRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();

// ✅ FIXED CORS
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://roxiler-systems-nine.vercel.app",
    "https://roxiler-systems-yix797udg-pranjals-projects-fb70e5de.vercel.app",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // handle preflight

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/stores", storesRoutes);
app.use("/api/ratings", ratingsRoutes);
app.use("/api/users", usersRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API running successfully" });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
