"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientPartials = exports.IntentOptions = void 0;
const discord_js_1 = require("discord.js");
exports.IntentOptions = [
    discord_js_1.GatewayIntentBits.Guilds,
    discord_js_1.GatewayIntentBits.GuildMessages,
    discord_js_1.GatewayIntentBits.MessageContent,
    discord_js_1.GatewayIntentBits.GuildMembers
];
exports.ClientPartials = [
    discord_js_1.Partials.Message,
    discord_js_1.Partials.Channel,
    discord_js_1.Partials.Reaction
];
