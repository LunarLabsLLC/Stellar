"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEnv = void 0;
const validateEnv = () => {
    if (!process.env.BOT_TOKEN) {
        console.warn("Missing `BOT_TOKEN` in .env");
        return false;
    }
    if (!process.env.MONGO_URI) {
        console.warn("Missing `MONGO_URI` in .env");
        return false;
    }
    return true;
};
exports.validateEnv = validateEnv;
