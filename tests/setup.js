"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const path_1 = __importDefault(require("path"));
const url_1 = require("url");
const fs_1 = __importDefault(require("fs"));
const __dirname = path_1.default.dirname((0, url_1.fileURLToPath)(import.meta.url));
const testDbPath = path_1.default.join(__dirname, '../src/server/test.db');
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = `file:${testDbPath}`;
(0, vitest_1.beforeAll)(() => {
    if (fs_1.default.existsSync(testDbPath))
        fs_1.default.unlinkSync(testDbPath);
});
(0, vitest_1.afterAll)(() => {
    if (fs_1.default.existsSync(testDbPath))
        fs_1.default.unlinkSync(testDbPath);
});
