import { ApplicationCommandTypes } from "oceanic.js"
import CommandManager from "../managers/CommandManager"
import { ApplicationCommandBuilder } from "@oceanicjs/builders"

const Suggest: CommandManager = {
    data: new ApplicationCommandBuilder(ApplicationCommandTypes.CHAT_INPUT, "suggest")
        .setDescription("Suggest a new idea to the staff team."),

    execute: async(client, interaction) => {
    }
}