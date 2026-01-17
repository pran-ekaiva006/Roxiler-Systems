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
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/stores", storesRoutes);
app.use("/api/ratings", ratingsRoutes);
app.use("/api/users", usersRoutes);

app.get("/", (req, res) => {
  res.send("API running");
});

// Error handling middleware (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
