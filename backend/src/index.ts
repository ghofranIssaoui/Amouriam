// index.js — Backend server (CORS FIXED + PRODUCTION READY)

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

// Load env variables
dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// ✅ FRONTEND URL (Vercel)
const ALLOWED_ORIGIN = "https://amouriam.vercel.app";

// App & server
const app = express();
const httpServer = createServer(app);

// =======================
// ✅ CORS (Express)
// =======================
app.use(
  cors({
    origin: ALLOWED_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =======================
// ✅ Socket.IO
// =======================
const io = new Server(httpServer, {
  cors: {
    origin: ALLOWED_ORIGIN,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Make io accessible in routes
app.set("io", io);

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("joinUserRoom", (userId) => {
    socket.join(`user_${userId}`);
    console.log(`User ${userId} joined room`);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

// =======================
// ✅ MongoDB Connection
// =======================
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB error:", err);
    process.exit(1);
  });

// =======================
// ✅ Routes
// =======================
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/messages", messageRoutes);

// =======================
// ✅ Test Routes
// =======================
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Amourium API" });
});

app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is working!" });
});

// =======================
// ✅ Error Handler
// =======================
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong" });
});

// =======================
// ✅ Start Server
// =======================
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`✅ CORS allowed for ${ALLOWED_ORIGIN}`);
});

export default app;
