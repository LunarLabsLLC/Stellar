"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ClientOptions_1 = require("./config/ClientOptions");
const StellarClient_1 = __importDefault(require("./client/StellarClient"));
const interfaces_1 = require("./client/interfaces");
const path_1 = __importDefault(require("path"));
console.log("Starting the discord bot...");
const client = new StellarClient_1.default({
    intents: ClientOptions_1.IntentOptions,
    partials: ClientOptions_1.ClientPartials,
    allowedMentions: { parse: ["users"], repliedUser: true },
    presence: {
        status: "dnd"
    }
});
client.registerCommands();
client.registerEvents();
(0, interfaces_1.registerInteractions)(client, path_1.default.join(__dirname, "interactions"));
client.login(process.env.BOT_TOKEN);
