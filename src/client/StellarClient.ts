import { Client, ClientOptions, Collection, Events, MessageCreateOptions, MessagePayload, REST, Routes, TextChannel } from "discord.js";
import path from "path";
import fs from "fs";
import ICommand, { RegisteredButtonInteraction, RegisteredModalSubmitInteraction, RegisteredSelectMenuInteraction } from "./interfaces";

export default class StellarClient extends Client {
    commands = new Collection<string, ICommand>();
    startedAt: number;
    
    buttons: RegisteredButtonInteraction[] = [];
    selectMenus: RegisteredSelectMenuInteraction[] = [];
    modals: RegisteredModalSubmitInteraction[] = [];

    constructor(options: ClientOptions) {
        super(options)
        this.startedAt = Date.now()
    }

    registerCommands() {
        const foldersPath = path.join(__dirname, '../commands');
        const commandFolders = fs.readdirSync(foldersPath)

        const commandDataJSON = []

        for (const folder of commandFolders) {
            const commandsPath = path.join(foldersPath, folder);
            const commandFiles = fs.readdirSync(commandsPath)
            for (const file of commandFiles) {
                const filePath = path.join(commandsPath, file);
		        const command = require(filePath);
                if ('data' in command && 'execute' in command) {
                    this.commands.set(command.data.name, command);
                    commandDataJSON.push(command.data.toJSON())
                } else {
                    console.log(`[WARNING] The command at ${path.join(commandsPath, file)} is missing a required "data" or "execute" property.`);
                }
            }
        }

        // Push commands to client
        const rest = new REST().setToken(process.env.BOT_TOKEN as string);

        (async () => {
            try {
                console.log(`Started refreshing ${commandDataJSON.length} application (/) commands.`);
        
                // The put method is used to fully refresh all commands in the guild with the current set
                await rest.put(
                    Routes.applicationCommands(process.env.CLIENT_ID as string),
                    { body: commandDataJSON },
                );
            } catch (error) {
                console.error(error);
            }
        })();
    }

    registerEvents() {
        const eventsDir = path.resolve(__dirname, '..', 'events');
        const files = fs.readdirSync(eventsDir);
      
        for (const file of files) {
          const filePath = path.join(eventsDir, file);
      
          if (!file.endsWith('.js')) continue;
      
          const event = require(filePath).default;
          this.on(event.type, event.execute.bind(null, this));
        }
    } 

    /*
    getSettings(id: string): Promise<IGuildSettings> {
        return new Promise(async (resolve) => {
            let settings = await GuildSettings.findOne({ guildId: id })

            if (settings == null) {
                settings = new GuildSettings({ guildId: id });
                await settings.save()
            }

            resolve(settings)
        })
    }
    */

    send(channelId: string, options: string | MessagePayload | MessageCreateOptions) {
        let channel = this.channels.cache.get(channelId) as TextChannel
        channel.send(options)
    }
}