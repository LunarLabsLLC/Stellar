import {
  Client,
  ClientOptions,
  CommandInteraction,
  CreateApplicationCommandOptions,
  Interaction,
  ModalSubmitInteraction,
} from "oceanic.js";
import { resolve } from "path";
import { getDirFiles } from "../utils/common.util";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { getBotConfig } from "../utils/config.util";
import { ModalSubmitOptionResolver } from "./ModalSubmitOptionResolver";
import { InteractionHandler } from "./InteractionHandler";
import { createHash } from "crypto";
import {
  RegisteredButtonInteraction,
  RegisteredModalSubmitInteraction,
  RegisteredSelectMenuInteraction,
} from "../managers/CommandManager";
import GuildSettingsDb from "../database/GuildSettingsDb";
import LogManager from "../managers/LogManager";
import chalk from "chalk";

const config = getBotConfig();

export type CustomApplicationCommand = {
  execute: (
    interaction: CommandInteraction,
    client: Client
  ) => Promise<any>;
  options: CreateApplicationCommandOptions;
};

export type CustomModalSubmitInteraction = ModalSubmitInteraction & {
  options: ModalSubmitOptionResolver;
};

export class StellarClient extends Client {
  private commands: Map<string, CustomApplicationCommand>;
  private interactionHandler: InteractionHandler;

  config: any;
  startedAt: number;

  buttons: RegisteredButtonInteraction[] = [];
  selectMenus: RegisteredSelectMenuInteraction[] = [];
  modals: RegisteredModalSubmitInteraction[] = [];

  // dbs
  guildDb: GuildSettingsDb;

  constructor(options: ClientOptions) {
    super(options);
    this.config = getBotConfig();
    this.commands = new Map();
    this.registerEventListeners().catch((e) => {
      LogManager.log(e as string, "error");
    });
    this.startedAt = Date.now();
    this.interactionHandler = new InteractionHandler();

    this.guildDb = new GuildSettingsDb(config);
  }

  // USEFUL FUNCTIONS DURING INTERACTION
  public getGuildSetting(
    guildID: string,
    setting: string
  ): Promise<any> {
    return this.guildDb.getSetting(guildID, setting);
  }

  private registerEventListeners = async () => {
    const eventListeners: any = {
      once: {
        ready: [{ execute: this.handleOnReady }],
      },
      on: {
        interactionCreate: [
          { execute: this.handleInteractionCreate },
        ],
        error: [{ execute: this.handleOnError }],
      },
    };

    const eventsDirPath = resolve(`${__dirname}/../events`);

    let eventFiles: string[] = [];

    if (existsSync(eventsDirPath)) {
      eventFiles = await getDirFiles(eventsDirPath, [
        ".event.js",
        ".event.ts",
      ]);
    }

    for (const f of eventFiles) {
      const event = await import(f).catch((e) => {
        LogManager.log(e as string, "error")
      });
      if (!event) continue;

      const eventType = event.once ? "once" : "on";

      if (eventListeners[eventType][event.name]) {
        eventListeners[eventType][event.name].push(event);
      } else {
        eventListeners[eventType][event.name] = [event];
      }
    }

    let onceListenerCount = 0;
    let alwaysListenerCount = 0;

    for (const eventType of Object.keys(eventListeners)) {
      for (const eventName of Object.keys(
        eventListeners[eventType]
      )) {
        //@ts-ignore
        this[eventType](eventName, (...args) => {
          for (const event of eventListeners[eventType][
            eventName
          ]) {
            if (!event.execute) {
              LogManager.log(
                `failed to find execute() for [${eventType}][${eventName}]->${event}.event`,
                "error"
              );
            }

            event?.execute(...args, this)?.catch((e: any) => {
              LogManager.log(e as string, "error");
            });
          }
        });

        eventType === "once"
          ? onceListenerCount++
          : alwaysListenerCount++;
      }
    }

    LogManager.log(
      `custom-client: registered ${
        onceListenerCount + alwaysListenerCount
      } [once: ${onceListenerCount} | always: ${alwaysListenerCount}] event listeners`,
      "info"
    );
  };

