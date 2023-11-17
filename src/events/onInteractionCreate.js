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
const onInteractionCreate = {
    type: discord_js_1.Events.InteractionCreate,
    execute: (client, interaction) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) {
                console.error(`A command with the name ${interaction.commandName} was executed but no handler was found.`);
                return;
            }
            try {
                yield command.execute(client, interaction);
            }
            catch (error) {
                console.error(error);
                if (interaction.replied || interaction.deferred) {
                    yield interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
                }
                else {
                    yield interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
                }
            }
        }
        if (interaction.isButton()) {
            (_a = client.buttons.find((i) => i.validator(interaction))) === null || _a === void 0 ? void 0 : _a.execute(client, interaction);
        }
        else if (interaction.isStringSelectMenu()) {
            (_b = client.selectMenus.find((i) => i.validator(interaction))) === null || _b === void 0 ? void 0 : _b.execute(client, interaction);
        }
        else if (interaction.isModalSubmit()) {
            (_c = client.modals.find((i) => i.validator(interaction))) === null || _c === void 0 ? void 0 : _c.execute(client, interaction);
        }
    })
};
exports.default = onInteractionCreate;
