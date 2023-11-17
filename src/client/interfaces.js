"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerInteractions = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const registerInteractions = (client, interactionDirectory) => {
    const files = fs_1.default.readdirSync(interactionDirectory);
    for (const file of files) {
        const fileName = file.toLowerCase();
        const stats = fs_1.default.statSync(path_1.default.join(interactionDirectory, file));
        if (!stats.isDirectory())
            continue;
        const interactionFiles = fs_1.default.readdirSync(path_1.default.join(interactionDirectory, file));
        for (const interactionFile of interactionFiles) {
            const interactionFileStats = fs_1.default.statSync(path_1.default.join(interactionDirectory, file, interactionFile));
            if (!interactionFileStats.isFile() || !interactionFile.endsWith(".js"))
                continue;
            const interaction = require(path_1.default.join(interactionDirectory, file, interactionFile)).default;
            switch (fileName) {
                case "buttons":
                    client.buttons.push(interaction);
                    break;
                case "selectmenus":
                    client.selectMenus.push(interaction);
                    break;
                case "modals":
                    client.modals.push(interaction);
                    break;
            }
        }
    }
};
exports.registerInteractions = registerInteractions;
