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
const PingCommand = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with pong!"),
    execute(client, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const embed = new discord_js_1.EmbedBuilder()
                .setTitle("Ping")
                .setDescription("Pong!")
                .addFields([
                { name: "Heartbeat", value: `${client.ws.ping}ms`, inline: true },
                { name: "Latency", value: `${Date.now() - interaction.createdTimestamp}ms`, inline: true }
            ])
                .setColor("#00ff00");
            yield interaction.reply({ embeds: [embed] });
        });
    }
};
module.exports = PingCommand;
