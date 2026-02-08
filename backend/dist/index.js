"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/index.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const auth_1 = __importDefault(require("./routes/auth"));
const product_routes_1 = __importDefault(require("./routes/product.routes"));
const order_routes_1 = __importDefault(require("./routes/order.routes"));
const cart_routes_1 = __importDefault(require("./routes/cart.routes"));
const message_routes_1 = __importDefault(require("./routes/message.routes"));
// Load environment variables
dotenv_1.default.config();
// Create Express application
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/amourium';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
// Middleware
app.use((0, cors_1.default)({
    origin: CLIENT_URL,
    credentials: true
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Connect to MongoDB with retry logic
const connectWithRetry = () => {
    mongoose_1.default.connect(MONGODB_URI)
        .then(() => console.log('Successfully connected to MongoDB'))
        .catch(err => {
        console.error('MongoDB connection error:', err);
        console.log('Retrying connection in 5 seconds...');
        setTimeout(connectWithRetry, 5000);
    });
};
connectWithRetry();
// Routes
app.use('/api/auth', auth_1.default);
app.use('/api/products', product_routes_1.default);
app.use('/api/orders', order_routes_1.default);
app.use('/api/cart', cart_routes_1.default);
app.use('/api/messages', message_routes_1.default);
// Basic route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Amourium API' });
});
// Test route
app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend is working!' });
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});
// Start the server
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`CORS-enabled for ${CLIENT_URL}`);
});
// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    server.close(() => process.exit(1));
});
exports.default = app;
