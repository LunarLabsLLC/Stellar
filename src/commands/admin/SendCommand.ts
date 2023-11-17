import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import ICommand from "../../client/interfaces";

const SendCommand: ICommand = {
    data: new SlashCommandBuilder()
        .setName("send")
        .setDescription("Send a message to a channel as the bot.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelOption((option) => option.setName("channel").setDescription("The channel to send the message in.").setRequired(true))
        .addStringOption((option) => option.setName("content").setDescription("The content you want to send.").setRequired(true)),
    
    execute: async(client, interaction) => {
        let channel = interaction.options.get("channel")?.channel
        let content = interaction.options.get("content")?.value

        client.send(channel?.id as string, {
            content: content?.toString()
        })

        await interaction.reply({
            content: "Sent your message to that channel",
            ephemeral: true
        })
    }
}

module.exports = SendCommand