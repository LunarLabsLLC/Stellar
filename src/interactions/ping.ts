// Ping command
import CommandManager from "../managers/CommandManager";
import type { ApplicationCommandBuilder } from "@oceanicjs/builders";
import {
    ApplicationCommandOptionTypes,
    ApplicationCommandTypes,
    type Client,
    type CommandInteraction,
    Permissions
} from "oceanic.js";

export default class PingCommand extends CommandManager {
    override defaultMemberPermissions = Permissions.SEND_MESSAGES;
    override description = "Ping command to check if the bot is responsive";
    override name = "ping";
    override type = ApplicationCommandTypes.CHAT_INPUT;
    override async run(this: Client, interaction: CommandInteraction) {
        return interaction.createMessage({ content: "Pong!" });
    }

    override setOptions(command: ApplicationCommandBuilder) {
        // Ping command has no options
    }
}