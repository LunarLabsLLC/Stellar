import { CommandInteraction, ClientEvents, Message, Collection, ModalSubmitInteraction, GuildComponentSelectMenuInteraction, GuildComponentButtonInteraction } from "oceanic.js";
import { ApplicationCommandBuilder } from "@oceanicjs/builders"
import { StellarClient } from "../helpers/StellarClient";
import fs from "fs";
import path from "path";
export default interface CommandManager {
    data: ApplicationCommandBuilder;
    execute: (client: StellarClient, interaction: CommandInteraction) => Promise<void>;
}

// Events
export type EventExecuteCallback = (client: StellarClient, ...args: any[]) => void

export interface Event {
    type: ClientEvents;
    execute: EventExecuteCallback;
}  

// Prompts
export type PromptCallback = (answers: Collection<string, Message>) => void

export interface PromptQuestion {
    question: string;
    id: string;
    validation?: {
        validator: (answer: Message) => boolean
        errorMessage: string
    }
}

interface RegisteredInteraction<T> {
    execute: (client: StellarClient, interaction: T) => void;
    validator: (interaction: T) => boolean;
  }

export type RegisteredModalSubmitInteraction = RegisteredInteraction<ModalSubmitInteraction>;
export type RegisteredSelectMenuInteraction = RegisteredInteraction<GuildComponentSelectMenuInteraction>;
export type RegisteredButtonInteraction = RegisteredInteraction<GuildComponentButtonInteraction>;

export type PossibleInteraction = RegisteredModalSubmitInteraction | RegisteredSelectMenuInteraction | RegisteredButtonInteraction;

export const registerInteractions = (client: StellarClient, interactionDirectory: string) => {
    const files = fs.readdirSync(interactionDirectory);

    for (const file of files) {
        const fileName = file.toLowerCase();

        const stats = fs.statSync(path.join(interactionDirectory, file));
        if (!stats.isDirectory()) continue;

        const interactionFiles = fs.readdirSync(path.join(interactionDirectory, file));
        for (const interactionFile of interactionFiles) {
            const interactionFileStats = fs.statSync(path.join(interactionDirectory, file, interactionFile));

            if (!interactionFileStats.isFile() || !interactionFile.endsWith(".js")) continue;

            const interaction: PossibleInteraction = require(path.join(interactionDirectory, file, interactionFile)).default;

            switch (fileName) {
                case "buttons":
                    client.buttons.push(interaction as RegisteredButtonInteraction);
                    break;
                case "selectmenus":
                    client.selectMenus.push(interaction as RegisteredSelectMenuInteraction);
                    break;
                case "modals":
                    client.modals.push(interaction as RegisteredModalSubmitInteraction);
                    break;
            }
        }
    }
};