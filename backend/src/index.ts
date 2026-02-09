import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { createServer } from "http";
import { Server } from "socket.io";

import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/product.routes.js";
import orderRoutes from "./routes/order.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import messageRoutes from "./routes/message.routes.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "https://amouriam-abcu.vercel.app",

];

const app = express();
const httpServer = createServer(app);

// ======= CORS =======
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // server-to-server
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("CORS blocked"));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ======= Socket.IO =======
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins, // Simplified - accepts array directly
    credentials: true,
  },
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);
});

// ======= MongoDB =======
const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.error("❌ MONGODB_URI environment variable is not defined");
  process.exit(1);
}

mongoose
  .connect(mongoUri)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB error:", err);
    process.exit(1);
  });

// ======= Routes =======
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/messages", messageRoutes);

// ======= Test =======
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is working!" });
});

// ======= Start Server =======
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
