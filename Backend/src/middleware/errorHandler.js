import { z } from "zod";

export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err.message);

  if (err instanceof z.ZodError) {
    return res.status(400).json({
      error: "Validation error",
      details: err.errors.map((e) => ({
        path: e.path.join("."),
        message: e.message,
      })),
    });
  }

  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
  });
};
