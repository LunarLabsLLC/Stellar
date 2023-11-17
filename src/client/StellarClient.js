"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
class StellarClient extends discord_js_1.Client {
    constructor(options) {
        super(options);
        this.commands = new discord_js_1.Collection();
        this.buttons = [];
        this.selectMenus = [];
        this.modals = [];
        this.startedAt = Date.now();
    }
    registerCommands() {
        const foldersPath = path_1.default.join(__dirname, '../commands');
        const commandFolders = fs_1.default.readdirSync(foldersPath);
        const commandDataJSON = [];
        for (const folder of commandFolders) {
            const commandsPath = path_1.default.join(foldersPath, folder);
            const commandFiles = fs_1.default.readdirSync(commandsPath);
            for (const file of commandFiles) {
                const filePath = path_1.default.join(commandsPath, file);
                const command = require(filePath);
                if ('data' in command && 'execute' in command) {
                    this.commands.set(command.data.name, command);
                    commandDataJSON.push(command.data.toJSON());
                }
                else {
                    console.log(`[WARNING] The command at ${path_1.default.join(commandsPath, file)} is missing a required "data" or "execute" property.`);
                }
            }
        }
        // Push commands to client
        const rest = new discord_js_1.REST().setToken(process.env.BOT_TOKEN);
        (() => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(`Started refreshing ${commandDataJSON.length} application (/) commands.`);
                // The put method is used to fully refresh all commands in the guild with the current set
                yield rest.put(discord_js_1.Routes.applicationCommands(process.env.CLIENT_ID), { body: commandDataJSON });
            }
            catch (error) {
                console.error(error);
            }
        }))();
    }
    registerEvents() {
        const eventsDir = path_1.default.resolve(__dirname, '..', 'events');
        const files = fs_1.default.readdirSync(eventsDir);
        for (const file of files) {
            const filePath = path_1.default.join(eventsDir, file);
            if (!file.endsWith('.js'))
                continue;
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
    send(channelId, options) {
        let channel = this.channels.cache.get(channelId);
        channel.send(options);
    }
}
exports.default = StellarClient;
