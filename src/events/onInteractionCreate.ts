import type { BaseInteraction } from 'discord.js';
import { Events } from 'discord.js';
import type { Event } from '../client/interfaces';

const onInteractionCreate: Event = {
	type: Events.InteractionCreate,
	execute: async (client, interaction: BaseInteraction) => {
		if (interaction.isChatInputCommand()) {
			const command = client.commands.get(interaction.commandName);

			if (!command) {
				console.error(`A command with the name ${interaction.commandName} was executed but no handler was found.`);
				return;
			}

			try {
				await command.execute(client, interaction);
			} catch (error) {
				console.error(error);

				if (interaction.replied || interaction.deferred) {
					await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
				} else {
					await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
				}
			}
		}

		if (interaction.isButton()) {
			client.buttons.find((i) => i.validator(interaction))?.execute(client, interaction);
		} else if (interaction.isStringSelectMenu()) {
			client.selectMenus.find((i) => i.validator(interaction))?.execute(client, interaction);
		} else if (interaction.isModalSubmit()) {
			client.modals.find((i) => i.validator(interaction))?.execute(client, interaction);
		}
	},
};

export default onInteractionCreate;
