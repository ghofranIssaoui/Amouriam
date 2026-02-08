"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/routes/cart.routes.ts
const express_1 = require("express");
const cart_controller_1 = require("../controllers/cart.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// All cart routes require authentication
router.get('/', auth_middleware_1.auth, cart_controller_1.getOrCreateCart);
router.post('/add', auth_middleware_1.auth, cart_controller_1.addToCart);
router.put('/update', auth_middleware_1.auth, cart_controller_1.updateCartItem);
router.delete('/remove/:productId', auth_middleware_1.auth, cart_controller_1.removeFromCart);
router.delete('/clear', auth_middleware_1.auth, cart_controller_1.clearCart);
exports.default = router;
