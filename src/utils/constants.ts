import { Collection, PermissionFlagsBits, PermissionsBitField } from "discord.js"

export const owners = ["679986828912492554"]

export const CHANNEL_ALLOW_PERMISSIONS = [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ReadMessageHistory, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.UseExternalEmojis, PermissionsBitField.Flags.AttachFiles, PermissionsBitField.Flags.EmbedLinks]

export function isOwner(id: string)  {
    return owners.some(owner => owner == id)
}

export default {
    TICKET_TYPES: [
        ["support", "General Support 🔧", "1094816410682789908"],
        ["report", "Appeals and Reports ⚠️", "1094816491909685309"],
        ["buycraft", "Buycraft Support 💰", "1094816554639691857"]
    ],
}