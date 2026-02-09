// index.js — FINAL DEBUG VERSION (OPEN CORS)

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { createServer } from "http";
import { Server } from "socket.io";

// Routes
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/product.routes.js";
import orderRoutes from "./routes/order.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import messageRoutes from "./routes/message.routes.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// =======================
// App & Server
// =======================
const app = express();
const httpServer = createServer(app);

// =======================
// 🔥 OPEN CORS (TEMP FIX)
// =======================
app.use(cors()); // <-- IMPORTANT
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =======================
// Socket.IO (NO CORS HERE)
// =======================
const io = new Server(httpServer);
app.set("io", io);

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("joinUserRoom", (userId) => {
    socket.join(`user_${userId}`);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

// =======================
// MongoDB
// =======================
if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI is not defined in environment variables");
  process.exit(1);
}

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB error:", err);
    process.exit(1);
  });

// =======================
// Routes
// =======================
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/messages", messageRoutes);

// =======================
// Test Routes
// =======================
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Amourium API" });
});

app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is working!" });
});

// =======================
// Error Handler
// =======================
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Server error" });
});

// =======================
// Start Server
// =======================
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app;
