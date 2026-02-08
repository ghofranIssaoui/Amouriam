"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const message_controller_1 = require("../controllers/message.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Debug logging
router.use((req, res, next) => {
    console.log('Message routes - Request URL:', req.originalUrl);
    console.log('Message routes - Method:', req.method);
    next();
});
// Public route - submit message
router.post('/submit', message_controller_1.submitMessage);
// Protected routes (admin only)
router.get('/all', auth_middleware_1.auth, message_controller_1.getAllMessages);
router.put('/:messageId/status', auth_middleware_1.auth, message_controller_1.updateMessageStatus);
exports.default = router;
