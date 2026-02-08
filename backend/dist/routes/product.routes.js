"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("../controllers/product.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Public routes
router.get('/', product_controller_1.getProducts);
router.get('/:id', product_controller_1.getProductById);
// Admin routes
router.post('/', auth_middleware_1.auth, product_controller_1.createProduct);
router.post('/seed', product_controller_1.seedProducts);
exports.default = router;
