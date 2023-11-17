"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const SendCommand = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("send")
        .setDescription("Send a message to a channel as the bot.")
        .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.Administrator)
        .addChannelOption((option) => option.setName("channel").setDescription("The channel to send the message in.").setRequired(true))
        .addStringOption((option) => option.setName("content").setDescription("The content you want to send.").setRequired(true)),
    execute: (client, interaction) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        let channel = (_a = interaction.options.get("channel")) === null || _a === void 0 ? void 0 : _a.channel;
        let content = (_b = interaction.options.get("content")) === null || _b === void 0 ? void 0 : _b.value;
        client.send(channel === null || channel === void 0 ? void 0 : channel.id, {
            content: content === null || content === void 0 ? void 0 : content.toString()
        });
        yield interaction.reply({
            content: "Sent your message to that channel",
            ephemeral: true
        });
    })
};
module.exports = SendCommand;
