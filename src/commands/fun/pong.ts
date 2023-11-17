import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import ICommand from "../../client/interfaces";

const PingCommand: ICommand = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with pong!"),
    
    async execute(client, interaction) {
        const embed = new EmbedBuilder()
            .setTitle("Ping")
            .setDescription("Pong!")
            .addFields([
                { name: "Heartbeat", value: `${client.ws.ping}ms`, inline: true },
                { name: "Latency", value: `${Date.now() - interaction.createdTimestamp}ms`, inline: true }
            ])
            .setColor("#00ff00");

        await interaction.reply({ embeds: [embed] });
    }
}

module.exports = PingCommand;