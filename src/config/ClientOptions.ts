import { GatewayIntentBits, Partials } from "discord.js"

export const IntentOptions: GatewayIntentBits[] = [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers
];

export const ClientPartials: Partials[] = [
	Partials.Message,
	Partials.Channel,
	Partials.Reaction
]