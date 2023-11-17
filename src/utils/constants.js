"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOwner = exports.CHANNEL_ALLOW_PERMISSIONS = exports.owners = void 0;
const discord_js_1 = require("discord.js");
exports.owners = ["679986828912492554"];
exports.CHANNEL_ALLOW_PERMISSIONS = [discord_js_1.PermissionsBitField.Flags.ViewChannel, discord_js_1.PermissionsBitField.Flags.ReadMessageHistory, discord_js_1.PermissionsBitField.Flags.SendMessages, discord_js_1.PermissionsBitField.Flags.UseExternalEmojis, discord_js_1.PermissionsBitField.Flags.AttachFiles, discord_js_1.PermissionsBitField.Flags.EmbedLinks];
function isOwner(id) {
    return exports.owners.some(owner => owner == id);
}
exports.isOwner = isOwner;
exports.default = {
    TICKET_TYPES: [
        ["support", "General Support 🔧", "1094816410682789908"],
        ["report", "Appeals and Reports ⚠️", "1094816491909685309"],
        ["buycraft", "Buycraft Support 💰", "1094816554639691857"]
    ],
};
