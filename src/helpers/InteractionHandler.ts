import { existsSync } from "fs";
import {
  ComponentInteraction,
  Constants,
  Interaction,
  ModalSubmitInteraction,
} from "oceanic.js";
import { resolve } from "path";

import { getDirFiles } from "../utils/common.util";
import LogManager from "../managers/LogManager";

interface Handler {
  id: string;
  execute: (
    interaction: ComponentInteraction | ModalSubmitInteraction
  ) => Promise<any>;
}


export class InteractionHandler {
  private handlers: Map<string, Handler>;

  constructor() {
    this.handlers = new Map();
    this.loadHandlers().catch((e) => {
      LogManager.log(e as string, "error");
    });
  }

  public checkInteraction = async (interaction: Interaction) => {
    if (interaction instanceof ComponentInteraction) {
      await this.checkComponentInteraction(interaction);
    }

    if (interaction instanceof ModalSubmitInteraction) {
      await this.checkModalSubmitInteraction(interaction);
    }
  };

  private checkComponentInteraction = async (
    interaction: ComponentInteraction
  ) => {
    // action will be included in the custom id
    const action = interaction.data.customID.split("-")[0];

    let handler = this.handlers.get(action);

    // give higher priority to option value in select menus
    if (
      interaction.data.componentType === Constants.ComponentTypes.STRING_SELECT
    ) {
      const value = interaction.data.values.getStrings()[0].split("-")[0];

      if (value && this.handlers.has(value)) {
        handler = this.handlers.get(value);
      }
    }

    console.debug(interaction.data);

    if (!handler) {
      return;
    }

    await handler.execute(interaction);
  };

  private checkModalSubmitInteraction = async (
    interaction: ModalSubmitInteraction
  ) => {
    const action = interaction.data.customID.split("-")[0];
    const handler = this.handlers.get(action);

    if (!handler) return;

    await handler.execute(interaction);
  };

  private loadHandlers = async () => {
    const handlersDirPath = resolve(`${__dirname}/../handlers`);

    let handlerFiles: string[] = [];

    if (existsSync(handlersDirPath)) {
      handlerFiles = await getDirFiles(handlersDirPath, [".js", ".ts"]);
    }

    for (const f of handlerFiles) {
      const handler = await import(f).catch((e) => {
        LogManager.log(e as string, "error");
      });

      if (!handler) continue;

      if (this.handlers.has(handler.id)) {
        throw new Error(`HANDLER_ID_DUPLICATED [${handler.id}]`);
      }

      this.handlers.set(handler.id, handler);
    }
    LogManager.log(`interaction-handler: loaded ${this.handlers.size} handlers`, "info");
  };
}