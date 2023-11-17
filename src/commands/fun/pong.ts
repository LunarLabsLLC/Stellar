import { SlashCommandBuilder } from "discord.js";
import ICommand from "../../client/interfaces";

const PingCommand: ICommand = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with pong!"),
    
    async execute(client, interaction) {
        await interaction.reply("Pong!")
    }
}

module.exports = PingCommand