  private loadCommands = async () => {
    const commandsDirPath = resolve(`${__dirname}/../commands`);

    let commandFiles: string[] = [];

    if (existsSync(commandsDirPath)) {
      commandFiles = await getDirFiles(commandsDirPath, [
        ".cmd.js",
        ".cmd.ts",
      ]);
    }

    const commands: CreateApplicationCommandOptions[] = [];

    for (const f of commandFiles) {
      const command = await import(f).catch((e) => {
        LogManager.log(e as string, "error");
      });

      if (!command) continue;

      commands.push(command.options);
      this.commands.set(command.options.name, command);
    }

    // stringify commands array and calculate sha-256 hash
    const commandsHash = createHash("sha256")
      .update(JSON.stringify(commands))
      .digest("hex");

    // file used to store the hash of the last registered commands
    const changesFile = resolve(
      `${__dirname}/../../${
        config.PRODUCTION
          ? "cmdhash-production"
          : "cmdhash-dev"
      }`
    );

    // check if commands have changed before re-registering them again
    if (existsSync(changesFile)) {
      const oldHash = readFileSync(changesFile, "utf-8");
      if (oldHash === commandsHash) {
        LogManager.log(
          `custom-client: no changes to application commands detected`,
          "info"
        );
        return;
      }
    }

    if (config.PRODUCTION) {
      await this.application
        .bulkEditGuildCommands(
          config["TEST GUILD ID"],
          []
        )
        .catch((_) => {});
      await this.application.bulkEditGlobalCommands(
        commands
      );
    } else {
      await this.application
        .bulkEditGuildCommands(
          config["TEST GUILD ID"],
          commands
        );
      await this.application
        .bulkEditGlobalCommands([])
        .catch((_) => {});
    }

    // write commands hash to file
    writeFileSync(changesFile, commandsHash);

    LogManager.log(
      `custom-client: loaded ${
        this.commands.size
      } application commands`,
      "info"
    );
  };

  private handleOnReady = async () => {
    this.editStatus(config["STATUS"], [
      {
        name: config["ACTIVITY NAME"],
        type: config["ACTIVITY TYPE"],
      },
    ]);

    await this.loadCommands();

    let devServerName = "";

    if (!config.PRODUCTION) {
      devServerName =
        this.guilds.get(config["TEST GUILD ID"])?.name ||
        "unknown";
    }
    LogManager.log(
      chalk.dim.gray('\n━━━━━━━━━━ Started! ━━━━━━━━━━\n'),
      "default"
    );
    LogManager.log(
      `Bot:` +
        chalk.bold.greenBright(`READY`) +
        `[${this.user.username}#${this.user.discriminator}] [${config.PRODUCTION ? "PRODUCTION" : `DEVELOPMENT (${devServerName})`}]`,
      "load"
    );
  };

  private handleInteractionCreate = async (
    interaction: Interaction
  ) => {
    try {
      //@ts-ignore
      const guildID = interaction["guildID"];
      const defaultColor = "#000000"; // Replace with your desired default color
      const successColor = "#00FF00"; // Replace with your desired success color
      const errorColor = "#FF0000"; // Replace with your desired error color

      if (interaction instanceof CommandInteraction) {
        const command = this.commands.get(
          interaction.data.name
        );
        if (command) await command.execute(interaction, this);
      }

      if (interaction instanceof ModalSubmitInteraction) {
        (interaction as CustomModalSubmitInteraction).options =
          new ModalSubmitOptionResolver(
            interaction.data
          );
      }

      await this.interactionHandler.checkInteraction(
        interaction
      );
    } catch (e) {
      LogManager.log(e as string, "error");
    }
  };

  private handleOnError = async (e: any) => {
    LogManager.log(e as string, "error");
  };
}
