"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const supertest_1 = __importDefault(require("supertest"));
const app_js_1 = require("../../src/server/src/app.js");
const userRepo = __importStar(require("../../src/server/src/repositories/userRepository.js"));
const ticketRepo = __importStar(require("../../src/server/src/repositories/ticketRepository.js"));
const db_js_1 = require("../../src/server/src/lib/db.js");
const app = (0, app_js_1.createApp)();
let userId;
let ticketId;
(0, vitest_1.beforeEach)(() => {
    (0, db_js_1.getDb)();
    userRepo.deleteAllUsers();
    const user = userRepo.createUser({
        name: 'Test User',
        email: `test-${Date.now()}@test.local`,
        role: 'AGENT',
    });
    userId = user.id;
    const ticket = ticketRepo.createTicket({
        title: 'Test ticket',
        description: 'Test description',
        priority: 'MEDIUM',
        createdById: userId,
    });
    ticketId = ticket.id;
});
(0, vitest_1.afterEach)(() => {
    userRepo.deleteAllUsers();
});
(0, vitest_1.describe)('State Machine Integration Tests', () => {
    (0, vitest_1.it)('OPEN -> IN_PROGRESS succeeds', async () => {
        const res = await (0, supertest_1.default)(app)
            .patch(`/api/tickets/${ticketId}/status`)
            .send({ status: 'IN_PROGRESS' });
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(res.body.status).toBe('IN_PROGRESS');
    });
    (0, vitest_1.it)('IN_PROGRESS -> RESOLVED succeeds', async () => {
        ticketRepo.updateTicketStatus(ticketId, 'IN_PROGRESS');
        const res = await (0, supertest_1.default)(app)
            .patch(`/api/tickets/${ticketId}/status`)
            .send({ status: 'RESOLVED' });
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(res.body.status).toBe('RESOLVED');
    });
    (0, vitest_1.it)('RESOLVED -> CLOSED succeeds', async () => {
        ticketRepo.updateTicketStatus(ticketId, 'RESOLVED');
        const res = await (0, supertest_1.default)(app)
            .patch(`/api/tickets/${ticketId}/status`)
            .send({ status: 'CLOSED' });
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(res.body.status).toBe('CLOSED');
    });
    (0, vitest_1.it)('OPEN -> CANCELLED succeeds', async () => {
        const res = await (0, supertest_1.default)(app)
            .patch(`/api/tickets/${ticketId}/status`)
            .send({ status: 'CANCELLED' });
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(res.body.status).toBe('CANCELLED');
    });
    (0, vitest_1.it)('IN_PROGRESS -> CANCELLED succeeds', async () => {
        ticketRepo.updateTicketStatus(ticketId, 'IN_PROGRESS');
        const res = await (0, supertest_1.default)(app)
            .patch(`/api/tickets/${ticketId}/status`)
            .send({ status: 'CANCELLED' });
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(res.body.status).toBe('CANCELLED');
    });
    (0, vitest_1.it)('OPEN -> CLOSED is rejected', async () => {
        const res = await (0, supertest_1.default)(app)
            .patch(`/api/tickets/${ticketId}/status`)
            .send({ status: 'CLOSED' });
        (0, vitest_1.expect)(res.status).toBe(409);
        (0, vitest_1.expect)(res.body.error).toContain('Invalid status transition');
    });
    (0, vitest_1.it)('OPEN -> RESOLVED is rejected', async () => {
        const res = await (0, supertest_1.default)(app)
            .patch(`/api/tickets/${ticketId}/status`)
            .send({ status: 'RESOLVED' });
        (0, vitest_1.expect)(res.status).toBe(409);
        (0, vitest_1.expect)(res.body.error).toContain('Invalid status transition');
    });
    (0, vitest_1.it)('RESOLVED -> IN_PROGRESS is rejected', async () => {
        ticketRepo.updateTicketStatus(ticketId, 'RESOLVED');
        const res = await (0, supertest_1.default)(app)
            .patch(`/api/tickets/${ticketId}/status`)
            .send({ status: 'IN_PROGRESS' });
        (0, vitest_1.expect)(res.status).toBe(409);
        (0, vitest_1.expect)(res.body.error).toContain('Invalid status transition');
    });
    (0, vitest_1.it)('CLOSED -> IN_PROGRESS is rejected', async () => {
        ticketRepo.updateTicketStatus(ticketId, 'RESOLVED');
        ticketRepo.updateTicketStatus(ticketId, 'CLOSED');
        const res = await (0, supertest_1.default)(app)
            .patch(`/api/tickets/${ticketId}/status`)
            .send({ status: 'IN_PROGRESS' });
        (0, vitest_1.expect)(res.status).toBe(409);
        (0, vitest_1.expect)(res.body.error).toContain('Invalid status transition');
    });
    (0, vitest_1.it)('CANCELLED -> OPEN is rejected', async () => {
        ticketRepo.updateTicketStatus(ticketId, 'CANCELLED');
        const res = await (0, supertest_1.default)(app)
            .patch(`/api/tickets/${ticketId}/status`)
            .send({ status: 'OPEN' });
        (0, vitest_1.expect)(res.status).toBe(409);
        (0, vitest_1.expect)(res.body.error).toContain('Invalid status transition');
    });
});
(0, vitest_1.describe)('Validation and Error Handling', () => {
    (0, vitest_1.it)('create ticket with missing title returns 400', async () => {
        const res = await (0, supertest_1.default)(app)
            .post('/api/tickets')
            .send({ description: 'No title', priority: 'LOW', createdById: userId });
        (0, vitest_1.expect)(res.status).toBe(400);
        (0, vitest_1.expect)(res.body.error).toBe('Validation failed');
    });
    (0, vitest_1.it)('comment on non-existent ticket returns 404', async () => {
        const res = await (0, supertest_1.default)(app)
            .post('/api/tickets/nonexistent-id/comments')
            .send({ message: 'Hello', createdById: userId });
        (0, vitest_1.expect)(res.status).toBe(404);
        (0, vitest_1.expect)(res.body.error).toBe('Ticket not found');
    });
});
