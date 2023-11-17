import path from 'node:path';
import StellarClient from './client/StellarClient';
import { registerInteractions } from './client/interfaces';
import { ClientPartials, IntentOptions } from './config/ClientOptions';

console.log('Starting the discord bot...');

const client = new StellarClient({
	intents: IntentOptions,
	partials: ClientPartials,
	allowedMentions: { parse: ['users'], repliedUser: true },
	presence: {
		status: 'dnd',
	},
});

client.registerCommands();
client.registerEvents();
registerInteractions(client, path.join(__dirname, 'interactions'));

client.login(process.env.BOT_TOKEN);
