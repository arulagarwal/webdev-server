import mongoose from "mongoose";
export default function Lab6(app) {
  app.get("/api/lab6/status", (req, res) => {
    const connected = mongoose.connection.readyState === 1;
    res.json({
      mongo: connected,
      database: connected ? mongoose.connection.name : "not connected",
      note: process.env.DATABASE_CONNECTION_STRING
        ? "DATABASE_CONNECTION_STRING is set."
        : "DATABASE_CONNECTION_STRING is not set; using the local fallback.",
    });
  });
}
